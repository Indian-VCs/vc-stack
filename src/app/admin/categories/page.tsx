/**
 * Categories listing — search + status filter. ~17 rows, no pagination needed.
 *
 * Reads directly from D1 (no fallback). Tool counts computed per-row via
 * db.$count for live numbers (cheap given the small row count).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { asc, eq, isNull, isNotNull, like, or, and, sql } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { CategoryRow } from '@/lib/db/schema'
import CategoryListItem from './CategoryListItem'

export const metadata: Metadata = { title: 'Categories' }
export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: 'active' | 'archived' | 'all' }>
}) {
  await requireAdmin()
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const status = params.status ?? 'active'

  const db = await getDb()
  const conds = []
  if (q) {
    const needle = `%${q.toLowerCase()}%`
    conds.push(
      or(
        like(sql`lower(${schema.categories.name})`, needle),
        like(sql`lower(${schema.categories.slug})`, needle),
        like(sql`lower(${schema.categories.description})`, needle),
      )!,
    )
  }
  if (status === 'active') conds.push(isNull(schema.categories.archivedAt))
  if (status === 'archived') conds.push(isNotNull(schema.categories.archivedAt))

  let rows: CategoryRow[] = []
  let total = 0
  let dbErr = ''
  try {
    const where = conds.length ? and(...conds) : undefined
    ;[rows, total] = await Promise.all([
      db
        .select()
        .from(schema.categories)
        .where(where)
        .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name)),
      db.$count(schema.categories, where),
    ])
  } catch (err) {
    dbErr = err instanceof Error ? err.message : String(err)
  }

  // Live tool counts for each visible category.
  const counts = await Promise.all(
    rows.map((cat) =>
      db
        .$count(schema.tools, eq(schema.tools.categoryId, cat.id))
        .then((n) => n)
        .catch((): number => 0),
    ),
  )
  const countMap = new Map(rows.map((cat, i) => [cat.id, counts[i] ?? 0]))

  return (
    <div style={{ padding: '32px 40px 64px' }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.24em',
                color: 'var(--red)',
                marginBottom: 8,
              }}
            >
              Sections · {total} {status === 'all' ? 'rows' : status}
            </div>
            <h1
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: 'var(--fs-name)',
                color: 'var(--ink)',
                lineHeight: 1.1,
              }}
            >
              Categories
            </h1>
          </div>

          <Link
            href="/admin/categories/new"
            style={{
              padding: '10px 16px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              textDecoration: 'none',
            }}
          >
            + New category
          </Link>
        </div>
      </header>

      {dbErr && (
        <div
          role="alert"
          style={{
            border: '1px solid var(--red)',
            background: 'rgba(210, 25, 5, 0.06)',
            padding: 16,
            marginBottom: 24,
            fontFamily: 'var(--body)',
            fontSize: '0.9rem',
          }}
        >
          <strong>DB error:</strong>{' '}
          <code style={{ fontFamily: 'var(--mono)' }}>{dbErr}</code>
        </div>
      )}

      <form
        method="get"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, slug, description…"
          style={{
            flex: '1 1 240px',
            padding: '8px 12px',
            border: '1px solid var(--rule)',
            background: 'var(--paper)',
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
          }}
        />
        <select
          name="status"
          defaultValue={status}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--rule)',
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
          }}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="all">All</option>
        </select>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            border: 'none',
            background: 'var(--ink)',
            color: 'var(--paper)',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            cursor: 'pointer',
          }}
        >
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <div
          style={{
            padding: 48,
            border: '1px solid var(--rule)',
            background: 'var(--paper-alt)',
            textAlign: 'center',
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            color: 'var(--ink-light)',
          }}
        >
          No categories match.{' '}
          {status === 'active' && total === 0 && (
            <>
              Run <code style={{ fontFamily: 'var(--mono)' }}>npx tsx scripts/seed.ts</code> if
              you haven&rsquo;t seeded yet.
            </>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid var(--rule)' }}>
          {rows.map((row) => (
            <CategoryListItem
              key={row.id}
              row={row}
              toolCount={countMap.get(row.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
