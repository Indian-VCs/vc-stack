/**
 * Data-fetching layer.
 * Reads from the static STATIC_* catalog defined in tools-data.ts.
 * No DB; the catalog is the source of truth.
 */

import type { Category, Tool, PaginatedResult, SearchFilters } from './types'
import type { PreviewTool } from '@/components/cards/CategoryCard'
import { setCategoryResolver, buildAllTools } from './tools-data'

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return STATIC_CATEGORIES
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return STATIC_CATEGORIES.find((c) => c.slug === slug) ?? null
}

type PrismaToolOrderBy = Array<Record<string, 'asc' | 'desc'> | { reviews: { _count: 'asc' | 'desc' } }>

function orderByForSort(sort: SearchFilters['sort']): PrismaToolOrderBy {
  switch (sort) {
    case 'alpha':
      return [{ name: 'asc' }]
    case 'reviews':
      return [{ reviews: { _count: 'desc' } }, { isFeatured: 'desc' }, { name: 'asc' }]
    case 'featured':
    default:
      return [{ isFeatured: 'desc' }, { name: 'asc' }]
  }
}

function sortStatic(list: Tool[], sort: SearchFilters['sort']): Tool[] {
  const out = [...list]
  switch (sort) {
    case 'alpha':
      return out.sort((a, b) => a.name.localeCompare(b.name))
    case 'reviews':
      return out.sort((a, b) => {
        const ra = a._count?.reviews ?? a.reviews?.length ?? 0
        const rb = b._count?.reviews ?? b.reviews?.length ?? 0
        if (rb !== ra) return rb - ra
        if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured)
        return a.name.localeCompare(b.name)
      })
    case 'featured':
    default:
      return out.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name)
      )
  }
}

export async function getToolsByCategory(
  categorySlug: string,
  filters: SearchFilters = {}
): Promise<PaginatedResult<Tool>> {
  const { page = 1, pageSize = 24, pricing, query, sort = 'featured' } = filters
  let filtered = STATIC_TOOLS.filter(
    (t) => t.category?.slug === categorySlug || (t.extraCategorySlugs ?? []).includes(categorySlug)
  )
  if (pricing) filtered = filtered.filter((t) => t.pricingModel === pricing)
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.shortDesc ?? '').toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }
  filtered = sortStatic(filtered, sort)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)
  return { data, total, page, pageSize, totalPages }
}

const PINNED_SLUG = 'evertrace'

function pinEverTrace<T extends { slug: string }>(list: T[]): T[] {
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

export async function getAllTools(): Promise<Tool[]> {
  const sorted = [...STATIC_TOOLS].sort((a, b) =>
    (Number(b.isFeatured) - Number(a.isFeatured)) || a.name.localeCompare(b.name)
  )
  return pinEverTrace(dedupeByWebsite(sorted))
}

export async function getFeaturedTools(limit = 12): Promise<Tool[]> {
  return pinEverTrace(STATIC_TOOLS.filter((t) => t.isFeatured)).slice(0, limit)
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return STATIC_TOOLS.find((t) => t.slug === slug) ?? null
}

export async function searchTools(filters: SearchFilters): Promise<PaginatedResult<Tool>> {
  const { query = '', category, pricing, page = 1, pageSize = 24 } = filters
  let results = STATIC_TOOLS
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.shortDesc ?? '').toLowerCase().includes(q)
    )
  }
  if (category) results = results.filter((t) => t.category?.slug === category)
  if (pricing) results = results.filter((t) => t.pricingModel === pricing)
  return { data: results, total: results.length, page: 1, pageSize: results.length, totalPages: 1 }
}

/**
 * Canonical list of featured tools — the single source of truth used across
 * the homepage hero rotator and every tool detail page's "Featured Tools" row.
 * Edit this list to change which tools are featured everywhere.
 */
export const FEATURED_TOOL_SLUGS = [
  'evertrace',
  'notion',
  'superhuman',
  'wispr-flow',
  'claude',
] as const

/** Resolve FEATURED_TOOL_SLUGS to full Tool objects, preserving list order. */
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

export async function getRelatedTools(toolId: string, categoryId: string, limit = 4): Promise<Tool[]> {
  // Include tools whose primary or extra category matches, excluding the current tool.
  const cat = STATIC_CATEGORIES.find((c) => c.id === categoryId)
  const catSlug = cat?.slug
  return STATIC_TOOLS
    .filter((t) => t.id !== toolId)
    .filter((t) => t.categoryId === categoryId || (catSlug ? (t.extraCategorySlugs ?? []).includes(catSlug) : false))
    .slice(0, limit)
}

export async function getSiteStats() {
  return {
    toolCount: STATIC_TOOLS.length,
    categoryCount: STATIC_CATEGORIES.length,
    reviewCount: 0,
    submissionCount: 0,
  }
}

/** Returns up to 6 preview tools (name + logoUrl) per category slug. */
export async function getCategoryPreviewTools(): Promise<Record<string, PreviewTool[]>> {
  const result: Record<string, PreviewTool[]> = {}
  for (const tool of STATIC_TOOLS) {
    const slug = tool.category?.slug
    if (!slug) continue
    if (!result[slug]) result[slug] = []
    if (result[slug].length < 6) {
      result[slug].push({ name: tool.name, logoUrl: tool.logoUrl ?? null })
    }
  }
  return result
}

// ─── Category images — served locally from public/images/categories/ ──────────
const CAT_IMAGES: Record<string, string> = {
  'crm':                      '/images/categories/crm.jpg',
  'data':                     '/images/categories/data.jpg',
  'research':                 '/images/categories/research.jpg',
  'news':                     '/images/categories/news-resources.jpg',
  'portfolio-management':     '/images/categories/portfolio-management.jpg',
  'admin-ops':                '/images/categories/infrastructure.jpg',
  'communication':            '/images/categories/video-conferencing.jpg',
  'mailing':                  '/images/categories/email.jpg',
  'calendar':                 '/images/categories/calendar.jpg',
  'productivity':             '/images/categories/project-management.jpg',
  'vibe-coding':              '/images/categories/platform.jpg',
  'other-tools':              '/images/categories/other-tools.jpg',
}

// ─── Static fallback data (IndianVCs VC Stack 2026 — 19 sections) ─────────────

export const STATIC_CATEGORIES: Category[] = [
  { id: 'cat-1',  name: 'CRM',                 slug: 'crm',                 description: 'Relationship ledgers for private capital. Track every conversation, intro, and follow-up across the firm’s deal flow.',                                       icon: '🤝', imageUrl: CAT_IMAGES['crm'] ?? null,                 _count: { tools: 11 } },
  { id: 'cat-2',  name: 'Data',                slug: 'data',                description: 'Market databases, company graphs, and private-market intelligence. The raw material behind every investment memo.',                                         icon: '📈', imageUrl: CAT_IMAGES['data'] ?? null,                _count: { tools: 12 } },
  { id: 'cat-3',  name: 'Research',            slug: 'research',            description: 'Primary and secondary research workbenches. Expert calls, sector scans, and the long read behind a short decision.',                                     icon: '🔬', imageUrl: CAT_IMAGES['research'] ?? null,            _count: { tools: 14 } },
  { id: 'cat-4',  name: 'News',                slug: 'news',                description: 'The daily broadsheet of venture. Feeds, aggregators, and newsletters investors read before the first coffee.',                                         icon: '📰', imageUrl: CAT_IMAGES['news'] ?? null,                _count: { tools: 14 } },
  { id: 'cat-5',  name: 'AI',                  slug: 'ai',                  description: 'General-purpose copilots and assistants. The cognitive layer sitting under every other workflow on this page.',                                         icon: '✨', imageUrl: null,                                     _count: { tools: 6 } },
  { id: 'cat-6',  name: 'Portfolio Management', slug: 'portfolio-management', description: 'Where a fund watches what it already owns. Metrics, KPIs, and quarterly letters for the companies on the cap table.',                              icon: '📊', imageUrl: CAT_IMAGES['portfolio-management'] ?? null, _count: { tools: 4 } },
  // cat-7 Captable retired — startup-stack concern; tools moved into Other Tools.
  // cat-8 Finance  retired — payroll/HRMS tools moved into Other Tools.
  { id: 'cat-9',  name: 'Admin & Ops',         slug: 'admin-ops',           description: 'Fund administration, compliance, and the operational scaffolding behind running a venture firm.',                                                 icon: '⚙️', imageUrl: CAT_IMAGES['admin-ops'] ?? null,           _count: { tools: 4 } },
  { id: 'cat-10', name: 'Automation',          slug: 'automation',          description: 'Workflow glue. No-code engines that wire your CRM, inbox, and data room together without a developer.',                                          icon: '🔁', imageUrl: null,                                     _count: { tools: 3 } },
  { id: 'cat-11', name: 'Communication',       slug: 'communication',       description: 'Where the partnership talks to itself and the outside world. Chat, video, and the rooms where diligence happens.',                              icon: '💬', imageUrl: CAT_IMAGES['communication'] ?? null,       _count: { tools: 4 } },
  { id: 'cat-12', name: 'Mailing',             slug: 'mailing',             description: 'Inbox infrastructure. From founder LPs mail to quarterly newsletters, this is where correspondence is sent and filed.',                          icon: '📧', imageUrl: CAT_IMAGES['mailing'] ?? null,             _count: { tools: 4 } },
  { id: 'cat-13', name: 'Calendar',            slug: 'calendar',            description: 'Booking, blocking, and defending time. Tools that decide when the partnership meets and when the founder gets ten minutes.',                     icon: '📅', imageUrl: CAT_IMAGES['calendar'] ?? null,            _count: { tools: 4 } },
  { id: 'cat-14', name: 'Transcription',       slug: 'transcription',       description: 'Meeting recorders and note-takers. Every call, pitch, and partner meeting turned into searchable text.',                                          icon: '📝', imageUrl: null,                                     _count: { tools: 6 } },
  { id: 'cat-15', name: 'Voice to Text',       slug: 'voice-to-text',       description: 'Dictation for the investor on the move. Turn voice memos between meetings into memos in the CRM.',                                              icon: '🎙️', imageUrl: null,                                     _count: { tools: 4 } },
  { id: 'cat-16', name: 'Productivity',        slug: 'productivity',        description: 'Docs, wikis, and task boards. The second brain where theses, diligence, and portfolio notes all live.',                                         icon: '🗂️', imageUrl: CAT_IMAGES['productivity'] ?? null,        _count: { tools: 4 } },
  { id: 'cat-17', name: 'Vibe Coding',         slug: 'vibe-coding',         description: 'AI-native builders for non-engineers. Prototype a landing page, a dashboard, or a diligence tool before lunch.',                                  icon: '🛠️', imageUrl: CAT_IMAGES['vibe-coding'] ?? null,         _count: { tools: 4 } },
  { id: 'cat-18', name: 'Browser',             slug: 'browser',             description: 'The window to the work. Investor-grade browsers with tabs, workspaces, and AI built into the address bar.',                                      icon: '🌐', imageUrl: null,                                     _count: { tools: 5 } },
  { id: 'cat-19', name: 'Other Tools',         slug: 'other-tools',         description: 'Everything else on the investor’s desktop. Design files, storage, shortcuts, and the utilities that refuse a tidier shelf.',                icon: '🔧', imageUrl: CAT_IMAGES['other-tools'] ?? null,         _count: { tools: 21 } },
]

function catById(id: string): Category {
  return STATIC_CATEGORIES.find((c) => c.id === id) ?? STATIC_CATEGORIES[0]
}

// Wire up category resolver and build the canonical tool catalog
setCategoryResolver(catById)
export const STATIC_TOOLS: Tool[] = buildAllTools()

/** All category slugs a tool belongs to (primary + extras). */
export function categorySlugsForTool(tool: Tool): string[] {
  const primary = tool.category?.slug
  const extras = tool.extraCategorySlugs ?? []
  return primary ? [primary, ...extras] : extras
}

/** Total appearances = sum of all (tool × category) pairs across the catalog. */
function totalAppearances(tools: Tool[]): number {
  return tools.reduce((acc, t) => acc + categorySlugsForTool(t).length, 0)
}

// Backfill STATIC_CATEGORIES._count.tools with live counts so nothing drifts.
for (const cat of STATIC_CATEGORIES) {
  const count = STATIC_TOOLS.filter((t) => categorySlugsForTool(t).includes(cat.slug)).length
  cat._count = { tools: count }
}

/** Single source of truth for public-facing stats. */
export async function getCanonicalStats(): Promise<{
  totalTools: number
  uniqueTools: number
  totalCategories: number
}> {
  return {
    totalTools: totalAppearances(STATIC_TOOLS),
    uniqueTools: STATIC_TOOLS.length,
    totalCategories: STATIC_CATEGORIES.length,
  }
}
