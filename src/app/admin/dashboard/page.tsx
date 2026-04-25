/**
 * Admin dashboard — at-a-glance counts and recent admin activity.
 * All queries hit D1 (or local SQLite in dev).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { eq, isNull } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import { recentAudit } from '@/lib/audit'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

async function getCounts() {
  const db = await getDb()
  const [tools, categories, pendingTools, pendingStacks] = await Promise.all([
    db.$count(schema.tools, isNull(schema.tools.archivedAt)),
    db.$count(schema.categories, isNull(schema.categories.archivedAt)),
    db.$count(schema.toolSubmissions, eq(schema.toolSubmissions.status, 'pending')),
    db.$count(schema.stackSubmissions, eq(schema.stackSubmissions.status, 'pending')),
  ])
  return { tools, categories, pendingTools, pendingStacks }
}

export default async function DashboardPage() {
  const { email } = await requireAdmin()

  // Defensive: if D1 isn't bound yet, render zero counts and a setup hint
  // rather than crashing.
  let counts = { tools: 0, categories: 0, pendingTools: 0, pendingStacks: 0 }
  let dbOk = true
  let dbError = ''
  try {
    counts = await getCounts()
  } catch (err) {
    dbOk = false
    dbError = err instanceof Error ? err.message : String(err)
  }

  let auditEntries: Awaited<ReturnType<typeof recentAudit>> = []
  if (dbOk) {
    try {
      auditEntries = await recentAudit(10)
    } catch {
      // ignored
    }
  }

  const cards = [
    { label: 'Active tools', value: counts.tools, href: '/admin' },
    { label: 'Active sections', value: counts.categories, href: '/admin' },
    { label: 'Pending tool submissions', value: counts.pendingTools, href: '/admin/submissions/tools' },
    { label: 'Pending stack submissions', value: counts.pendingStacks, href: '/admin/submissions/stack' },
  ]

  return (
    <div style={{ padding: '32px 40px 64px' }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 32,
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
          Newsroom · {email}
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
          Editor’s Desk
        </h1>
      </header>

      {!dbOk && (
        <div
          role="alert"
          style={{
            border: '1px solid var(--red)',
            background: 'rgba(210, 25, 5, 0.06)',
            padding: 16,
            marginBottom: 24,
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
            color: 'var(--ink)',
          }}
        >
          <strong>Database not reachable.</strong> See <code>SETUP.md</code>. Error:{' '}
          <code style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{dbError}</code>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--ink)',
          marginBottom: 48,
        }}
      >
        {cards.map((card, i) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              padding: '24px 20px',
              borderRight: i < cards.length - 1 ? '1px solid var(--rule)' : 'none',
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--ink-muted)',
                marginBottom: 10,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: '2.4rem',
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-header" style={{ marginBottom: 12 }}>
        Recent activity
      </div>

      {auditEntries.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--body)',
            color: 'var(--ink-light)',
            fontStyle: 'italic',
          }}
        >
          No admin activity logged yet.
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            border: '1px solid var(--rule)',
          }}
        >
          {auditEntries.map((entry) => (
            <li
              key={entry.id}
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--rule)',
                display: 'grid',
                gridTemplateColumns: '180px 100px 110px 1fr',
                gap: 16,
                fontFamily: 'var(--body)',
                fontSize: '0.9rem',
              }}
            >
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>
                {new Date(entry.createdAt).toLocaleString()}
              </span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink)' }}>{entry.action}</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-light)' }}>
                {entry.entity}
              </span>
              <span style={{ color: 'var(--ink)' }}>
                {entry.entityId ?? '—'} <span style={{ color: 'var(--ink-muted)' }}>by {entry.adminEmail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

