'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import type { Tool } from '@/lib/types'

function Logo({ name, logoUrl, size = 40 }: { name: string; logoUrl?: string | null; size?: number }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          background: 'var(--surface-logo)',
          border: '1px solid var(--rule)',
          padding: 4,
          flexShrink: 0,
        }}
        onError={(e) => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[ToolCard] logo failed for ${name}: ${logoUrl}`)
          }
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
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
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div
      className="tool-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        height: '100%',
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
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 32,
                paddingTop: 6,
                paddingBottom: 6,
                marginTop: -6,
                marginBottom: -6,
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
          aria-label={`Visit ${tool.name} (opens in a new tab)`}
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 44,
            padding: '10px 4px',
            margin: '-10px -4px',
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
