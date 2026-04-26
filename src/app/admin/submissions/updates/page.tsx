/**
 * Update-feedback queue.
 *
 * One page, two views (selected by ?tab=requests|suggestions):
 *   - "Requests" — kind='request' rows aggregated per toolSlug. Each row
 *     shows the volume + recency, plus a "Clear" bulk action.
 *   - "Suggestions" — kind='suggestion' rows individually, with the full
 *     suggestion text + submitter context + per-row mark/reject/archive.
 *
 * Pending counts on each tab give the editor an at-a-glance picture before
 * they click in.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { and, desc, eq, sql } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import RequestRow from './RequestRow'
import SuggestionRow from './SuggestionRow'

export const metadata: Metadata = { title: 'Update feedback' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function UpdateFeedbackPage({ searchParams }: Props) {
  await requireAdmin()
  const { tab } = await searchParams
  const activeTab: 'requests' | 'suggestions' =
    tab === 'suggestions' ? 'suggestions' : 'requests'

  const db = await getDb()
  let dbErr = ''

  let requestCount = 0
  let suggestionCount = 0
  let requestGroups: Array<{ toolSlug: string; count: number; lastAt: number }> = []
  let suggestionRows: schema.UpdateFeedbackRow[] = []
  const slugToTool = new Map<string, { id: string; name: string }>()

  try {
    const [reqCountRow] = await db
      .select({ n: sql<number>`count(*)` })
      .from(schema.updateFeedback)
      .where(
        and(
          eq(schema.updateFeedback.kind, 'request'),
          eq(schema.updateFeedback.status, 'pending'),
        ),
      )
    const [sugCountRow] = await db
      .select({ n: sql<number>`count(*)` })
      .from(schema.updateFeedback)
      .where(
        and(
          eq(schema.updateFeedback.kind, 'suggestion'),
          eq(schema.updateFeedback.status, 'pending'),
        ),
      )
    requestCount = Number(reqCountRow?.n ?? 0)
    suggestionCount = Number(sugCountRow?.n ?? 0)

    if (activeTab === 'requests') {
      const rows = await db
        .select({
          toolSlug: schema.updateFeedback.toolSlug,
          count: sql<number>`count(*)`,
          lastAt: sql<number>`max(${schema.updateFeedback.createdAt})`,
        })
        .from(schema.updateFeedback)
        .where(
          and(
            eq(schema.updateFeedback.kind, 'request'),
            eq(schema.updateFeedback.status, 'pending'),
          ),
        )
        .groupBy(schema.updateFeedback.toolSlug)
        .orderBy(sql`max(${schema.updateFeedback.createdAt}) desc`)
        .limit(200)
      requestGroups = rows.map((r) => ({
        toolSlug: r.toolSlug,
        count: Number(r.count),
        lastAt: Number(r.lastAt),
      }))
    } else {
      suggestionRows = await db
        .select()
        .from(schema.updateFeedback)
        .where(eq(schema.updateFeedback.kind, 'suggestion'))
        .orderBy(desc(schema.updateFeedback.createdAt))
        .limit(200)
    }

    // Resolve toolSlug -> { id, name } so admin rows can link directly into
    // the tool edit page. Only fetches the slugs we actually need.
    const slugs = Array.from(
      new Set(
        activeTab === 'requests'
          ? requestGroups.map((g) => g.toolSlug)
          : suggestionRows.map((r) => r.toolSlug),
      ),
    )
    if (slugs.length > 0) {
      const toolRows = await db
        .select({
          id: schema.tools.id,
          slug: schema.tools.slug,
          name: schema.tools.name,
        })
        .from(schema.tools)
      for (const t of toolRows) {
        if (slugs.includes(t.slug)) slugToTool.set(t.slug, { id: t.id, name: t.name })
      }
    }
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
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 8,
          }}
        >
          Inbox · {requestCount + suggestionCount} pending
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
          Update feedback
        </h1>
      </header>

      <nav
        aria-label="Update feedback tabs"
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <TabLink active={activeTab === 'requests'} href="/admin/submissions/updates?tab=requests">
          Requests <Badge>{requestCount}</Badge>
        </TabLink>
        <TabLink active={activeTab === 'suggestions'} href="/admin/submissions/updates?tab=suggestions">
          Suggestions <Badge>{suggestionCount}</Badge>
        </TabLink>
      </nav>

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

      {activeTab === 'requests' ? (
        requestGroups.length === 0 ? (
          <Empty>No pending update requests.</Empty>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requestGroups.map((g) => {
              const t = slugToTool.get(g.toolSlug)
              return (
                <RequestRow
                  key={g.toolSlug}
                  toolSlug={g.toolSlug}
                  count={g.count}
                  lastAt={g.lastAt}
                  toolName={t?.name}
                  toolId={t?.id}
                />
              )
            })}
          </div>
        )
      ) : suggestionRows.length === 0 ? (
        <Empty>No pending suggestions.</Empty>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestionRows.map((r) => {
            const t = slugToTool.get(r.toolSlug)
            return <SuggestionRow key={r.id} row={r} toolName={t?.name} toolId={t?.id} />
          })}
        </div>
      )}
    </div>
  )
}

function TabLink({
  active,
  href,
  children,
}: {
  active: boolean
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      style={{
        padding: '10px 14px',
        fontFamily: 'var(--mono)',
        fontSize: 'var(--fs-tag)',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: active ? 'var(--ink)' : 'var(--ink-muted)',
        textDecoration: 'none',
        borderBottom: active ? '2px solid var(--red)' : '2px solid transparent',
        marginBottom: -1,
      }}
    >
      {children}
    </Link>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 'var(--fs-tag)',
        marginLeft: 6,
        color: 'var(--ink-muted)',
      }}
    >
      ({children})
    </span>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  )
}
