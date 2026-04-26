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
 *
 * Editorial content (intro / buyingCriteria / journey / pitfalls / readingList /
 * description) is sourced from the JSON files in `./category-content/*.json`.
 * Those files are the canonical upstream for both the static fallback (this
 * file) and the D1 rows populated by `scripts/apply-category-content.ts`.
 */

import type {
  BuyingCriterion,
  Category,
  JourneyTier,
  Pitfall,
  ReadingItem,
  Tool,
} from './types'
import { setCategoryResolver, buildAllTools } from './tools-data'

// ─── Editorial content (one JSON per category) ───────────────────────────────
import adminOpsContent from './category-content/admin-ops.json'
import aiContent from './category-content/ai.json'
import automationContent from './category-content/automation.json'
import browserContent from './category-content/browser.json'
import calendarContent from './category-content/calendar.json'
import communicationContent from './category-content/communication.json'
import crmContent from './category-content/crm.json'
import dataContent from './category-content/data.json'
import mailingContent from './category-content/mailing.json'
import newsContent from './category-content/news.json'
import otherToolsContent from './category-content/other-tools.json'
import portfolioManagementContent from './category-content/portfolio-management.json'
import productivityContent from './category-content/productivity.json'
import researchContent from './category-content/research.json'
import transcriptionContent from './category-content/transcription.json'
import vibeCodingContent from './category-content/vibe-coding.json'
import voiceToTextContent from './category-content/voice-to-text.json'

interface CategoryContentJson {
  slug: string
  name: string
  description: string
  intro: string
  journey: JourneyTier | null
  buying_criteria: BuyingCriterion[]
  pitfalls: Pitfall[]
  reading_list: ReadingItem[]
}

const CONTENT_BY_SLUG: Record<string, CategoryContentJson> = {
  'admin-ops': adminOpsContent as CategoryContentJson,
  'ai': aiContent as CategoryContentJson,
  'automation': automationContent as CategoryContentJson,
  'browser': browserContent as CategoryContentJson,
  'calendar': calendarContent as CategoryContentJson,
  'communication': communicationContent as CategoryContentJson,
  'crm': crmContent as CategoryContentJson,
  'data': dataContent as CategoryContentJson,
  'mailing': mailingContent as CategoryContentJson,
  'news': newsContent as CategoryContentJson,
  'other-tools': otherToolsContent as CategoryContentJson,
  'portfolio-management': portfolioManagementContent as CategoryContentJson,
  'productivity': productivityContent as CategoryContentJson,
  'research': researchContent as CategoryContentJson,
  'transcription': transcriptionContent as CategoryContentJson,
  'vibe-coding': vibeCodingContent as CategoryContentJson,
  'voice-to-text': voiceToTextContent as CategoryContentJson,
}

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

// Per-slug SEO + hero copy. Carried forward from the previous category-content.ts
// overlay; the JSON files don't yet cover these fields.
interface CategorySeo {
  seoTitle: string
  seoDescription: string
  heroAngle: string
}
const SEO_BY_SLUG: Record<string, CategorySeo> = {
  'crm': {
    seoTitle: 'CRM for VCs · Top Tools in 2026 | VC Stack',
    seoDescription: "The CRMs India's top VCs actually use in 2026. Buying guide, editorial top picks (Affinity, Attio, Taghash), and honest comparisons for funds of every size.",
    heroAngle: 'The deal-flow operating system. How Indian VCs track founder relationships, pipeline, and portfolio signals — from first meeting to exit.',
  },
  'data': {
    seoTitle: 'Data Tools for VCs · Private Market Intelligence 2026',
    seoDescription: 'The private-market data stack Indian VCs run on in 2026. PitchBook, Harmonic, Tracxn, Venture Intelligence — picked for dealflow, diligence, and LP work.',
    heroAngle: 'Market databases, company graphs, and private-market intelligence. The raw material behind every investment memo.',
  },
  'research': {
    seoTitle: 'Research Tools for VCs · Diligence Stack 2026',
    seoDescription: 'The research tools Indian VCs use for diligence: expert networks, sector intelligence, and primary-market research. AlphaSense, Redseer, Kavi, and more.',
    heroAngle: 'Primary and secondary research workbenches. Expert calls, sector scans, and the long read behind a short decision.',
  },
  'news': {
    seoTitle: 'News Sources for VCs · Daily Reading List 2026',
    seoDescription: 'The news sites and newsletters Indian VCs actually read each morning. The Ken, The Generalist, Inc42, VCCircle, Morning Context — ranked and explained.',
    heroAngle: 'The daily broadsheet of venture. Feeds, aggregators, and newsletters investors read before the first coffee.',
  },
  'ai': {
    seoTitle: 'AI Tools for VCs · Investor Copilots in 2026',
    seoDescription: 'The AI stack Indian VCs actually use: Claude, ChatGPT, Perplexity, Gemini. How to pick, how to set up Projects, and where AI breaks during diligence.',
    heroAngle: 'General-purpose copilots and assistants. The cognitive layer sitting under every other workflow on this page.',
  },
  'portfolio-management': {
    seoTitle: 'Portfolio Management for VCs · Top Tools 2026',
    seoDescription: 'The portfolio-monitoring and LP-reporting tools VCs use in 2026. Taghash, Standard Metrics, Carta, Vestberry — picked for Indian funds of every size.',
    heroAngle: 'Where a fund watches what it already owns. Metrics, KPIs, and quarterly letters for the companies on the cap table.',
  },
  'admin-ops': {
    seoTitle: 'Fund Admin & Ops Tools for VCs · India 2026',
    seoDescription: 'The fund-admin, syndicate, and AIF-ops platforms Indian VCs rely on. AngelList, LetsVenture, Incentive, Carta — picked for SEBI-registered funds and angels.',
    heroAngle: 'Fund administration, compliance, and the operational scaffolding behind running a venture firm.',
  },
  'automation': {
    seoTitle: 'Automation Tools for VCs · Zapier, Make, PhantomBuster',
    seoDescription: 'The no-code automation platforms VCs use to wire CRMs, inboxes, and data rooms together. Zapier, Make, PhantomBuster — compared for fund workflows in 2026.',
    heroAngle: 'Workflow glue. No-code engines that wire your CRM, inbox, and data room together without a developer.',
  },
  'communication': {
    seoTitle: 'Communication Tools for VCs · Slack, WhatsApp, Discord',
    seoDescription: 'How Indian VCs actually talk — with founders, with LPs, and with each other. WhatsApp, Slack, Discord, Telegram — picked for fund ops in 2026.',
    heroAngle: 'Where the partnership talks to itself and the outside world. Chat, video, and the rooms where diligence happens.',
  },
  'mailing': {
    seoTitle: 'Email Tools for VCs · Superhuman, Shortwave, Notion Mail',
    seoDescription: 'The email clients Indian VCs use to triage inbound decks, send LP updates, and manage founder follow-ups. Superhuman, Shortwave, Notion Mail — compared.',
    heroAngle: 'Inbox infrastructure. From founder LP mail to quarterly newsletters, this is where correspondence is sent and filed.',
  },
  'calendar': {
    seoTitle: 'Calendar Tools for VCs · Vimcal, Calendly, Cal.com',
    seoDescription: 'The scheduling and booking tools Indian VCs rely on. Vimcal, Calendly, Cal.com, Notion Calendar — compared for partner meetings and founder calls.',
    heroAngle: 'Booking, blocking, and defending time. Tools that decide when the partnership meets and when the founder gets ten minutes.',
  },
  'transcription': {
    seoTitle: 'Transcription Tools for VCs · Granola, Fathom, Fireflies',
    seoDescription: 'The AI meeting notetakers Indian VCs use in 2026. Granola, Fathom, Fireflies, Otter — compared for founder calls, IC notes, and diligence interviews.',
    heroAngle: 'Meeting recorders and note-takers. Every call, pitch, and partner meeting turned into searchable text.',
  },
  'voice-to-text': {
    seoTitle: 'Voice to Text Tools for VCs · Wispr Flow, Superwhisper',
    seoDescription: 'The dictation tools Indian VCs use between meetings. Wispr Flow, Superwhisper, Aqua Voice, Willow — compared for founder notes, CRM entries, and quick memos.',
    heroAngle: 'Dictation for the investor on the move. Turn voice memos between meetings into memos in the CRM.',
  },
  'productivity': {
    seoTitle: 'Productivity Tools for VCs · Notion, Coda, Google Sheets',
    seoDescription: 'The docs, wikis, and task boards that run Indian venture firms. Notion, Coda, Google Sheets — compared for IC memos, portfolio tracking, and firm ops.',
    heroAngle: 'Docs, wikis, and task boards. The second brain where theses, diligence, and portfolio notes all live.',
  },
  'vibe-coding': {
    seoTitle: 'Vibe Coding Tools for VCs · Lovable, Bolt, Replit',
    seoDescription: 'The AI-native builders Indian VCs use to prototype landing pages, dashboards, and diligence tools without engineers. Lovable, Bolt, Replit, Emergent.',
    heroAngle: 'AI-native builders for non-engineers. Prototype a landing page, a dashboard, or a diligence tool before lunch.',
  },
  'browser': {
    seoTitle: 'Browsers for VCs · Arc, Comet, Atlas, Chrome in 2026',
    seoDescription: 'The browsers Indian VCs use to run dealflow, diligence, and research. Arc, Comet, Atlas, Chrome, Brave — compared for tabs, AI, and investor workflows.',
    heroAngle: 'The window to the work. Investor-grade browsers with tabs, workspaces, and AI built into the address bar.',
  },
}

// Per-slug related-category links (used for cross-linking on the category page).
// Carried forward from the previous category-content.ts overlay.
const RELATED_BY_SLUG: Record<string, string[]> = {
  'crm': ['data', 'research', 'portfolio-management', 'admin-ops'],
  'data': ['crm', 'research', 'news', 'portfolio-management'],
  'research': ['data', 'ai', 'news', 'crm'],
  'news': ['data', 'research', 'ai', 'crm'],
  'ai': ['transcription', 'research', 'productivity', 'vibe-coding'],
  'portfolio-management': ['crm', 'admin-ops', 'data', 'communication'],
  'admin-ops': ['portfolio-management', 'crm', 'automation', 'data'],
  'automation': ['crm', 'productivity', 'data', 'admin-ops'],
  'communication': ['crm', 'mailing', 'productivity', 'transcription'],
  'mailing': ['communication', 'productivity', 'calendar', 'crm'],
  'calendar': ['mailing', 'productivity', 'communication', 'transcription'],
  'transcription': ['ai', 'communication', 'crm', 'productivity'],
  'voice-to-text': ['ai', 'transcription', 'productivity', 'crm'],
  'productivity': ['communication', 'mailing', 'automation', 'crm'],
  'vibe-coding': ['ai', 'productivity', 'automation', 'browser'],
  'browser': ['ai', 'productivity', 'research', 'news'],
  'other-tools': ['productivity', 'admin-ops', 'browser', 'communication'],
}

// ─── Base shape (id / icon / image / count). Editorial fields are merged from JSON. ─
interface BaseCategory {
  id: string
  name: string
  slug: string
  icon: string
  toolCount: number
}

const BASE_CATEGORIES: BaseCategory[] = [
  { id: 'cat-1',  name: 'CRM',                  slug: 'crm',                  icon: '🤝', toolCount: 10 },
  { id: 'cat-2',  name: 'Data',                 slug: 'data',                 icon: '📈', toolCount: 13 },
  { id: 'cat-3',  name: 'Research',             slug: 'research',             icon: '🔬', toolCount: 14 },
  { id: 'cat-4',  name: 'News',                 slug: 'news',                 icon: '📰', toolCount: 14 },
  { id: 'cat-5',  name: 'AI',                   slug: 'ai',                   icon: '✨', toolCount: 6 },
  { id: 'cat-6',  name: 'Portfolio Management', slug: 'portfolio-management', icon: '📊', toolCount: 4 },
  // cat-7 Captable retired — startup-stack concern; tools moved into Other Tools.
  // cat-8 Finance  retired — payroll/HRMS tools moved into Other Tools.
  { id: 'cat-9',  name: 'Admin & Ops',          slug: 'admin-ops',            icon: '⚙️', toolCount: 4 },
  { id: 'cat-10', name: 'Automation',           slug: 'automation',           icon: '🔁', toolCount: 3 },
  { id: 'cat-11', name: 'Communication',        slug: 'communication',        icon: '💬', toolCount: 4 },
  { id: 'cat-12', name: 'Mailing',              slug: 'mailing',              icon: '📧', toolCount: 4 },
  { id: 'cat-13', name: 'Calendar',             slug: 'calendar',             icon: '📅', toolCount: 4 },
  { id: 'cat-14', name: 'Transcription',        slug: 'transcription',        icon: '📝', toolCount: 6 },
  { id: 'cat-15', name: 'Voice to Text',        slug: 'voice-to-text',        icon: '🎙️', toolCount: 4 },
  { id: 'cat-16', name: 'Productivity',         slug: 'productivity',         icon: '🗂️', toolCount: 4 },
  { id: 'cat-17', name: 'Vibe Coding',          slug: 'vibe-coding',          icon: '🛠️', toolCount: 4 },
  { id: 'cat-18', name: 'Browser',              slug: 'browser',              icon: '🌐', toolCount: 5 },
  { id: 'cat-19', name: 'Other Tools',          slug: 'other-tools',          icon: '🔧', toolCount: 21 },
]

function buildCategory(base: BaseCategory): Category {
  const content = CONTENT_BY_SLUG[base.slug]
  const seo = SEO_BY_SLUG[base.slug]
  return {
    id: base.id,
    name: base.name,
    slug: base.slug,
    description: content?.description ?? null,
    icon: base.icon,
    imageUrl: CAT_IMAGES[base.slug] ?? null,
    intro: content?.intro ?? null,
    buyingCriteria: content?.buying_criteria ?? null,
    journey: content?.journey ?? null,
    pitfalls: content?.pitfalls ?? null,
    readingList: content?.reading_list ?? null,
    relatedSlugs: RELATED_BY_SLUG[base.slug] ?? null,
    seoTitle: seo?.seoTitle ?? null,
    seoDescription: seo?.seoDescription ?? null,
    heroAngle: seo?.heroAngle ?? null,
    _count: { tools: base.toolCount },
  }
}

export const STATIC_CATEGORIES: Category[] = BASE_CATEGORIES.map(buildCategory)

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
