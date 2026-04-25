/**
 * Seed local SQLite (./local.db) from the static catalog.
 *
 * Usage:
 *   npx tsx scripts/seed.ts                  # seed local.db
 *   npx tsx scripts/seed.ts --reset          # drop + recreate before seeding
 *   npx tsx scripts/seed.ts --sql            # print D1-compatible seed SQL
 *
 * For Cloudflare D1 (production), see SETUP.md — we mirror this with
 * `npm run --silent seed:sql > /tmp/vc-stack-seed.sql` and
 * `wrangler d1 execute vc-stack --remote --file=/tmp/vc-stack-seed.sql`.
 */

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../src/lib/db/schema'
// Import the static catalog directly — going through `data.ts` would pull in
// the D1 query layer (which is `server-only` and not loadable from a plain
// Node script).
import { STATIC_CATEGORIES, STATIC_TOOLS } from '../src/lib/static-catalog'

const args = new Set(process.argv.slice(2))
const RESET = args.has('--reset')
const SQL = args.has('--sql')
const DB_PATH = process.env.DB_PATH ?? './local.db'
const FEATURED_ORDER = ['evertrace', 'notion', 'superhuman', 'wispr-flow', 'claude']

type SqlValue = string | number | boolean | null | unknown[] | Record<string, unknown>

function sqlLiteral(value: SqlValue | undefined): string {
  if (value === undefined || value === null) return 'NULL'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
  return `'${JSON.stringify(value).replace(/'/g, "''")}'`
}

function upsertSql(table: string, row: Record<string, SqlValue>, immutable = new Set<string>()) {
  const columns = Object.keys(row)
  const values = columns.map((column) => sqlLiteral(row[column]))
  const updates = columns
    .filter((column) => column !== 'id' && !immutable.has(column))
    .map((column) => `${column}=excluded.${column}`)
  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT(id) DO UPDATE SET ${updates.join(', ')};`
}

function printSeedSql() {
  const now = Date.now()
  console.log('BEGIN TRANSACTION;')
  for (let i = 0; i < STATIC_CATEGORIES.length; i++) {
    const c = STATIC_CATEGORIES[i]
    console.log(upsertSql('categories', {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? null,
      icon: c.icon ?? null,
      image_url: c.imageUrl ?? null,
      intro: c.intro ?? null,
      buying_criteria: c.buyingCriteria ?? null,
      related_slugs: c.relatedSlugs ?? null,
      seo_title: c.seoTitle ?? null,
      seo_description: c.seoDescription ?? null,
      hero_angle: c.heroAngle ?? null,
      sort_order: i,
      archived_at: null,
      created_at: now,
      updated_at: now,
    }, new Set(['created_at'])))
  }

  for (const t of STATIC_TOOLS) {
    const featuredOrder = FEATURED_ORDER.indexOf(t.slug)
    console.log(upsertSql('tools', {
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      short_desc: t.shortDesc ?? null,
      use_cases: t.useCases ?? null,
      website_url: t.websiteUrl,
      logo_url: t.logoUrl ?? null,
      pricing_model: t.pricingModel,
      is_featured: featuredOrder >= 0,
      featured_order: featuredOrder >= 0 ? featuredOrder : null,
      category_id: t.categoryId,
      extra_category_slugs: t.extraCategorySlugs ?? null,
      archived_at: null,
      created_at: now,
      updated_at: now,
    }, new Set(['created_at'])))
  }
  console.log('COMMIT;')
}

function main() {
  if (SQL) {
    printSeedSql()
    return
  }

  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  if (RESET) {
    const drops = [
      'audit_log',
      'admin_users',
      'stack_submissions',
      'tool_submissions',
      'tools',
      'categories',
      '__drizzle_migrations',
    ]
    for (const t of drops) sqlite.prepare(`DROP TABLE IF EXISTS ${t}`).run()
    console.log('— reset: dropped all tables')
  }

  const db = drizzle(sqlite, { schema })
  const now = Date.now()

  let catUpserts = 0
  for (let i = 0; i < STATIC_CATEGORIES.length; i++) {
    const c = STATIC_CATEGORIES[i]
    const row = {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? null,
      icon: c.icon ?? null,
      imageUrl: c.imageUrl ?? null,
      intro: c.intro ?? null,
      buyingCriteria: c.buyingCriteria ?? null,
      relatedSlugs: c.relatedSlugs ?? null,
      seoTitle: c.seoTitle ?? null,
      seoDescription: c.seoDescription ?? null,
      heroAngle: c.heroAngle ?? null,
      sortOrder: i,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    db.insert(schema.categories)
      .values(row)
      .onConflictDoUpdate({
        target: schema.categories.id,
        set: { ...row, createdAt: undefined as never },
      })
      .run()
    catUpserts++
  }

  let toolUpserts = 0
  for (const t of STATIC_TOOLS) {
    const featuredOrder = FEATURED_ORDER.indexOf(t.slug)
    const row = {
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      shortDesc: t.shortDesc ?? null,
      useCases: t.useCases ?? null,
      websiteUrl: t.websiteUrl,
      logoUrl: t.logoUrl ?? null,
      pricingModel: t.pricingModel,
      isFeatured: featuredOrder >= 0,
      featuredOrder: featuredOrder >= 0 ? featuredOrder : null,
      categoryId: t.categoryId,
      extraCategorySlugs: t.extraCategorySlugs ?? null,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    db.insert(schema.tools)
      .values(row)
      .onConflictDoUpdate({
        target: schema.tools.id,
        set: { ...row, createdAt: undefined as never },
      })
      .run()
    toolUpserts++
  }

  console.log(`✓ seeded ${catUpserts} categories and ${toolUpserts} tools into ${DB_PATH}`)
  sqlite.close()
}

try {
  main()
} catch (err) {
  console.error('seed failed:', err)
  process.exit(1)
}
