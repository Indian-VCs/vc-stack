/**
 * Apply category-content updates from src/lib/category-content/*.json into D1.
 *
 * Usage (local):
 *   npx tsx scripts/apply-category-content.ts            # → ./local.db
 *   DB_PATH=/path/to/db npx tsx scripts/apply-category-content.ts
 *
 * Production path: regenerate seed.sql from the static catalog (which already
 * imports the same JSONs) and apply via wrangler:
 *   npx tsx scripts/generate-seed-sql.ts
 *   npx wrangler d1 execute vc-stack --remote --file=./drizzle/seed.sql
 *
 * The script is idempotent. All UPDATEs run inside one transaction; if any row
 * fails the whole batch rolls back.
 */

import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type {
  BuyingCriterion,
  JourneyTier,
  Pitfall,
  ReadingItem,
} from '../src/lib/types'

interface ManifestEntry {
  slug: string
  name: string
  file: string
}

interface Manifest {
  categories: ManifestEntry[]
}

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

const CONTENT_DIR = resolve(__dirname, '../src/lib/category-content')
const DB_PATH = process.env.DB_PATH ?? './local.db'

function readManifest(): Manifest {
  const raw = readFileSync(resolve(CONTENT_DIR, '_manifest.json'), 'utf8')
  return JSON.parse(raw) as Manifest
}

function readCategoryJson(slug: string): CategoryContentJson {
  const raw = readFileSync(resolve(CONTENT_DIR, `${slug}.json`), 'utf8')
  return JSON.parse(raw) as CategoryContentJson
}

function jsonOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return JSON.stringify(value)
}

function main() {
  const manifest = readManifest()
  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  const stmt = sqlite.prepare(`
    UPDATE categories
       SET description    = @description,
           intro          = @intro,
           journey        = @journey,
           buying_criteria = @buying_criteria,
           pitfalls       = @pitfalls,
           reading_list   = @reading_list,
           updated_at     = @updated_at
     WHERE slug = @slug
  `)

  const now = Date.now()
  let updated = 0
  let missing = 0

  const tx = sqlite.transaction(() => {
    for (const entry of manifest.categories) {
      const content = readCategoryJson(entry.slug)
      const result = stmt.run({
        slug: entry.slug,
        description: content.description,
        intro: content.intro,
        journey: jsonOrNull(content.journey),
        buying_criteria: jsonOrNull(content.buying_criteria),
        pitfalls: jsonOrNull(content.pitfalls),
        reading_list: jsonOrNull(content.reading_list),
        updated_at: now,
      })
      if (result.changes === 0) {
        console.warn(`  · no row for slug=${entry.slug} — skipped`)
        missing++
      } else {
        updated++
      }
    }
  })

  tx()
  sqlite.close()

  console.log(`✓ updated ${updated} categories in ${DB_PATH}`)
  if (missing > 0) {
    console.warn(`⚠ ${missing} categories had no matching row — run scripts/seed.ts first.`)
  }
}

try {
  main()
} catch (err) {
  console.error('apply-category-content failed:', err)
  process.exit(1)
}
