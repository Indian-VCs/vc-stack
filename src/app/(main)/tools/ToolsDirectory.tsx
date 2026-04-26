'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { Tool, Category } from '@/lib/types'

const PRICING_OPTIONS = ['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE', 'OPEN_SOURCE'] as const

const PRICING_LABELS: Record<string, string> = {
  FREE: 'Free',
  FREEMIUM: 'Freemium',
  PAID: 'Paid',
  ENTERPRISE: 'Enterprise',
  OPEN_SOURCE: 'Open Source',
}

const PAGE_SIZE = 25

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return '' }
}

function buildPageList(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'gap')[] = [1]
  if (current > 4) pages.push('gap')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 3) pages.push('gap')
  pages.push(total)
  return pages
}

export default function ToolsDirectory({
  tools,
  categories,
  preview = false,
  previewLimit = 6,
}: {
  tools: Tool[]
  categories: Category[]
  preview?: boolean
  previewLimit?: number
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('')
  const [pricing, setPricing] = useState<string>('')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const listTopRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      if (category && t.category?.slug !== category) return false
      if (pricing && t.pricingModel !== pricing) return false
      if (featuredOnly && !t.isFeatured) return false
      if (q) {
        const hay = `${t.name} ${t.shortDesc ?? ''} ${t.description} ${t.category?.name ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [tools, query, category, pricing, featuredOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const visible = preview
    ? filtered.slice(0, previewLimit)
    : filtered.slice(startIdx, startIdx + PAGE_SIZE)
  const showPreviewLink = preview && filtered.length > previewLimit
  const hasActiveFilters = Boolean(category || pricing || featuredOnly || query)

  useEffect(() => {
    if (page !== 1 && !preview) {
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [page, preview])

  function clearFilters() {
    setQuery('')
    setCategory('')
    setPricing('')
    setFeaturedOnly(false)
    setPage(1)
  }

  function resetPaging<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1) }
  }

  function goToPage(p: number) {
    const clamped = Math.min(Math.max(1, p), totalPages)
    setPage(clamped)
  }

  return (
    <div className="ovc-card">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="ovc-toolbar">
        <div className="search-field">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => resetPaging(setQuery)(e.target.value)}
            placeholder="Search tools by name, section, thesis…"
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => resetPaging(setCategory)(e.target.value)}
            className="filter-select"
            aria-label="Filter by section"
          >
            <option value="">Section ▾</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={pricing}
            onChange={(e) => resetPaging(setPricing)(e.target.value)}
            className="filter-select"
            aria-label="Filter by pricing"
          >
            <option value="">Pricing ▾</option>
            {PRICING_OPTIONS.map((p) => (
              <option key={p} value={p}>{PRICING_LABELS[p]}</option>
            ))}
          </select>

          <label className="featured-toggle">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
            />
            <span>Featured</span>
          </label>
        </div>

        <button
          type="button"
          className="search-btn"
          onClick={() => clearFilters()}
          disabled={!hasActiveFilters}
          title={hasActiveFilters ? 'Clear all filters' : 'No active filters'}
        >
          {hasActiveFilters ? 'Clear' : 'Search'}
        </button>
      </div>

      {/* ── Column header ───────────────────────────────── */}
      <div ref={listTopRef} className="ovc-row ovc-row--head">
        <div className="r-logo" />
        <div className="r-name">
          <span className="r-count">
            <strong>{filtered.length.toLocaleString()}</strong>{' '}
            {filtered.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>
        <div className="r-section h-label">Section</div>
        <div className="r-pricing h-label">Pricing</div>
        <div className="r-thesis h-label">Thesis</div>
        <div className="r-actions" />
      </div>

      {/* ── Rows ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="empty">No tools match the current filters.</div>
      ) : (
        <div>
          {visible.map((t, i) => {
            const domain = domainOf(t.websiteUrl)
            const hero = i === 0 && t.isFeatured && !hasActiveFilters
            return (
              <div
                key={t.id}
                className={`ovc-row ovc-row--item ${hero ? 'ovc-row--hero' : ''}`}
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              >
                <div className="r-logo">
                  {t.logoUrl ? (
                    <img
                      src={t.logoUrl}
                      alt=""
                      onError={(e) => {
                        const img = e.currentTarget
                        const fb = document.createElement('div')
                        fb.className = 'logo-fb'
                        fb.textContent = initials(t.name)
                        img.replaceWith(fb)
                      }}
                    />
                  ) : (
                    <div className="logo-fb">{initials(t.name)}</div>
                  )}
                </div>

                <div className="r-name">
                  <Link href={`/product/${t.slug}`} className="tool-name">
                    {t.name}
                    {t.isFeatured && <span className="star" title="Featured">★</span>}
                  </Link>
                  {domain && <div className="tool-sub">{domain}</div>}
                </div>

                <div className="r-section">
                  {t.category && (
                    <Link href={`/category/${t.category.slug}`} className="chip chip--section">
                      {t.category.name}
                    </Link>
                  )}
                </div>

                <div className="r-pricing">
                  <span className={`chip chip--price chip--${t.pricingModel.toLowerCase()}`}>
                    {PRICING_LABELS[t.pricingModel] ?? t.pricingModel}
                  </span>
                </div>

                <div className="r-thesis">
                  <p>{t.shortDesc ?? t.description.slice(0, 180)}</p>
                </div>

                <div className="r-actions">
                  <a
                    href={t.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Visit ↗
                  </a>
                  <Link href={`/product/${t.slug}`} className="link-details">
                    View details
                  </Link>
                </div>
              </div>
            )
          })}

          {showPreviewLink && (
            <div className="see-more">
              <Link href="/tools" className="see-more-link">
                ⊕ View all {filtered.length.toLocaleString()} tools →
              </Link>
            </div>
          )}

          {!preview && totalPages > 1 && (
            <nav className="pager" aria-label="Pagination">
              <div className="pager-status">
                Showing <strong>{startIdx + 1}</strong>–
                <strong>{Math.min(startIdx + PAGE_SIZE, filtered.length)}</strong>{' '}
                of <strong>{filtered.length.toLocaleString()}</strong>
              </div>

              <ul className="pager-list">
                <li>
                  <button
                    type="button"
                    className="pager-nav"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    ← Prev
                  </button>
                </li>

                {buildPageList(currentPage, totalPages).map((p, i) =>
                  p === 'gap' ? (
                    <li key={`gap-${i}`} className="pager-gap" aria-hidden>…</li>
                  ) : (
                    <li key={p}>
                      <button
                        type="button"
                        className={`pager-num ${p === currentPage ? 'is-current' : ''}`}
                        onClick={() => goToPage(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    </li>
                  )
                )}

                <li>
                  <button
                    type="button"
                    className="pager-nav"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}

      <style jsx>{`
        /* ── Card shell ──────────────────────────── */
        .ovc-card {
          background: var(--paper);
          border: 1px solid var(--ink);
          box-shadow: var(--shadow-soft, 4px 4px 0 rgba(26, 20, 16, 0.05));
          animation: cardIn 420ms ease-out both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%   { background: rgba(192, 57, 43, 0.02); }
          50%  { background: rgba(192, 57, 43, 0.09); }
          100% { background: rgba(192, 57, 43, 0.055); }
        }

        /* ── Toolbar ─────────────────────────────── */
        .ovc-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid var(--ink);
          background: var(--paper);
          flex-wrap: wrap;
        }
        .search-field {
          flex: 1 1 320px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--rule);
          background: var(--paper-alt, #fff);
          padding: 0 14px;
          min-width: 0;
        }
        .search-icon {
          font-family: var(--mono);
          font-size: 1.1rem;
          color: var(--ink-muted);
        }
        .search-input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink);
          padding: 12px 0;
          min-width: 0;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-select {
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink);
          background: var(--paper);
          border: 1px solid var(--rule);
          padding: 10px 14px;
          cursor: pointer;
          border-radius: 0;
        }
        .filter-select:hover { border-color: var(--ink); }
        .featured-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 12px;
          border: 1px solid var(--rule);
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink);
          cursor: pointer;
        }
        .featured-toggle input { accent-color: var(--red); }
        .search-btn {
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          padding: 11px 22px;
          border: 1px solid var(--ink);
          background: var(--ink);
          color: var(--paper);
          cursor: pointer;
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        .search-btn:hover:not(:disabled) {
          background: var(--red);
          border-color: var(--red);
        }
        .search-btn:active:not(:disabled) {
          transform: scale(0.96);
        }
        .search-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* ── Row grid ────────────────────────────── */
        .ovc-row {
          display: grid;
          grid-template-columns:
            60px
            minmax(150px, 1.3fr)
            minmax(130px, 0.9fr)
            minmax(118px, 0.6fr)
            minmax(180px, 2.2fr)
            132px;
          gap: 16px;
          padding: 14px 18px;
          border-bottom: 1px solid var(--rule);
          align-items: center;
        }
        .ovc-row > * { min-width: 0; }
        .ovc-row:last-child { border-bottom: 0; }
        .ovc-row--item {
          animation: rowIn 380ms ease-out both;
          transition:
            background var(--dur-fast, 180ms) ease,
            transform var(--dur-fast, 180ms) ease,
            box-shadow var(--dur-fast, 180ms) ease;
          cursor: default;
        }
        .ovc-row--item:hover {
          background: rgba(26, 20, 16, 0.025);
          transform: translateY(-1px);
          box-shadow: 0 1px 0 rgba(26, 20, 16, 0.06);
        }
        .ovc-row--head {
          padding: 12px 18px;
          border-bottom: 1px solid var(--ink);
          background: var(--paper);
        }
        .h-label {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink-muted);
        }
        .r-count {
          font-family: var(--body);
          font-size: var(--fs-meta);
          color: var(--ink-light);
        }
        .r-count strong {
          color: var(--ink);
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .ovc-row--hero {
          background: rgba(192, 57, 43, 0.055);
          animation: rowIn 380ms ease-out both, heroPulse 1.8s ease-out 420ms 1;
        }

        /* ── Logo ── */
        .r-logo img,
        .r-logo :global(.logo-fb) {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          object-fit: contain;
          background: var(--paper-alt, #fff);
          border: 1px solid var(--rule);
          display: block;
        }
        .r-logo :global(.logo-fb) {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--mono);
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--ink);
        }

        /* ── Name + sub ── */
        .tool-name {
          font-family: var(--serif);
          font-weight: 700;
          font-size: var(--fs-card);
          color: var(--ink);
          text-decoration: none;
          line-height: 1.2;
          display: inline;
        }
        .tool-name:hover { color: var(--red); }
        .star {
          color: var(--red);
          margin-left: 6px;
          font-size: 0.9em;
          vertical-align: middle;
        }
        .tool-sub {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          color: var(--ink-muted);
          margin-top: 4px;
          text-transform: lowercase;
          letter-spacing: 0.04em;
        }

        /* ── Chips ── */
        .chip {
          display: inline-block;
          max-width: 100%;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(26, 20, 16, 0.06);
          color: var(--ink);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
          vertical-align: middle;
          border: 1px solid transparent;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
        }
        .chip--section:hover {
          color: var(--red);
          background: rgba(192, 57, 43, 0.08);
          transform: translateY(-1px);
        }
        .chip--free,
        .chip--open_source,
        .chip--freemium {
          background: rgba(39, 120, 82, 0.1);
          color: #1f6a43;
        }
        .chip--paid {
          background: rgba(26, 20, 16, 0.08);
          color: var(--ink);
        }
        .chip--enterprise {
          background: rgba(192, 57, 43, 0.1);
          color: var(--red);
        }

        /* ── Thesis ── */
        .r-thesis p {
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink-light);
          line-height: 1.5;
          margin: 0;
          overflow-wrap: break-word;
          word-break: normal;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Actions ── */
        .r-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
        }
        .btn-primary {
          font-family: var(--mono);
          font-size: var(--fs-btn);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 9px 14px;
          border: 1px solid var(--red);
          color: var(--paper);
          background: var(--red);
          text-decoration: none;
          text-align: center;
          border-radius: 4px;
          white-space: nowrap;
          transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }
        .btn-primary:hover {
          background: var(--red-dark, #9a2c20);
          border-color: var(--red-dark, #9a2c20);
          color: var(--paper);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(192, 57, 43, 0.28);
        }
        .btn-primary:active { transform: scale(0.96); box-shadow: none; }
        .link-details {
          font-family: var(--body);
          font-size: var(--fs-meta);
          color: var(--ink-light);
          text-decoration: none;
          text-align: center;
          padding: 2px 0;
        }
        .link-details:hover {
          color: var(--red);
          text-decoration: underline;
        }

        /* ── See more ── */
        .see-more {
          display: flex;
          justify-content: center;
          padding: 20px 18px 24px;
        }
        .see-more button,
        .see-more-link {
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 10px 18px;
          background: transparent;
          border: 1px dashed var(--rule);
          color: var(--ink-light);
          cursor: pointer;
          text-decoration: none;
          transition: color 180ms ease, border-color 180ms ease, transform 180ms ease, background 180ms ease;
          display: inline-block;
        }
        .see-more button:hover,
        .see-more-link:hover {
          color: var(--red);
          border-color: var(--red);
          transform: translateY(-1px);
          background: rgba(192, 57, 43, 0.04);
        }

        /* ── Pager ── */
        .pager {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 18px 18px 22px;
          border-top: 1px solid var(--rule);
        }
        .pager-status {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-muted);
        }
        .pager-status strong {
          color: var(--ink);
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        .pager-list {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0;
          margin: 0;
        }
        .pager-nav,
        .pager-num {
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
          min-width: 40px;
          height: 40px;
          padding: 0 12px;
          background: var(--paper);
          border: 1px solid var(--rule);
          color: var(--ink);
          cursor: pointer;
          transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 160ms ease;
        }
        .pager-nav:hover:not(:disabled),
        .pager-num:hover:not(.is-current) {
          color: var(--red);
          border-color: var(--red);
        }
        .pager-nav:active:not(:disabled),
        .pager-num:active:not(.is-current) {
          transform: scale(0.96);
        }
        .pager-nav:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pager-num.is-current {
          background: var(--ink);
          border-color: var(--ink);
          color: var(--paper);
          cursor: default;
        }
        .pager-gap {
          font-family: var(--mono);
          color: var(--ink-muted);
          padding: 0 4px;
          user-select: none;
        }
        @media (max-width: 620px) {
          .pager { justify-content: center; }
          .pager-status { width: 100%; text-align: center; }
        }

        .empty {
          padding: 60px 24px;
          text-align: center;
          font-family: var(--body);
          color: var(--ink-muted);
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ovc-row {
            grid-template-columns:
              52px
              minmax(140px, 1.5fr)
              minmax(110px, 0.9fr)
              minmax(80px, 0.5fr)
              130px;
          }
          .r-thesis { display: none; }
        }
        @media (max-width: 820px) {
          .ovc-toolbar { padding: 12px; gap: 8px; }
          .filter-group { flex: 1 1 100%; }
          .search-btn { flex: 1 1 100%; }
          .ovc-row {
            grid-template-columns: 52px minmax(0, 1fr) auto;
            gap: 12px;
            padding: 14px 12px;
            align-items: start;
          }
          .r-section, .r-pricing { grid-column: 2 / 3; }
          .r-section { display: flex; flex-wrap: wrap; gap: 6px; }
          .r-section::after {
            content: '';
          }
          .r-actions {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: flex-start;
            padding-top: 4px;
          }
          .btn-primary, .link-details { flex: 0 0 auto; }
          .ovc-row--head .r-section,
          .ovc-row--head .r-pricing,
          .ovc-row--head .r-thesis,
          .ovc-row--head .r-actions { display: none; }
        }
      `}</style>
    </div>
  )
}
