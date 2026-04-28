'use client'

/**
 * Native-styled signup form that hands off to Substack's /subscribe page.
 * We control the entire visual (fonts, colors, sizing, disclaimer copy).
 * On submit, we open `${substackUrl}/subscribe?email=...` in a new tab —
 * Substack handles the actual subscription + confirmation email.
 */

import { useState } from 'react'
import { SUBSTACK_URL } from '@/lib/substack'

export default function SubstackEmbed({
  maxWidth,
  wide = false,
}: {
  maxWidth?: number | string
  wide?: boolean
}) {
  const baseUrl = SUBSTACK_URL.trim().replace(/\/+$/, '')
  const resolvedMaxWidth = maxWidth ?? (wide ? '100%' : 520)

  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  if (!baseUrl) {
    return (
      <div
        style={{
          maxWidth: resolvedMaxWidth,
          padding: '14px 16px',
          border: '1px solid var(--rule)',
          background: 'var(--paper-alt)',
          fontFamily: 'var(--body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          lineHeight: 1.5,
        }}
        role="status"
      >
        <strong>Launching soon.</strong> Weekly newsletter starting in the next few weeks.
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setErr('Please enter your email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr('That email doesn’t look right.')
      return
    }
    setErr('')
    const target = `${baseUrl}/subscribe?email=${encodeURIComponent(trimmed)}`
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ maxWidth: resolvedMaxWidth, width: '100%' }}>
      <form onSubmit={handleSubmit} className="ssb-form" noValidate aria-label="Newsletter signup">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (err) setErr('')
          }}
          placeholder="name@fund.com"
          required
          aria-label="Email address"
          aria-invalid={Boolean(err)}
          aria-describedby={err ? 'ssb-err' : undefined}
          className="ssb-input"
        />
        <button type="submit" className="ssb-btn">
          Subscribe
        </button>
      </form>

      {err && (
        <div id="ssb-err" role="alert" className="ssb-err">
          {err}
        </div>
      )}

      <p className="ssb-trust">
        Weekly newsletter. No spam. Unsubscribe anytime.
      </p>

      <style jsx>{`
        .ssb-form {
          display: flex;
          gap: 0;
          width: 100%;
        }
        .ssb-input {
          flex: 1;
          min-width: 0;
          padding: 11px 14px;
          border: 1px solid var(--ink);
          border-right: 0;
          background: var(--paper);
          font-family: var(--body);
          font-size: 1rem;
          color: var(--ink);
          line-height: 1.4;
          outline: none;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .ssb-input::placeholder {
          color: var(--ink-muted);
        }
        .ssb-input:focus {
          background: var(--paper-alt);
        }
        .ssb-btn {
          font-family: var(--mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--paper);
          background: var(--ink);
          border: 1px solid var(--ink);
          padding: 11px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 180ms ease, border-color 180ms ease;
          white-space: nowrap;
        }
        .ssb-btn:hover {
          background: var(--red);
          border-color: var(--red);
        }
        .ssb-err {
          font-family: var(--body);
          font-size: 0.85rem;
          color: var(--red);
          margin-top: 6px;
        }
        .ssb-trust {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin: 10px 0 0;
        }
        @media (max-width: 480px) {
          .ssb-form { flex-direction: column; gap: 10px; }
          .ssb-input { border-right: 1px solid var(--ink); }
          .ssb-btn { width: 100%; padding: 13px 18px; }
        }
      `}</style>
    </div>
  )
}
