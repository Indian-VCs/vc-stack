/**
 * Stack submissions queue.
 *
 * "A VC firm tells us their tool stack" submissions. Curated into editorial
 * pieces (firm profile pages) — not auto-published. Editor moderates, tags
 * a published_slug when it goes live, archives noise.
 */

import type { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import StackRow from './StackRow'

export const metadata: Metadata = { title: 'Stack submissions' }
export const dynamic = 'force-dynamic'

export default async function StackSubmissionsPage() {
  await requireAdmin()

  const db = await getDb()
  let rows: schema.StackSubmissionRow[] = []
  let dbErr = ''
  try {
    rows = await db
      .select()
      .from(schema.stackSubmissions)
      .orderBy(desc(schema.stackSubmissions.createdAt))
      .limit(200)
  } catch (err) {
    dbErr = err instanceof Error ? err.message : String(err)
  }

  const pending = rows.filter((r) => r.status === 'pending').length

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
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 8,
          }}
        >
          Editorial · {pending} pending
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
          Firm stack submissions
        </h1>
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
            color: 'var(--ink)',
          }}
        >
          <strong>Database error:</strong>{' '}
          <code style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{dbErr}</code>
        </div>
      )}

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
          No firm submissions yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row) => (
            <StackRow key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  )
}
