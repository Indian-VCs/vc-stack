/**
 * Public data-fetching layer.
 *
 * Strategy: try Cloudflare D1 first; fall back to the static catalog
 * (`./static-catalog.ts`) on any DB failure or empty result. The fallback
 * makes this safe under three conditions:
 *
 *   1. **Build-time prerendering** — `next build` runs before D1 is bound.
 *      `getDb()` throws, we silently fall back to STATIC.
 *   2. **Local dev without `local.db`** — same fallback path.
 *   3. **Production with empty D1** — admin hasn't seeded yet; STATIC keeps
 *      the public site up.
 *
 * Once D1 is seeded, every read flows through the DB. Admin writes call
 * `revalidatePath` to bust the prerender cache.
 *
 * Editorial content (intro, buyingCriteria, journey, pitfalls, readingList,
 * description) lives in JSON files at `./category-content/*.json`. Both the
 * static catalog and the D1 rows hydrate from those files; admin edits in
 * D1 win at runtime.
 *
 * The static catalog (STATIC_CATEGORIES, STATIC_TOOLS, categorySlugsForTool)
 * lives in `./static-catalog.ts` and is re-exported here. Client components
 * that only need the constants should import from `./static-catalog` directly
 * — that path has no DB dependency and won't drag the D1 driver into the
 * browser bundle.
 */

import type { Category, CategoryPreviewTool, Tool, PaginatedResult, SearchFilters } from './types'
import {
  dbGetCategories,
  dbGetCategoryBySlug,
  dbGetToolsByCategory,
  dbGetAllTools,
  dbGetToolBySlug,
  dbSearchTools,
  dbGetCategoryPreviewTools,
  dbGetCanonicalStats,
} from './db/queries'
import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
  categorySlugsForTool,
} from './static-catalog'

// Re-export the static catalog so existing `import { ... } from '@/lib/data'`
// imports keep working unchanged.
export { STATIC_CATEGORIES, STATIC_TOOLS, FEATURED_TOOL_SLUGS, categorySlugsForTool }

const PINNED_SLUG = 'evertrace'

function pinEvertrace<T extends { slug: string }>(list: T[]): T[] {
  const idx = list.findIndex((t) => t.slug === PINNED_SLUG)
  if (idx <= 0) return list
  const copy = [...list]
  const [pinned] = copy.splice(idx, 1)
  copy.unshift(pinned)
  return copy
}

function dedupeByWebsite<T extends { websiteUrl: string; name: string }>(list: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const t of list) {
    const key = (t.websiteUrl || `name:${t.name}`).replace(/\/+$/, '').toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

/** Try a DB call; return null on failure or "empty" so callers can fall back to STATIC. */
async function viaDb<T>(call: () => Promise<T>, isEmpty: (v: T) => boolean): Promise<T | null> {
  try {
    const result = await call()
    return isEmpty(result) ? null : result
  } catch {
    return null
  }
}

/**
 * Per-slug fields the static catalog owns regardless of whether D1 has a row.
 * D1 only stores editorial/structured fields — the icon, image, SEO copy,
 * hero angle, and related-slug map all live in `static-catalog.ts`. We
 * overlay those on every D1-sourced Category so both paths render identically.
 */
function overlayStaticConstants(cat: Category): Category {
  const stat = STATIC_CATEGORIES.find((c) => c.slug === cat.slug)
  if (!stat) return cat
  return {
    ...cat,
    icon: cat.icon ?? stat.icon ?? null,
    imageUrl: cat.imageUrl ?? stat.imageUrl ?? null,
    relatedSlugs: cat.relatedSlugs ?? stat.relatedSlugs ?? null,
    seoTitle: cat.seoTitle ?? stat.seoTitle ?? null,
    seoDescription: cat.seoDescription ?? stat.seoDescription ?? null,
    heroAngle: cat.heroAngle ?? stat.heroAngle ?? null,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const fromDb = await viaDb(dbGetCategories, (xs) => xs.length === 0)
  const cats = fromDb ?? STATIC_CATEGORIES
  return cats.map(overlayStaticConstants)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const fromDb = await viaDb(() => dbGetCategoryBySlug(slug), (v) => v === null)
  const cat = fromDb ?? STATIC_CATEGORIES.find((c) => c.slug === slug) ?? null
  return cat ? overlayStaticConstants(cat) : null
}

export async function getToolsByCategory(
  categorySlug: string,
  filters: { page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<Tool>> {
  const { page = 1, pageSize = 24 } = filters
  const fromDb = await viaDb(
    () => dbGetToolsByCategory(categorySlug, page, pageSize),
    (v) => v.total === 0,
  )
  if (fromDb) return { ...fromDb, data: fromDb.data.map(withCanonicalFeatured) }

  const filtered = STATIC_TOOLS
    .filter((t) => t.category?.slug === categorySlug || (t.extraCategorySlugs ?? []).includes(categorySlug))
    .map(withCanonicalFeatured)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name))
  return paginate(filtered, page, pageSize)
}

export async function getAllTools(): Promise<Tool[]> {
  const fromDb = await viaDb(dbGetAllTools, (xs) => xs.length === 0)
  const list = (fromDb ?? STATIC_TOOLS).map(withCanonicalFeatured).sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
  )
  return pinEvertrace(dedupeByWebsite(list))
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const fromDb = await viaDb(() => dbGetToolBySlug(slug), (v) => v === null)
  const tool = fromDb ?? STATIC_TOOLS.find((t) => t.slug === slug) ?? null
  return tool ? withCanonicalFeatured(tool) : null
}

export async function searchTools(filters: SearchFilters): Promise<PaginatedResult<Tool>> {
  const fromDb = await viaDb(() => dbSearchTools(filters), (v) => v.total === 0)
  if (fromDb) return { ...fromDb, data: fromDb.data.map(withCanonicalFeatured) }

  const { query = '', category, pricing, page = 1, pageSize = 24 } = filters
  let results = STATIC_TOOLS
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.shortDesc ?? '').toLowerCase().includes(q),
    )
  }
  if (category) results = results.filter((t) => categorySlugsForTool(t).includes(category))
  if (pricing) results = results.filter((t) => t.pricingModel === pricing)
  const sorted = results
    .map(withCanonicalFeatured)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name))
  return paginate(sorted, page, pageSize)
}

const FEATURED_SET: ReadonlySet<string> = new Set(FEATURED_TOOL_SLUGS)

/** Canonical featured flag — featured if the tool is on the homepage hero list
 *  (FEATURED_TOOL_SLUGS, 5 sponsor placements) OR if the per-tool seed flag is
 *  true (per-category curation). The OR keeps the homepage-5 invariant while
 *  letting category pages surface curated favourites independently. */
function withCanonicalFeatured<T extends Tool>(tool: T): T {
  const isFeatured = tool.isFeatured || FEATURED_SET.has(tool.slug)
  return tool.isFeatured === isFeatured ? tool : { ...tool, isFeatured }
}

/**
 * Resolve FEATURED_TOOL_SLUGS to full Tool objects, preserving list order.
 *
 * D1 path: when the DB has rows, the natural FEATURED_SORT in queries.ts
 * already orders featured tools first by `featuredOrder ASC`. We still pick
 * by slug here so the static fallback path keeps the same canonical list.
 */
export async function getCanonicalFeaturedTools(): Promise<Tool[]> {
  const all = await getAllTools()
  return FEATURED_TOOL_SLUGS
    .map((slug) => all.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined)
}

/**
 * Featured tools minus the tool with the given slug.
 * Falls back to in-category related tools if the canonical list minus the
 * current tool yields nothing (shouldn't happen with a reasonable list).
 */
export async function getFeaturedToolsExcluding(excludeSlug: string): Promise<Tool[]> {
  const canonical = await getCanonicalFeaturedTools()
  const filtered = canonical.filter((t) => t.slug !== excludeSlug)
  if (filtered.length > 0) return filtered

  const current = await getToolBySlug(excludeSlug)
  if (!current) return []
  return getRelatedTools(current.id, current.categoryId, 5)
}

async function getRelatedTools(toolId: string, categoryId: string, limit = 4): Promise<Tool[]> {
  // Include tools whose primary or extra category matches, excluding the current tool.
  const cat = STATIC_CATEGORIES.find((c) => c.id === categoryId)
  const catSlug = cat?.slug
  return STATIC_TOOLS
    .filter((t) => t.id !== toolId)
    .filter((t) => t.categoryId === categoryId || (catSlug ? (t.extraCategorySlugs ?? []).includes(catSlug) : false))
    .slice(0, limit)
}

/** Returns up to 6 preview tools (name + logoUrl) per category slug. */
export async function getCategoryPreviewTools(): Promise<Record<string, CategoryPreviewTool[]>> {
  const fromDb = await viaDb(dbGetCategoryPreviewTools, (v) => Object.keys(v).length === 0)
  if (fromDb) return fromDb

  const result: Record<string, CategoryPreviewTool[]> = {}
  for (const tool of STATIC_TOOLS) {
    for (const slug of categorySlugsForTool(tool)) {
      if (!result[slug]) result[slug] = []
      if (result[slug].length < 6) {
        result[slug].push({ name: tool.name, logoUrl: tool.logoUrl ?? null })
      }
    }
  }
  return result
}

/** Total appearances = sum of all (tool × category) pairs across the catalog. */
function totalAppearances(tools: Tool[]): number {
  return tools.reduce((acc, t) => acc + categorySlugsForTool(t).length, 0)
}

function positiveInt(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined && value > 0 ? value : fallback
}

function paginate<T>(items: T[], page: number | undefined, pageSize: number | undefined): PaginatedResult<T> {
  const safePageSize = positiveInt(pageSize, 24)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / safePageSize))
  const safePage = Math.min(positiveInt(page, 1), totalPages)
  const start = (safePage - 1) * safePageSize
  return {
    data: items.slice(start, start + safePageSize),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  }
}

/** Single source of truth for public-facing stats. */
export async function getCanonicalStats(): Promise<{
  totalTools: number
  uniqueTools: number
  totalCategories: number
}> {
  const fromDb = await viaDb(
    dbGetCanonicalStats,
    (v) => v.uniqueTools === 0 && v.totalCategories === 0,
  )
  if (fromDb) return fromDb

  return {
    totalTools: totalAppearances(STATIC_TOOLS),
    uniqueTools: STATIC_TOOLS.length,
    totalCategories: STATIC_CATEGORIES.length,
  }
}
