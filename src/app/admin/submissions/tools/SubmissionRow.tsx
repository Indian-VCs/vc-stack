'use client'

import { useState, useTransition } from 'react'
import type { ToolSubmissionRow } from '@/lib/db/schema'
import { approveSubmission, rejectSubmission, archiveSubmission } from './actions'

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--red)',
  approved: 'var(--success, #2a7a2a)',
  rejected: 'var(--ink-muted)',
  archived: 'var(--ink-muted)',
}

export default function SubmissionRow({ row }: { row: ToolSubmissionRow }) {
  const [isPending, start] = useTransition()
  const [error, setError] = useState('')
  const [status, setStatus] = useState(row.status)

  function run(fn: () => Promise<{ ok: boolean; message?: string; status?: typeof row.status }>) {
    setError('')
    start(async () => {
      const res = await fn()
      if (!res.ok) {
        setError(res.message ?? 'Action failed.')
        return
      }
      if (res.status) setStatus(res.status)
    })
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        background: status === 'pending' ? 'var(--paper)' : 'var(--paper-alt)',
        padding: 18,
        opacity: status === 'pending' ? 1 : 0.75,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: 'var(--ink)',
            }}
          >
            {row.toolName}
          </div>
          <a
            href={row.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--red)',
              textDecoration: 'none',
            }}
          >
            {row.websiteUrl.replace(/^https?:\/\//, '')}
          </a>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: STATUS_COLORS[status] ?? 'var(--ink-muted)',
              fontWeight: 600,
            }}
          >
            {status}
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--ink-muted)',
            }}
          >
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          lineHeight: 1.5,
          marginBottom: 12,
        }}
      >
        {row.description}
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          color: 'var(--ink-light)',
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span>
          From{' '}
          <span style={{ color: 'var(--ink)' }}>
            {row.submitterName ?? row.submitterEmail}
          </span>
        </span>
        {row.submitterFirm && <span>· {row.submitterFirm}</span>}
        {row.relationship && <span>· {row.relationship.replace('_', ' ')}</span>}
        <span>· section {row.categoryId}</span>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            color: 'var(--red)',
            fontFamily: 'var(--body)',
            fontSize: '0.9rem',
            marginBottom: 8,
          }}
        >
          {error}
        </div>
      )}

      {status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => approveSubmission(row.id))}
            style={btnPrimary(isPending)}
          >
            Approve
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => rejectSubmission(row.id))}
            style={btnGhost(isPending)}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => archiveSubmission(row.id))}
            style={btnGhost(isPending)}
          >
            Archive
          </button>
        </div>
      )}
    </div>
  )
}

function btnPrimary(disabled: boolean): React.CSSProperties {
  return {
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    padding: '8px 14px',
    fontFamily: 'var(--mono)',
    fontSize: 'var(--fs-tag)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}

function btnGhost(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent',
    color: 'var(--ink)',
    border: '1px solid var(--rule)',
    padding: '8px 14px',
    fontFamily: 'var(--mono)',
    fontSize: 'var(--fs-tag)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}
