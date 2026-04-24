'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types'

export interface PreviewTool {
  name: string
  logoUrl?: string | null
}

interface CategoryCardProps {
  category: Category
  previewTools?: PreviewTool[]
  variant?: 'default' | 'compact'
  /** Kept for back-compat; no longer rendered on the default variant. */
  index?: number
}

export default function CategoryCard({
  category,
  previewTools = [],
  variant = 'default',
}: CategoryCardProps) {
  const toolCount = category._count?.tools ?? 0

  if (variant === 'compact') {
    return (
      <Link
        href={`/category/${category.slug}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
          padding: '12px 0',
          borderBottom: '1px solid var(--rule)',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'var(--fs-card)',
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          {category.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          {toolCount} tools →
        </span>
      </Link>
    )
  }

  const chips = previewTools.slice(0, 6)

  return (
    <Link
      href={`/category/${category.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: 20,
        textDecoration: 'none',
        transition: 'all var(--dur-fast)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ink)'
        e.currentTarget.style.background = 'var(--paper-dark)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--rule)'
        e.currentTarget.style.background = 'var(--paper)'
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 'var(--fs-hero)',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {category.name}
      </h3>

      {category.description && (
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: 'var(--fs-body)',
            color: 'var(--ink-light)',
            lineHeight: 1.45,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {category.description}
        </p>
      )}

      {chips.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginTop: 'auto',
            paddingTop: 12,
          }}
        >
          {chips.map((t) => (
            <span
              key={t.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                color: 'var(--ink-muted)',
                padding: '3px 7px',
                border: '1px solid var(--rule)',
                background: 'var(--paper)',
              }}
            >
              {t.logoUrl && (
                <img
                  src={t.logoUrl}
                  alt=""
                  style={{ width: 14, height: 14, objectFit: 'contain' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              )}
              {t.name}
            </span>
          ))}
          {toolCount > chips.length && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                color: 'var(--ink-muted)',
                padding: '3px 7px',
              }}
            >
              +{toolCount - chips.length}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
