/**
 * Drizzle schema — SQLite (Cloudflare D1 in prod, better-sqlite3 in dev).
 *
 * IDs deliberately keep the human-readable `cat-N` / `t-N` form from the
 * original static catalog so the seed migration is idempotent and old URLs
 * keep resolving. New rows created via the admin UI use `crypto.randomUUID()`.
 *
 * JSON-shaped columns (useCases, buyingCriteria, etc.) are TEXT in SQLite —
 * Drizzle's `mode: 'json'` handles serialisation transparently.
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import type {
  BuyingCriterion,
  JourneyTier,
  Pitfall,
  PricingModel,
  ReadingItem,
} from '@/lib/types'

// ─── categories ──────────────────────────────────────────────────────────────
export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    imageUrl: text('image_url'),

    // pSEO content
    intro: text('intro'),
    buyingCriteria: text('buying_criteria', { mode: 'json' }).$type<BuyingCriterion[] | null>(),
    journey: text('journey', { mode: 'json' }).$type<JourneyTier | null>(),
    pitfalls: text('pitfalls', { mode: 'json' }).$type<Pitfall[] | null>(),
    readingList: text('reading_list', { mode: 'json' }).$type<ReadingItem[] | null>(),
    relatedSlugs: text('related_slugs', { mode: 'json' }).$type<string[] | null>(),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    heroAngle: text('hero_angle'),

    sortOrder: integer('sort_order').notNull().default(0),
    archivedAt: integer('archived_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => [index('categories_slug_idx').on(t.slug), index('categories_sort_idx').on(t.sortOrder)],
)

// ─── tools ───────────────────────────────────────────────────────────────────
export const tools = sqliteTable(
  'tools',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    shortDesc: text('short_desc'),
    useCases: text('use_cases', { mode: 'json' }).$type<string[] | null>(),
    keyFeatures: text('key_features', { mode: 'json' }).$type<string[] | null>(),
    websiteUrl: text('website_url').notNull(),
    logoUrl: text('logo_url'),
    pricingModel: text('pricing_model').notNull().$type<PricingModel>(),
    isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
    /** Position in the canonical Featured list — null if not featured. */
    featuredOrder: integer('featured_order'),
    categoryId: text('category_id').notNull().references(() => categories.id),
    extraCategorySlugs: text('extra_category_slugs', { mode: 'json' }).$type<string[] | null>(),
    archivedAt: integer('archived_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => [
    index('tools_slug_idx').on(t.slug),
    index('tools_category_idx').on(t.categoryId),
    index('tools_featured_idx').on(t.isFeatured, t.featuredOrder),
  ],
)

// ─── tool_submissions (inbound from /contribute/tool) ────────────────────────
export const toolSubmissions = sqliteTable(
  'tool_submissions',
  {
    id: text('id').primaryKey(),
    toolName: text('tool_name').notNull(),
    websiteUrl: text('website_url').notNull(),
    description: text('description').notNull(),
    categoryId: text('category_id').notNull(),
    pricingModel: text('pricing_model').$type<PricingModel | null>(),
    submitterEmail: text('submitter_email').notNull(),
    submitterName: text('submitter_name'),
    submitterFirm: text('submitter_firm'),
    /** we_use | i_built | i_know */
    relationship: text('relationship'),
    status: text('status').notNull().default('pending').$type<'pending' | 'approved' | 'rejected' | 'archived'>(),
    adminNotes: text('admin_notes'),
    approvedToolId: text('approved_tool_id'),
    createdAt: integer('created_at').notNull(),
    reviewedAt: integer('reviewed_at'),
  },
  (t) => [index('tool_subs_status_idx').on(t.status, t.createdAt)],
)

// ─── stack_submissions (inbound from /contribute/stack) ──────────────────────
export const stackSubmissions = sqliteTable(
  'stack_submissions',
  {
    id: text('id').primaryKey(),
    firmName: text('firm_name').notNull(),
    firmWebsite: text('firm_website'),
    submitterName: text('submitter_name').notNull(),
    submitterRole: text('submitter_role'),
    submitterEmail: text('submitter_email').notNull(),
    /** Existing tool slugs the firm uses. */
    toolSlugs: text('tool_slugs', { mode: 'json' }).$type<string[]>().notNull(),
    /** Free-text "other tools we use" the firm typed in. */
    otherTools: text('other_tools'),
    /** Optional per-tool notes: [{ slug, note }]. The editorial gold. */
    notes: text('notes', { mode: 'json' }).$type<{ slug: string; note: string }[] | null>(),
    status: text('status').notNull().default('pending').$type<'pending' | 'published' | 'rejected' | 'archived'>(),
    adminNotes: text('admin_notes'),
    publishedSlug: text('published_slug'),
    createdAt: integer('created_at').notNull(),
    reviewedAt: integer('reviewed_at'),
  },
  (t) => [index('stack_subs_status_idx').on(t.status, t.createdAt)],
)

// ─── admin_users ─────────────────────────────────────────────────────────────
export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull(),
  lastLoginAt: integer('last_login_at'),
})

// ─── audit_log ───────────────────────────────────────────────────────────────
export const auditLog = sqliteTable(
  'audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    adminEmail: text('admin_email').notNull(),
    action: text('action').notNull().$type<'create' | 'update' | 'delete' | 'publish' | 'archive' | 'login' | 'reorder'>(),
    entity: text('entity').notNull().$type<'tool' | 'category' | 'tool_submission' | 'stack_submission' | 'featured' | 'session'>(),
    entityId: text('entity_id'),
    /** Compact JSON snapshot of changed fields: { before, after } or { fields: [...] } */
    diff: text('diff', { mode: 'json' }).$type<Record<string, unknown> | null>(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [index('audit_created_idx').on(t.createdAt)],
)

// ─── inferred row types ──────────────────────────────────────────────────────
export type CategoryRow = typeof categories.$inferSelect
export type ToolRow = typeof tools.$inferSelect
export type ToolSubmissionRow = typeof toolSubmissions.$inferSelect
export type StackSubmissionRow = typeof stackSubmissions.$inferSelect
export type AdminUserRow = typeof adminUsers.$inferSelect
export type AuditLogRow = typeof auditLog.$inferSelect
