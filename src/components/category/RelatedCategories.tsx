import Link from 'next/link'
import type { Category } from '@/lib/types'

interface Props {
  relatedSlugs?: string[] | null
  allCategories: Category[]
  currentSlug: string
}

export default function RelatedCategories({ relatedSlugs, allCategories, currentSlug }: Props) {
  if (!relatedSlugs || relatedSlugs.length === 0) return null

  const resolved = relatedSlugs
    .filter((s) => s !== currentSlug)
    .map((s) => allCategories.find((c) => c.slug === s))
    .filter((c): c is Category => c !== undefined)

  if (resolved.length === 0) return null

  return (
    <section
      style={{
        borderTop: '2px solid var(--ink)',
        borderBottom: '2px solid var(--ink)',
        padding: '20px 0',
        marginTop: 32,
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
          marginBottom: 14,
        }}
      >
        Also in the stack
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {resolved.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--ink)',
              textDecoration: 'none',
              padding: '12px 14px',
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
            }}
          >
            {cat.name}
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                color: 'var(--ink-muted)',
                marginLeft: 8,
              }}
            >
              {cat._count?.tools ?? 0}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
