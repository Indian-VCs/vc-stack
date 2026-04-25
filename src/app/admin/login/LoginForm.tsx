'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SAFE_NEXT = /^\/admin(\/.*)?$/

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const dest = next && SAFE_NEXT.test(next) ? next : '/admin/dashboard'
        router.push(dest)
        router.refresh()
        return
      }

      if (res.status === 429) {
        setError('Too many attempts. Try again in a few minutes.')
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setError(body.error || 'Sign in failed.')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: '1px solid var(--rule)',
        background: 'var(--paper)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--ink-muted)',
            marginBottom: 6,
          }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--rule)',
            background: 'var(--paper)',
            fontFamily: 'var(--body)',
            fontSize: '1rem',
            color: 'var(--ink)',
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--ink-muted)',
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--rule)',
            background: 'var(--paper)',
            fontFamily: 'var(--body)',
            fontSize: '1rem',
            color: 'var(--ink)',
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: '10px 12px',
            border: '1px solid var(--red)',
            background: 'rgba(210, 25, 5, 0.06)',
            color: 'var(--red)',
            fontFamily: 'var(--body)',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email || !password}
        style={{
          padding: '12px 16px',
          border: 'none',
          background: 'var(--ink)',
          color: 'var(--paper)',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
          opacity: loading || !email || !password ? 0.5 : 1,
        }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
