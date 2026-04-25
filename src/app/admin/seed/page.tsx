/**
 * Admin Seed page — one-click upsert of the static catalog into D1.
 *
 * Use this after a fresh deploy where D1 has been bound but is still empty.
 * Idempotent: re-running it overwrites tool/category fields with the static
 * catalog values and re-applies the canonical Featured order.
 */

import type { Metadata } from 'next'
import { isNull } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
} from '@/lib/static-catalog'
import SeedButton from './SeedButton'

export const metadata: Metadata = { title: 'Seed catalog' }
export const dynamic = 'force-dynamic'

async function getCounts() {
  const db = await getDb()
  const [tools, categories] = await Promise.all([
    db.$count(schema.tools, isNull(schema.tools.archivedAt)),
    db.$count(schema.categories, isNull(schema.categories.archivedAt)),
  ])
  return { tools, categories }
}

export default async function SeedPage() {
  await requireAdmin()

  let live = { tools: 0, categories: 0 }
  let dbOk = true
  let dbError = ''
  try {
    live = await getCounts()
  } catch (err) {
    dbOk = false
    dbError = err instanceof Error ? err.message : String(err)
  }

  const expected = {
    tools: STATIC_TOOLS.length,
    categories: STATIC_CATEGORIES.length,
    featured: FEATURED_TOOL_SLUGS.length,
  }

  const fullySeeded = dbOk && live.tools >= expected.tools && live.categories >= expected.categories

  return (
    <div style={{ padding: '32px 40px 64px', maxWidth: 820 }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 32,
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
          Operations
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
          Seed catalog
        </h1>
      </header>

      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: '1rem',
          lineHeight: 1.6,
          color: 'var(--ink)',
          marginBottom: 24,
        }}
      >
        Upsert the canonical{' '}
        <code style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
          src/lib/static-catalog.ts
        </code>{' '}
        into the live database. Safe to re-run — existing rows are updated in
        place, archived rows are not touched, and the Featured order is
        rewritten to mirror{' '}
        <code style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
          FEATURED_TOOL_SLUGS
        </code>
        .
      </p>

      {!dbOk && (
        <div
          role="alert"
          style={{
            border: '1px solid var(--red)',
            background: 'rgba(210, 25, 5, 0.06)',
            padding: 16,
            marginBottom: 24,
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
            color: 'var(--ink)',
          }}
        >
          <strong>Database not reachable.</strong> Seeding can&rsquo;t run until{' '}
          D1 is bound. Error:{' '}
          <code style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
            {dbError}
          </code>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          border: '1px solid var(--ink)',
          marginBottom: 32,
        }}
      >
        <Stat label="Categories in DB" value={live.categories} expected={expected.categories} />
        <Stat label="Tools in DB" value={live.tools} expected={expected.tools} bordered />
        <Stat label="Featured slugs" value={fullySeeded ? expected.featured : '—'} expected={expected.featured} bordered />
      </div>

      <SeedButton />

      <p
        style={{
          marginTop: 24,
          fontFamily: 'var(--body)',
          fontSize: '0.9rem',
          color: 'var(--ink-muted)',
          lineHeight: 1.6,
        }}
      >
        {fullySeeded
          ? 'Catalog appears fully seeded. Re-running will refresh content from static-catalog.ts.'
          : 'Catalog looks empty or partial. Click the button above to seed.'}
      </p>
    </div>
  )
}

function Stat({
  label,
  value,
  expected,
  bordered,
}: {
  label: string
  value: number | string
  expected: number
  bordered?: boolean
}) {
  return (
    <div
      style={{
        padding: '20px 18px',
        borderLeft: bordered ? '1px solid var(--rule)' : 'none',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--ink-muted)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 900,
          fontSize: '2rem',
          color: 'var(--ink)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          marginTop: 6,
        }}
      >
        of {expected}
      </div>
    </div>
  )
}
