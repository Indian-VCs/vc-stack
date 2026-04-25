/**
 * Static catalog — STATIC_CATEGORIES, STATIC_TOOLS, and the
 * `categorySlugsForTool` helper.
 *
 * This file is **client-safe**. It has no DB / Drizzle / Node imports, so
 * client components (Navbar, stats badges, etc.) can pull constants from here
 * without dragging the D1 driver into the browser bundle.
 *
 * `data.ts` re-exports everything here AND adds the D1-backed wrappers used by
 * server pages. The wrappers fall back to these statics when the DB is empty
 * or unreachable — see `data.ts` for the fallback strategy.
 */

import type { Category, Tool } from './types'
import { setCategoryResolver, buildAllTools } from './tools-data'

// Category images — served locally from public/images/categories/
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

// Wire up the category resolver and build the canonical tool catalog.
setCategoryResolver(catById)
export const STATIC_TOOLS: Tool[] = buildAllTools()

/**
 * Canonical Featured list — the single source of truth for which tools rotate
 * through the homepage hero and the per-page "Featured Tools" row. Edit this
 * to change either surface. Mirrored by the admin Seed action and scripts/seed.ts.
 */
export const FEATURED_TOOL_SLUGS = [
  'evertrace',
  'notion',
  'superhuman',
  'wispr-flow',
  'claude',
] as const

/** All category slugs a tool belongs to (primary + extras). */
export function categorySlugsForTool(tool: Tool): string[] {
  const primary = tool.category?.slug
  const extras = tool.extraCategorySlugs ?? []
  return primary ? [primary, ...extras] : extras
}

// Backfill STATIC_CATEGORIES._count.tools with live counts so nothing drifts.
for (const cat of STATIC_CATEGORIES) {
  const count = STATIC_TOOLS.filter((t) => categorySlugsForTool(t).includes(cat.slug)).length
  cat._count = { tools: count }
}
