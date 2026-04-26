import Link from 'next/link'

interface ProductCardProps {
  name: string
  tagline: string
  logoUrl: string
  slug: string
}

export function ProductCard({ name, tagline, logoUrl, slug }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="pc-link">
      <div className="pc-body">
        <div className="pc-logo">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${name} logo`} className="pc-logo-img" />
          ) : (
            <span className="pc-logo-fb">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h3 className="pc-name">{name}</h3>
          <p className="pc-tagline">{tagline}</p>
        </div>
      </div>

      <style jsx>{`
        .pc-link {
          display: block;
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 20px;
          text-decoration: none;
          transition: border-color var(--dur-fast) var(--ease-out),
                      transform var(--dur-fast) var(--ease-out);
        }
        .pc-link:hover { border-color: var(--ink); }
        .pc-link:active { transform: scale(0.96); }

        .pc-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .pc-logo {
          width: 64px;
          height: 64px;
          border: 1px solid var(--rule);
          background: var(--paper);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          outline: 1px solid rgba(0, 0, 0, 0.1);
          outline-offset: -1px;
        }
        .pc-logo-fb {
          font-family: var(--serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--ink-muted);
        }

        .pc-name {
          font-family: var(--serif);
          font-size: var(--fs-card);
          font-weight: 700;
          color: var(--ink);
          line-height: 1.2;
          text-wrap: balance;
        }
        .pc-tagline {
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink-muted);
          margin-top: 6px;
          text-wrap: pretty;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Link>
  )
}
