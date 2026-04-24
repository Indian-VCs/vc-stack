import Link from 'next/link'
import type { PricingModel, SortOrder } from '@/lib/types'

interface Props {
  basePath: string
  pricing?: PricingModel | ''
  sort?: SortOrder
  /** Filtered count + total for the "showing N of M" meta label. */
  filteredCount: number
  totalCount: number
}

const PRICING_OPTIONS: Array<{ value: PricingModel | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'FREE', label: 'Free' },
  { value: 'FREEMIUM', label: 'Freemium' },
  { value: 'PAID', label: 'Paid' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
]

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'alpha', label: 'A–Z' },
  { value: 'reviews', label: 'Most reviewed' },
]

function buildHref(
  base: string,
  params: { pricing?: string; sort?: string }
): string {
  const qs = new URLSearchParams()
  if (params.pricing) qs.set('pricing', params.pricing)
  if (params.sort && params.sort !== 'featured') qs.set('sort', params.sort)
  const str = qs.toString()
  return str ? `${base}?${str}` : base
}

export default function CategoryControls({
  basePath,
  pricing = '',
  sort = 'featured',
  filteredCount,
  totalCount,
}: Props) {
  const isFiltered = !!pricing
  return (
    <div className="cat-ctrls">
      <div className="cat-ctrls-row">
        <span className="cat-ctrls-label">Pricing</span>
        <div className="cat-ctrls-group" role="group" aria-label="Filter by pricing">
          {PRICING_OPTIONS.map((opt) => {
            const active = (opt.value || '') === (pricing || '')
            return (
              <Link
                key={opt.value || 'all'}
                href={buildHref(basePath, { pricing: opt.value, sort })}
                className={`cat-ctrls-chip ${active ? 'is-active' : ''}`}
                aria-pressed={active}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="cat-ctrls-row">
        <span className="cat-ctrls-label">Sort</span>
        <div className="cat-ctrls-group" role="group" aria-label="Sort tools">
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === sort
            return (
              <Link
                key={opt.value}
                href={buildHref(basePath, { pricing, sort: opt.value })}
                className={`cat-ctrls-chip ${active ? 'is-active' : ''}`}
                aria-pressed={active}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="cat-ctrls-meta" aria-live="polite">
        {isFiltered
          ? `${filteredCount} of ${totalCount} tools`
          : `${totalCount} ${totalCount === 1 ? 'tool' : 'tools'}`}
      </div>

      <style>{`
        .cat-ctrls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 20px;
          padding: 14px 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          margin-bottom: 24px;
        }
        .cat-ctrls-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .cat-ctrls-label {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cat-ctrls-group {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 4px;
          min-width: 0;
        }
        .cat-ctrls-chip {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 0 12px;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-light);
          background: var(--paper);
          border: 1px solid var(--rule);
          text-decoration: none;
          white-space: nowrap;
          transition: background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast);
        }
        .cat-ctrls-chip:hover {
          border-color: var(--ink);
          color: var(--ink);
        }
        .cat-ctrls-chip:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .cat-ctrls-chip.is-active {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }
        .cat-ctrls-meta {
          margin-left: auto;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink-muted);
          white-space: nowrap;
        }
        /* On narrow viewports, meta wraps to its own full-width row below the controls. */
        @media (max-width: 640px) {
          .cat-ctrls-meta {
            margin-left: 0;
            width: 100%;
            padding-top: 4px;
            border-top: 1px dashed var(--rule);
          }
        }
      `}</style>
    </div>
  )
}
