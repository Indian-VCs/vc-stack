'use client'

import Link from 'next/link'
import type { Tool } from '@/lib/types'

const PRICING_LABELS: Record<string, string> = {
  FREE: 'Free',
  FREEMIUM: 'Freemium',
  PAID: 'Paid',
  ENTERPRISE: 'Enterprise',
}

const PRICING_TAG: Record<string, string> = {
  FREE: 'tag tag--positive',
  FREEMIUM: 'tag',
  PAID: 'tag tag--accent',
  ENTERPRISE: 'tag tag--warning',
}

function Logo({ name, logoUrl, size = 40 }: { name: string; logoUrl?: string | null; size?: number }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          padding: 4,
          flexShrink: 0,
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'var(--ink)',
        color: 'var(--paper)',
        fontFamily: 'var(--serif)',
        fontWeight: 700,
        fontSize: size * 0.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

interface ToolCardProps {
  tool: Tool
  variant?: 'default' | 'compact' | 'row'
  index?: number
}

export default function ToolCard({ tool, variant = 'default', index }: ToolCardProps) {
  const reviewCount = tool._count?.reviews ?? tool.reviews?.length ?? 0
  const num = index !== undefined ? String(index + 1).padStart(2, '0') : null

  /* ── Row (HN-style feed item) ─────────────────────────────────── */
  if (variant === 'row') {
    return (
      <div className="row">
        <div className="row-gutter">
          {num && <span>{num}</span>}
          <Logo name={tool.name} logoUrl={tool.logoUrl} size={32} />
        </div>
        <div>
          <Link
            href={`/product/${tool.slug}`}
            className="row-title"
            style={{ textDecoration: 'none', color: 'var(--ink)' }}
          >
            {tool.name}
            {tool.isFeatured && (
              <span className="tag tag--accent" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
                Featured
              </span>
            )}
          </Link>
          <div className="row-meta">
            {tool.category && (
              <>
                <Link
                  href={`/category/${tool.category.slug}`}
                  style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}
                >
                  {tool.category.name}
                </Link>
                {' · '}
              </>
            )}
            {PRICING_LABELS[tool.pricingModel] ?? tool.pricingModel}
            {reviewCount > 0 && ` · ${reviewCount} review${reviewCount !== 1 ? 's' : ''}`}
            {' · '}
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-muted)' }}
            >
              visit ↗
            </a>
          </div>
          {tool.shortDesc && <div className="row-body">{tool.shortDesc}</div>}
        </div>
      </div>
    )
  }

  /* ── Compact ──────────────────────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <Link
        href={`/product/${tool.slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          border: '1px solid var(--rule)',
          background: 'var(--paper)',
          textDecoration: 'none',
        }}
      >
        <Logo name={tool.name} logoUrl={tool.logoUrl} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'var(--fs-result)',
              fontWeight: 700,
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontSize: 'var(--fs-meta)',
              color: 'var(--ink-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tool.shortDesc ?? ''}
          </div>
        </div>
        <span className={PRICING_TAG[tool.pricingModel] ?? 'tag'}>
          {PRICING_LABELS[tool.pricingModel] ?? tool.pricingModel}
        </span>
      </Link>
    )
  }

  /* ── Default card ─────────────────────────────────────────────── */
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: 20,
        height: '100%',
        transition: 'border-color var(--dur-fast)',
      }}
    >
      <Link
        href={`/product/${tool.slug}`}
        aria-label={tool.name}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <Logo name={tool.name} logoUrl={tool.logoUrl} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'var(--fs-card)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {tool.name}
          </div>
          {tool.category && (
            <Link
              href={`/category/${tool.category.slug}`}
              style={{
                position: 'relative',
                zIndex: 2,
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                color: 'var(--ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              {tool.category.name}
            </Link>
          )}
        </div>
        {tool.isFeatured && (
          <span className="tag tag--accent" style={{ position: 'relative', zIndex: 2 }}>
            Featured
          </span>
        )}
      </div>

      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: 'var(--fs-body)',
          color: 'var(--ink-light)',
          lineHeight: 1.5,
          flex: 1,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {tool.shortDesc ?? tool.description.slice(0, 140)}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingTop: 12,
          borderTop: '1px solid var(--rule)',
        }}
      >
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'relative',
            zIndex: 2,
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
          }}
        >
          Visit ↗
        </a>
      </div>
    </div>
  )
}
