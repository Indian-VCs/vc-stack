/**
 * Tools listing — search, filter by status, paginated.
 *
 * Reads directly from D1 (no fallback). Admin must seed before this page is
 * meaningful — otherwise it lists zero tools.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { asc, desc, isNull, isNotNull, like, or, and, sql } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { ToolRow } from '@/lib/db/schema'
import ToolListItem from './ToolListItem'

export const metadata: Metadata = { title: 'Tools' }
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

export default async function AdminToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: 'active' | 'archived' | 'all'; page?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const status = params.status ?? 'active'
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)

  const db = await getDb()
  const conds = []
  if (q) {
    const needle = `%${q.toLowerCase()}%`
    conds.push(
      or(
        like(sql`lower(${schema.tools.name})`, needle),
        like(sql`lower(${schema.tools.slug})`, needle),
        like(sql`lower(${schema.tools.description})`, needle),
      )!,
    )
  }
  if (status === 'active') conds.push(isNull(schema.tools.archivedAt))
  if (status === 'archived') conds.push(isNotNull(schema.tools.archivedAt))

  let rows: ToolRow[] = []
  let total = 0
  let dbErr = ''
  try {
    const where = conds.length ? and(...conds) : undefined
    ;[rows, total] = await Promise.all([
      db
        .select()
        .from(schema.tools)
        .where(where)
        .orderBy(desc(schema.tools.isFeatured), asc(schema.tools.featuredOrder), asc(schema.tools.name))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db.$count(schema.tools, where),
    ])
  } catch (err) {
    dbErr = err instanceof Error ? err.message : String(err)
  }

  // Pre-load category names for display.
  const categories = await db.select().from(schema.categories).catch(() => [])
  const catMap = new Map(categories.map((c) => [c.id, c]))

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

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
              Catalog · {total} {status === 'all' ? 'rows' : status}
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
              Tools
            </h1>
          </div>

          <Link
            href="/admin/tools/new"
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
            + New tool
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
          No tools match.{' '}
          {status === 'active' && total === 0 && (
            <>
              Run <code style={{ fontFamily: 'var(--mono)' }}>npx tsx scripts/seed.ts</code> if
              you haven&rsquo;t seeded yet.
            </>
          )}
        </div>
      ) : (
        <>
          <div style={{ border: '1px solid var(--rule)' }}>
            {rows.map((row) => (
              <ToolListItem
                key={row.id}
                row={row}
                categoryName={catMap.get(row.categoryId)?.name ?? '?'}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination total={total} page={page} totalPages={totalPages} q={q} status={status} />
          )}
        </>
      )}
    </div>
  )
}

function Pagination({
  total,
  page,
  totalPages,
  q,
  status,
}: {
  total: number
  page: number
  totalPages: number
  q: string
  status: string
}) {
  function url(p: number) {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (status !== 'active') sp.set('status', status)
    if (p > 1) sp.set('page', String(p))
    return `/admin/tools${sp.toString() ? '?' + sp.toString() : ''}`
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        fontFamily: 'var(--mono)',
        fontSize: 'var(--fs-tag)',
        color: 'var(--ink-muted)',
      }}
    >
      <span>
        Page {page} / {totalPages} · {total} total
      </span>
      <span style={{ display: 'flex', gap: 12 }}>
        {page > 1 && (
          <Link href={url(page - 1)} style={{ color: 'var(--red)' }}>
            ← Prev
          </Link>
        )}
        {page < totalPages && (
          <Link href={url(page + 1)} style={{ color: 'var(--red)' }}>
            Next →
          </Link>
        )}
      </span>
    </div>
  )
}
