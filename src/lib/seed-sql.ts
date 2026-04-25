/**
 * Build the canonical seed SQL from static-catalog.ts.
 *
 * Used by both scripts/generate-seed-sql.ts (file emission) and the admin
 * Seed action (runtime execution against D1). Single source of truth so the
 * SQL stays in lockstep with STATIC_CATEGORIES / STATIC_TOOLS / FEATURED_TOOL_SLUGS.
 *
 * Produces multi-row INSERTs with ON CONFLICT DO UPDATE so the file is safely
 * re-runnable. Featured order is wiped and re-applied at the end to match
 * FEATURED_TOOL_SLUGS exactly.
 */

import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
} from './static-catalog'

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? '1' : '0'
  if (typeof v === 'string') return sqlString(v)
  // arrays / objects → JSON-encoded TEXT (Drizzle's mode:'json' reads back via JSON.parse)
  return sqlString(JSON.stringify(v))
}

function upsert(
  table: string,
  columns: string[],
  rows: Record<string, unknown>[],
): string {
  const cols = columns.join(', ')
  const updates = columns
    .filter((c) => c !== 'id' && c !== 'created_at')
    .map((c) => `${c} = excluded.${c}`)
    .join(', ')
  // One statement per line — D1 splits the multi-statement string on newlines
  // and treats each line as its own SQL statement. Embedded line breaks here
  // would cause D1 to try parsing fragments. SQLite locally does not care.
  const valuesSql = rows
    .map((row) => `(${columns.map((c) => sqlValue(row[c])).join(', ')})`)
    .join(', ')
  return `INSERT INTO ${table} (${cols}) VALUES ${valuesSql} ON CONFLICT(id) DO UPDATE SET ${updates};`
}

export interface SeedSqlOptions {
  /** Unix-ms timestamp to stamp on createdAt/updatedAt. Defaults to Date.now() at call time. */
  now?: number
}

export function buildSeedSql({ now = Date.now() }: SeedSqlOptions = {}): string {
  const catColumns = [
    'id', 'slug', 'name', 'description', 'icon', 'image_url',
    'intro', 'buying_criteria', 'related_slugs',
    'seo_title', 'seo_description', 'hero_angle',
    'sort_order', 'archived_at', 'created_at', 'updated_at',
  ]

  const catRows = STATIC_CATEGORIES.map((c, i) => ({
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
  }))

  const toolColumns = [
    'id', 'slug', 'name', 'description', 'short_desc', 'use_cases',
    'website_url', 'logo_url', 'pricing_model',
    'is_featured', 'featured_order',
    'category_id', 'extra_category_slugs',
    'archived_at', 'created_at', 'updated_at',
  ]

  const toolRows = STATIC_TOOLS.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    short_desc: t.shortDesc ?? null,
    use_cases: t.useCases ?? null,
    website_url: t.websiteUrl,
    logo_url: t.logoUrl ?? null,
    pricing_model: t.pricingModel,
    is_featured: t.isFeatured ? 1 : 0,
    featured_order: null,
    category_id: t.categoryId,
    extra_category_slugs: t.extraCategorySlugs ?? null,
    archived_at: null,
    created_at: now,
    updated_at: now,
  }))

  const featuredOrderSql = [
    'UPDATE tools SET is_featured = 0, featured_order = NULL;',
    ...FEATURED_TOOL_SLUGS.map(
      (slug, i) =>
        `UPDATE tools SET is_featured = 1, featured_order = ${i}, updated_at = ${now} WHERE slug = ${sqlString(slug)};`,
    ),
  ].join('\n')

  return [
    '-- Categories',
    upsert('categories', catColumns, catRows),
    '',
    '-- Tools',
    upsert('tools', toolColumns, toolRows),
    '',
    '-- Canonical featured order',
    featuredOrderSql,
  ].join('\n')
}
