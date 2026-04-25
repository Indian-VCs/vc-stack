'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { seedFromStaticCatalog, type SeedResult } from './actions'

export default function SeedButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<SeedResult | null>(null)

  function onClick() {
    setResult(null)
    startTransition(async () => {
      try {
        const r = await seedFromStaticCatalog()
        setResult(r)
        if (r.ok) router.refresh()
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setResult({ ok: false, message: `Action threw: ${message.slice(0, 400)}` })
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        style={{
          padding: '12px 20px',
          border: 'none',
          background: 'var(--ink)',
          color: 'var(--paper)',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          cursor: pending ? 'not-allowed' : 'pointer',
          opacity: pending ? 0.5 : 1,
          alignSelf: 'flex-start',
        }}
      >
        {pending ? 'Seeding…' : 'Seed catalog from static-catalog.ts'}
      </button>

      {result && result.ok && (
        <div
          role="status"
          style={{
            padding: '10px 14px',
            border: '1px solid var(--ink)',
            background: 'var(--paper-alt)',
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
            color: 'var(--ink)',
          }}
        >
          Seeded {result.categories} categories, {result.tools} tools,{' '}
          {result.featured} featured.
        </div>
      )}

      {result && !result.ok && (
        <div
          role="alert"
          style={{
            padding: '10px 14px',
            border: '1px solid var(--red)',
            background: 'rgba(210, 25, 5, 0.06)',
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
            color: 'var(--red)',
          }}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
