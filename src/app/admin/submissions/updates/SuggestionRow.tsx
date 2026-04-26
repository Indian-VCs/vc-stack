'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import type { UpdateFeedbackRow } from '@/lib/db/schema'
import { archiveFeedback, markApplied, rejectFeedback } from './actions'

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--red)',
  applied: 'var(--success, #2a7a2a)',
  rejected: 'var(--ink-muted)',
  archived: 'var(--ink-muted)',
}

const FIELD_LABELS: Record<string, string> = {
  description: 'Description',
  pricing: 'Pricing',
  logo: 'Logo',
  use_cases: 'Use cases',
  key_features: 'Key features',
  broken_link: 'Broken link',
  other: 'Other',
}

const ROLE_LABELS: Record<string, string> = {
  gp: 'GP / Partner',
  analyst: 'Analyst',
  operator: 'Platform / Ops',
  founder: 'Founder',
  other: 'Other',
}

interface Props {
  row: UpdateFeedbackRow
  toolName?: string
  toolId?: string
}

export default function SuggestionRow({ row, toolName, toolId }: Props) {
  const [pending, start] = useTransition()
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
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: 'var(--ink)',
            }}
          >
            {toolName ?? row.toolSlug}{' '}
            {row.fieldArea && (
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--fs-tag)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--red)',
                  marginLeft: 6,
                }}
              >
                · {FIELD_LABELS[row.fieldArea] ?? row.fieldArea}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--ink-muted)',
              marginTop: 4,
            }}
          >
            slug: <span style={{ color: 'var(--ink)' }}>{row.toolSlug}</span>
          </div>
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

      {row.suggestion && (
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
            color: 'var(--ink)',
            lineHeight: 1.5,
            marginBottom: 12,
            whiteSpace: 'pre-line',
          }}
        >
          {row.suggestion}
        </p>
      )}

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
        {row.submitterEmail && (
          <span>
            From <span style={{ color: 'var(--ink)' }}>{row.submitterEmail}</span>
          </span>
        )}
        {row.submitterRole && (
          <span>· {ROLE_LABELS[row.submitterRole] ?? row.submitterRole}</span>
        )}
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {toolId && (
            <Link href={`/admin/tools/${toolId}/edit`} style={btnGhost(false)}>
              Open tool ↗
            </Link>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => markApplied(row.id))}
            style={btnPrimary(pending)}
          >
            Mark applied
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => rejectFeedback(row.id))}
            style={btnGhost(pending)}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => archiveFeedback(row.id))}
            style={btnGhost(pending)}
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
    textDecoration: 'none',
    display: 'inline-block',
  }
}
