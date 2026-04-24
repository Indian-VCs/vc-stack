import Link from 'next/link'

interface Props {
  /** Current page (1-indexed). */
  page: number
  /** Total number of pages. */
  totalPages: number
  /** Builds the href for a given page number. */
  hrefFor: (page: number) => string
}

/**
 * Broadsheet-style numeric pagination. 44x44 touch targets, border-collapsed.
 * Hidden entirely when there is only one page.
 */
export default function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="pg">
      {pages.map((p) => {
        const isCurrent = p === page
        return (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-label={`Page ${p}`}
            aria-current={isCurrent ? 'page' : undefined}
            className={`pg-link ${isCurrent ? 'is-current' : ''}`}
          >
            {p}
          </Link>
        )
      })}

      <style>{`
        .pg {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 32px;
        }
        .pg-link {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 44px;
          padding: 0 12px;
          margin-left: -1px;
          font-family: var(--mono);
          font-size: var(--fs-btn);
          letter-spacing: 0.1em;
          border: 1px solid var(--rule);
          background: var(--paper);
          color: var(--ink-light);
          text-decoration: none;
          transition: background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast);
        }
        .pg-link:first-child { margin-left: 0; }
        .pg-link:hover {
          border-color: var(--ink);
          color: var(--ink);
          z-index: 1;
          position: relative;
        }
        .pg-link:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: -2px;
          z-index: 2;
          position: relative;
        }
        .pg-link.is-current {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }
      `}</style>
    </nav>
  )
}
