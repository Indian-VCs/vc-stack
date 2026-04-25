/**
 * Seed local SQLite (./local.db) from the static catalog.
 *
 * Usage:
 *   npx tsx scripts/seed.ts                  # seed local.db
 *   npx tsx scripts/seed.ts --reset          # drop + recreate before seeding
 *
 * For Cloudflare D1 (production), see SETUP.md — we mirror this with
 * `wrangler d1 execute vc-stack --remote --file=./drizzle/seed.sql`.
 */

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../src/lib/db/schema'
// Import the static catalog directly — going through `data.ts` would pull in
// the D1 query layer (which is `server-only` and not loadable from a plain
// Node script).
import { STATIC_CATEGORIES, STATIC_TOOLS } from '../src/lib/static-catalog'

const args = new Set(process.argv.slice(2))
const RESET = args.has('--reset')
const DB_PATH = process.env.DB_PATH ?? './local.db'

function main() {
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
      isFeatured: t.isFeatured,
      featuredOrder: null as number | null,
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

  // Re-apply the canonical Featured order (mirror of FEATURED_TOOL_SLUGS).
  const FEATURED_ORDER = ['evertrace', 'notion', 'superhuman', 'wispr-flow', 'claude']
  sqlite.prepare('UPDATE tools SET featured_order = NULL').run()
  for (let i = 0; i < FEATURED_ORDER.length; i++) {
    db.update(schema.tools)
      .set({ featuredOrder: i, isFeatured: true })
      .where(eq(schema.tools.slug, FEATURED_ORDER[i]))
      .run()
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
