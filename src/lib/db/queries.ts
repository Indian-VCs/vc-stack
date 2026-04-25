/**
 * DB-backed query helpers — the runtime equivalent of the static helpers
 * in `src/lib/data.ts`. Each function returns the same shape as before,
 * so swapping `data.ts` → `queries.ts` is mechanical.
 *
 * Conventions:
 *   - Active-only by default (archivedAt IS NULL). Admin views opt in to
 *     archived rows by passing `{ includeArchived: true }`.
 *   - Featured ordering: `isFeatured DESC, featuredOrder ASC NULLS LAST,
 *     name ASC`. Mirrors the old in-memory sort.
 */

import { and, asc, eq, isNull, like, or, sql } from 'drizzle-orm'
import type {
  Category,
  CategoryPreviewTool,
  PaginatedResult,
  PricingModel,
  SearchFilters,
  Tool,
} from '@/lib/types'
import { getDb } from './client'
import { categories, tools, type CategoryRow, type ToolRow } from './schema'

// ─── row → domain mappers ────────────────────────────────────────────────────

function categoryFromRow(row: CategoryRow, toolCount = 0): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    imageUrl: row.imageUrl,
    intro: row.intro,
    buyingCriteria: row.buyingCriteria ?? null,
    relatedSlugs: row.relatedSlugs ?? null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    heroAngle: row.heroAngle,
    _count: { tools: toolCount },
  }
}

function toolFromRow(row: ToolRow, category?: Category): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDesc: row.shortDesc,
    useCases: row.useCases ?? undefined,
    websiteUrl: row.websiteUrl,
    logoUrl: row.logoUrl,
    pricingModel: row.pricingModel,
    isFeatured: row.isFeatured,
    categoryId: row.categoryId,
    category,
    extraCategorySlugs: row.extraCategorySlugs ?? undefined,
  }
}

// ─── categories ──────────────────────────────────────────────────────────────

interface CatOpts { includeArchived?: boolean }

export async function dbGetCategories(opts: CatOpts = {}): Promise<Category[]> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(categories)
    .where(opts.includeArchived ? undefined : isNull(categories.archivedAt))
    .orderBy(asc(categories.sortOrder), asc(categories.name))

  // Compute tool counts (primary + extra category placements) in one pass.
  const counts = await dbCategoryToolCounts()
  return rows.map((r) => categoryFromRow(r, counts.get(r.slug) ?? 0))
}

export async function dbGetCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb()
  const row = (await db.select().from(categories).where(eq(categories.slug, slug)).limit(1))[0]
  if (!row) return null
  const counts = await dbCategoryToolCounts()
  return categoryFromRow(row, counts.get(row.slug) ?? 0)
}

/**
 * Map of `categorySlug → toolCount` accounting for both primary category and
 * `extraCategorySlugs`. Computed in JS over a single SELECT — fine for ~1k tools.
 */
async function dbCategoryToolCounts(): Promise<Map<string, number>> {
  const db = await getDb()
  const rows = await db
    .select({
      slug: categories.slug,
      categoryId: tools.categoryId,
      extras: tools.extraCategorySlugs,
    })
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .where(isNull(tools.archivedAt))

  const out = new Map<string, number>()
  for (const r of rows) {
    if (r.slug) out.set(r.slug, (out.get(r.slug) ?? 0) + 1)
    for (const extra of r.extras ?? []) out.set(extra, (out.get(extra) ?? 0) + 1)
  }
  return out
}

// ─── tools ───────────────────────────────────────────────────────────────────

const FEATURED_SORT = sql`${tools.isFeatured} DESC, ${tools.featuredOrder} ASC NULLS LAST, ${tools.name} ASC`

export async function dbGetAllTools(): Promise<Tool[]> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(tools)
    .where(isNull(tools.archivedAt))
    .orderBy(FEATURED_SORT)
  const cats = await loadCategoryMap()
  return rows.map((r) => toolFromRow(r, cats.get(r.categoryId)))
}

export async function dbGetToolBySlug(slug: string): Promise<Tool | null> {
  const db = await getDb()
  const row = (await db.select().from(tools).where(eq(tools.slug, slug)).limit(1))[0]
  if (!row) return null
  const cats = await loadCategoryMap()
  return toolFromRow(row, cats.get(row.categoryId))
}

export async function dbGetToolById(id: string): Promise<Tool | null> {
  const db = await getDb()
  const row = (await db.select().from(tools).where(eq(tools.id, id)).limit(1))[0]
  if (!row) return null
  const cats = await loadCategoryMap()
  return toolFromRow(row, cats.get(row.categoryId))
}

export async function dbGetToolsByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 24,
): Promise<PaginatedResult<Tool>> {
  const db = await getDb()
  const cat = (await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1))[0]

  // Pull both primary-category matches and extras in one query, then dedupe.
  const primaryRows = cat
    ? await db
        .select()
        .from(tools)
        .where(and(eq(tools.categoryId, cat.id), isNull(tools.archivedAt)))
    : []
  // Extras (JSON LIKE search). Cheap for a small catalog.
  const extraRows = await db
    .select()
    .from(tools)
    .where(and(like(tools.extraCategorySlugs, `%"${categorySlug}"%`), isNull(tools.archivedAt)))

  const seen = new Set<string>()
  const merged: ToolRow[] = []
  for (const r of [...primaryRows, ...extraRows]) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    merged.push(r)
  }
  merged.sort((a, b) => {
    const fa = Number(b.isFeatured) - Number(a.isFeatured)
    if (fa) return fa
    const oa = (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    if (oa) return oa
    return a.name.localeCompare(b.name)
  })

  return paginate(merged.map((r) => toolFromRow(r)), page, pageSize)
}

export async function dbSearchTools(filters: SearchFilters): Promise<PaginatedResult<Tool>> {
  const { query = '', category, pricing, page = 1, pageSize = 24 } = filters
  const db = await getDb()
  const conds = [isNull(tools.archivedAt)]
  if (query) {
    const q = `%${query.toLowerCase()}%`
    conds.push(
      or(
        like(sql`lower(${tools.name})`, q),
        like(sql`lower(${tools.description})`, q),
        like(sql`lower(coalesce(${tools.shortDesc}, ''))`, q),
      )!,
    )
  }
  if (pricing) conds.push(eq(tools.pricingModel, pricing as PricingModel))

  let rows = await db.select().from(tools).where(and(...conds)).orderBy(FEATURED_SORT)

  if (category) {
    // Category filter spans primary + extras — easier to do in JS post-fetch.
    const cats = await loadCategoryMap()
    rows = rows.filter((r) => {
      const primarySlug = cats.get(r.categoryId)?.slug
      if (primarySlug === category) return true
      return (r.extraCategorySlugs ?? []).includes(category)
    })
  }

  const cats = await loadCategoryMap()
  return paginate(rows.map((r) => toolFromRow(r, cats.get(r.categoryId))), page, pageSize)
}

export async function dbGetFeaturedTools(): Promise<Tool[]> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(tools)
    .where(and(eq(tools.isFeatured, true), isNull(tools.archivedAt)))
    .orderBy(asc(tools.featuredOrder), asc(tools.name))
  const cats = await loadCategoryMap()
  return rows.map((r) => toolFromRow(r, cats.get(r.categoryId)))
}

export async function dbGetCategoryPreviewTools(): Promise<Record<string, CategoryPreviewTool[]>> {
  const all = await dbGetAllTools()
  const out: Record<string, CategoryPreviewTool[]> = {}
  for (const t of all) {
    const slugs = [t.category?.slug, ...(t.extraCategorySlugs ?? [])].filter(Boolean) as string[]
    for (const slug of slugs) {
      if (!out[slug]) out[slug] = []
      if (out[slug].length < 6) out[slug].push({ name: t.name, logoUrl: t.logoUrl ?? null })
    }
  }
  return out
}

export async function dbGetCanonicalStats(): Promise<{
  totalTools: number
  uniqueTools: number
  totalCategories: number
}> {
  const all = await dbGetAllTools()
  const cats = await dbGetCategories()
  const totalAppearances = all.reduce(
    (n, t) => n + 1 + (t.extraCategorySlugs?.length ?? 0),
    0,
  )
  return { totalTools: totalAppearances, uniqueTools: all.length, totalCategories: cats.length }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

let categoryMapCache: { at: number; map: Map<string, Category> } | null = null
const CAT_TTL_MS = 5_000 // tiny, just to coalesce repeated calls within one request

async function loadCategoryMap(): Promise<Map<string, Category>> {
  const now = Date.now()
  if (categoryMapCache && now - categoryMapCache.at < CAT_TTL_MS) {
    return categoryMapCache.map
  }
  const cats = await dbGetCategories({ includeArchived: true })
  const map = new Map(cats.map((c) => [c.id, c]))
  categoryMapCache = { at: now, map }
  return map
}

/** Invalidate any in-memory caches. Call after admin writes. */
export function invalidateQueryCache() {
  categoryMapCache = null
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  }
}
