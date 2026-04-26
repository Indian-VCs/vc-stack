'use client'

import { useState, useTransition } from 'react'
import { requestUpdate } from '@/server/actions/update-feedback'

/**
 * One-click "Request update" link on tool detail pages.
 *
 * Styled as inline mono-caps text (not a boxed button) to match the sibling
 * "Suggest an update ↗" link. On click → server action inserts a kind='request'
 * row in update_feedback (server-side dedupes per IP+tool within 24h). On
 * success the link collapses into a thank-you stamp for the rest of the
 * session; the dedupe means even repeat clicks across reloads stay honest.
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
        className="request-update-link"
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
      <style>{`
        .request-update-link {
          background: transparent;
          border: none;
          padding: 0;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--ink-muted);
          border-bottom: 1px solid var(--rule);
          cursor: pointer;
          transition: color 160ms ease, border-color 160ms ease;
        }
        .request-update-link:hover:not(:disabled) {
          color: var(--red);
          border-bottom-color: var(--red);
        }
        .request-update-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </span>
  )
}
