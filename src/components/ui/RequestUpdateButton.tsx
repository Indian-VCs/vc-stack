'use client'

import { useState, useTransition } from 'react'
import { requestUpdate } from '@/server/actions/update-feedback'

/**
 * One-click "Request update" button on tool detail pages.
 *
 * Flow: click → server action inserts a kind='request' row in update_feedback
 * (server-side dedupes per IP+tool within 24h). On success, the button
 * collapses into a thank-you stamp for the rest of the session. The dedupe
 * means even if a user reloads and clicks again, the count stays honest.
 */
export default function RequestUpdateButton({ toolSlug }: { toolSlug: string }) {
  const [pending, start] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function click() {
    setError('')
    start(async () => {
      const r = await requestUpdate(toolSlug)
      if (r.ok) {
        setDone(true)
        return
      }
      setError(r.message ?? 'Could not flag right now.')
    })
  }

  if (done) {
    return (
      <span
        role="status"
        aria-live="polite"
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--success, var(--ink-muted))',
        }}
      >
        ✓ Flagged · thanks
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <button
        type="button"
        onClick={click}
        disabled={pending}
        style={{
          background: 'transparent',
          border: '1px solid var(--rule)',
          padding: '6px 10px',
          cursor: pending ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--ink-muted)',
          opacity: pending ? 0.6 : 1,
          transition: 'border-color 160ms ease, color 160ms ease',
        }}
        onMouseEnter={(e) => {
          if (!pending) {
            e.currentTarget.style.borderColor = 'var(--ink)'
            e.currentTarget.style.color = 'var(--ink)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--rule)'
          e.currentTarget.style.color = 'var(--ink-muted)'
        }}
      >
        {pending ? 'Flagging…' : 'Request update'}
      </button>
      {error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            color: 'var(--red)',
          }}
        >
          {error}
        </span>
      )}
    </span>
  )
}
