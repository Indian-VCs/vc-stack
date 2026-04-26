'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { markAllRequestsApplied } from './actions'

interface Props {
  toolSlug: string
  count: number
  lastAt: number
  toolName?: string
  /** D1 tool id, present when the slug resolves to a real tool — used for the deep-link to /admin/tools/<id>/edit. */
  toolId?: string
}

export default function RequestRow({ toolSlug, count, lastAt, toolName, toolId }: Props) {
  const [pending, start] = useTransition()
  const [cleared, setCleared] = useState(false)
  const [error, setError] = useState('')

  function clearAll() {
    setError('')
    start(async () => {
      const r = await markAllRequestsApplied(toolSlug)
      if (r.ok) {
        setCleared(true)
        return
      }
      setError(r.message ?? 'Could not clear.')
    })
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        background: cleared ? 'var(--paper-alt)' : 'var(--paper)',
        padding: 18,
        opacity: cleared ? 0.6 : 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: 'var(--ink)',
          }}
        >
          {toolName ?? toolSlug}
        </div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            color: 'var(--ink-muted)',
            marginTop: 4,
          }}
        >
          {count} request{count === 1 ? '' : 's'} · last {timeAgo(lastAt)} · slug:{' '}
          <span style={{ color: 'var(--ink)' }}>{toolSlug}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {error && (
          <span role="alert" style={{ color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: 'var(--fs-tag)' }}>
            {error}
          </span>
        )}
        {toolId && (
          <Link href={`/admin/tools/${toolId}/edit`} style={btnGhost(false)}>
            Open tool ↗
          </Link>
        )}
        {!cleared && (
          <button type="button" onClick={clearAll} disabled={pending} style={btnPrimary(pending)}>
            {pending ? 'Clearing…' : `Clear ${count}`}
          </button>
        )}
        {cleared && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--success, var(--ink-muted))',
            }}
          >
            ✓ Cleared
          </span>
        )}
      </div>
    </div>
  )
}

function timeAgo(epoch: number): string {
  const diff = Date.now() - epoch
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
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
