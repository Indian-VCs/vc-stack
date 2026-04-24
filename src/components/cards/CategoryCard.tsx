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
    <Link href={`/category/${category.slug}`} className="cat-card">
      <h3 className="cat-card-title">{category.name}</h3>

      {category.description && (
        <p className="cat-card-desc">{category.description}</p>
      )}

      {chips.length > 0 && (
        <div className="cat-card-chips">
          {chips.map((t) => (
            <span key={t.name} className="cat-card-chip">
              {t.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.logoUrl}
                  alt=""
                  style={{ width: 14, height: 14, objectFit: 'contain' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              {t.name}
            </span>
          ))}
          {toolCount > chips.length && (
            <span className="cat-card-more">+{toolCount - chips.length}</span>
          )}
        </div>
      )}

      <style jsx>{`
        .cat-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 20px;
          text-decoration: none;
          transition: border-color var(--dur-fast), background var(--dur-fast);
          height: 100%;
        }
        .cat-card:hover,
        .cat-card:focus-visible {
          border-color: var(--ink);
          background: var(--paper-dark);
        }
        .cat-card:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .cat-card-title {
          font-family: var(--serif);
          font-size: var(--fs-hero);
          font-weight: 700;
          color: var(--ink);
          line-height: 1.15;
          margin: 0;
        }
        .cat-card-desc {
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink-light);
          line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cat-card-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 12px;
        }
        .cat-card-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          color: var(--ink-muted);
          padding: 3px 7px;
          border: 1px solid var(--rule);
          background: var(--paper);
        }
        .cat-card-more {
          display: inline-flex;
          align-items: center;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          color: var(--ink-muted);
          padding: 3px 7px;
        }
      `}</style>
    </Link>
  )
}
