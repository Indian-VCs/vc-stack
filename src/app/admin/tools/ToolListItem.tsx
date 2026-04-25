'use client'

import Link from 'next/link'
import { useTransition, useState } from 'react'
import type { ToolRow } from '@/lib/db/schema'
import { archiveTool, restoreTool } from './_form/actions'

export default function ToolListItem({
  row,
  categoryName,
}: {
  row: ToolRow
  categoryName: string
}) {
  const [isPending, start] = useTransition()
  const [error, setError] = useState('')
  const [archived, setArchived] = useState(Boolean(row.archivedAt))

  function toggle() {
    setError('')
    start(async () => {
      const res = archived ? await restoreTool(row.id) : await archiveTool(row.id)
      if (!res.ok) {
        setError(res.message ?? 'Action failed.')
        return
      }
      setArchived(!archived)
    })
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 16,
        padding: '12px 16px',
        borderBottom: '1px solid var(--rule)',
        background: archived ? 'var(--paper-alt)' : 'var(--paper)',
        opacity: archived ? 0.6 : 1,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
          <Link
            href={`/admin/tools/${row.id}/edit`}
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--ink)',
              textDecoration: 'none',
            }}
          >
            {row.name}
          </Link>
          {row.isFeatured && (
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--red)',
                border: '1px solid var(--red)',
                padding: '0 6px',
              }}
            >
              Featured
              {row.featuredOrder !== null && row.featuredOrder !== undefined ? ` #${row.featuredOrder}` : ''}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            color: 'var(--ink-muted)',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span>{row.slug}</span>
          <span>· {categoryName}</span>
          <span>· {row.pricingModel}</span>
        </div>
        {error && (
          <div
            role="alert"
            style={{
              color: 'var(--red)',
              fontFamily: 'var(--body)',
              fontSize: '0.85rem',
              marginTop: 4,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          alignSelf: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          color: 'var(--ink-light)',
        }}
      >
        <a
          href={row.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--red)', textDecoration: 'none' }}
        >
          ↗ open
        </a>
      </div>

      <div style={{ alignSelf: 'center', display: 'flex', gap: 8 }}>
        <Link
          href={`/admin/tools/${row.id}/edit`}
          style={{
            padding: '6px 10px',
            border: '1px solid var(--rule)',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          style={{
            padding: '6px 10px',
            border: '1px solid var(--rule)',
            background: 'transparent',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: archived ? 'var(--ink)' : 'var(--red)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.5 : 1,
          }}
        >
          {archived ? 'Restore' : 'Archive'}
        </button>
      </div>
    </div>
  )
}
