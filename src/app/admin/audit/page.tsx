/**
 * Audit log viewer — read-only.
 * Shows the last 200 admin actions, newest first.
 */

import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { recentAudit } from '@/lib/audit'

export const metadata: Metadata = { title: 'Audit log' }
export const dynamic = 'force-dynamic'

export default async function AuditLogPage() {
  await requireAdmin()

  let entries: Awaited<ReturnType<typeof recentAudit>> = []
  let dbErr = ''
  try {
    entries = await recentAudit(200)
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
          {entries.length} entries
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
          Audit log
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
          }}
        >
          <strong>Database error:</strong>{' '}
          <code style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{dbErr}</code>
        </div>
      )}

      {entries.length === 0 ? (
        <p style={{ fontFamily: 'var(--body)', color: 'var(--ink-light)', fontStyle: 'italic' }}>
          Nothing logged yet.
        </p>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--rule)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--body)' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid var(--ink)',
                  background: 'var(--paper-alt)',
                  textAlign: 'left',
                }}
              >
                {['When', 'Admin', 'Action', 'Entity', 'ID', 'Diff'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 12px',
                      fontFamily: 'var(--mono)',
                      fontSize: 'var(--fs-tag)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--ink-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.id}
                  style={{ borderBottom: '1px solid var(--rule)', verticalAlign: 'top' }}
                >
                  <td
                    style={{
                      padding: '8px 12px',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.85rem',
                      color: 'var(--ink-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                    {e.adminEmail}
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                    {e.action}
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                    {e.entity}
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.85rem',
                      color: 'var(--ink-light)',
                    }}
                  >
                    {e.entityId ?? '—'}
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.8rem',
                      color: 'var(--ink-light)',
                      maxWidth: 360,
                      wordBreak: 'break-all',
                    }}
                  >
                    {e.diff ? JSON.stringify(e.diff) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
