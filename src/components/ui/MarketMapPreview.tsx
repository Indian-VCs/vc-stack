/**
 * Mobile-only homepage preview for the Market Map.
 *
 * The full MarketMapPoster prints every category and every tool — fine on
 * desktop, but on mobile (homepage) it pushes the rest of the page deep
 * below the fold. This card is the tease: title, total counts, the 17
 * category names as compact pills, one CTA. Tap → /market-map.
 */
import Link from 'next/link'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  totalTools: number
}

export default function MarketMapPreview({ categories, totalTools }: Props) {
  return (
    <Link href="/market-map" className="mmp">
      <div className="mmp-frame">
        <div className="mmp-counter">
          {totalTools} tools · {categories.length} sections
        </div>
        <div className="mmp-title">The Market Map</div>
        <div className="mmp-sub">Every tool, grouped by section.</div>
        <div className="mmp-pills">
          {categories.map((c) => (
            <span key={c.id} className="mmp-pill">
              {c.name}
            </span>
          ))}
        </div>
        <div className="mmp-cta">Open the map →</div>
      </div>

      <style>{`
        .mmp {
          display: block;
          text-decoration: none;
          color: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .mmp-frame {
          background: #fbe2d6;
          border: 1px solid var(--ink);
          padding: 18px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mmp-counter {
          font-family: var(--mono);
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
          align-self: flex-end;
        }
        .mmp-title {
          font-family: var(--serif);
          font-weight: 900;
          font-size: 1.6rem;
          line-height: 1.05;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .mmp-sub {
          font-family: var(--body);
          font-style: italic;
          color: var(--ink-light);
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .mmp-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .mmp-pill {
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 5px 8px;
          line-height: 1;
          white-space: nowrap;
        }
        .mmp-cta {
          margin-top: 6px;
          align-self: flex-start;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          padding: 10px 14px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .mmp:active .mmp-frame {
          background: #f7d6c5;
        }
      `}</style>
    </Link>
  )
}
