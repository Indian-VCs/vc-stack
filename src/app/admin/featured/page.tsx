/**
 * Featured tools — consolidated reorder view.
 *
 * Loads every tool with `isFeatured = true AND archivedAt IS NULL`, ordered
 * `featuredOrder ASC NULLS LAST, name ASC`, and hands them to a client
 * component that lets the editor reshuffle the list and save the new order
 * in one batch.
 */

import type { Metadata } from 'next'
import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { ToolRow } from '@/lib/db/schema'
import FeaturedReorder from './FeaturedReorder'

export const metadata: Metadata = { title: 'Featured order' }
export const dynamic = 'force-dynamic'

export default async function AdminFeaturedPage() {
  await requireAdmin()

  const db = await getDb()
  let featured: ToolRow[] = []
  let dbErr = ''
  try {
    featured = await db
      .select()
      .from(schema.tools)
      .where(and(eq(schema.tools.isFeatured, true), isNull(schema.tools.archivedAt)))
      .orderBy(
        sql`CASE WHEN ${schema.tools.featuredOrder} IS NULL THEN 1 ELSE 0 END`,
        asc(schema.tools.featuredOrder),
        asc(schema.tools.name),
      )
  } catch (err) {
    dbErr = err instanceof Error ? err.message : String(err)
  }

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
              Catalog · {featured.length} featured
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
              Featured order
            </h1>
            <p
              style={{
                marginTop: 8,
                fontFamily: 'var(--body)',
                fontSize: '0.95rem',
                color: 'var(--ink-muted)',
                maxWidth: 640,
              }}
            >
              The order set here drives the homepage hero rotation and the
              inline &ldquo;Featured Tools&rdquo; row on every product page.
              Lower position = appears first.
            </p>
          </div>
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

      <FeaturedReorder tools={featured} />
    </div>
  )
}
