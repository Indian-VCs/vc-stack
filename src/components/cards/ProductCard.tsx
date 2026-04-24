import Link from 'next/link'

interface ProductCardProps {
  name: string
  tagline: string
  logoUrl: string
  slug: string
}

export function ProductCard({ name, tagline, logoUrl, slug }: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      style={{
        display: 'block',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: 20,
        textDecoration: 'none',
        transition: 'border-color var(--dur-fast)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            border: '1px solid var(--rule)',
            background: 'var(--surface-logo)',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--ink-muted)',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'var(--fs-card)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 'var(--fs-body)',
              color: 'var(--ink-muted)',
              marginTop: 6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {tagline}
          </p>
        </div>
      </div>
    </Link>
  )
}
