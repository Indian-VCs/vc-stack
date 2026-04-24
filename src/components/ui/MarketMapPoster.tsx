'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import type { Category, Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
  categories: Category[]
}

/**
 * Market-map layout — one block:
 *
 *   GRID_BLOCK: cols 1–3 normal + right-block covering cols 4+5.
 *     Right-block: [Transcription/Voice-to-Text col] [News col] on top,
 *     then Other Tools spanning the full 2-col width,
 *     then Automation (3 tools, single row) spanning the full 2-col width.
 */

/** Cols 1–3 rendered as regular flex columns. */
const LEFT_COLS: string[][] = [
  ['ai', 'mailing', 'calendar', 'admin-ops', 'productivity'],
  ['crm', 'research', 'browser'],
  ['data', 'communication', 'portfolio-management', 'vibe-coding'],
]

/** Cols 4–5: sit side-by-side in the top of the right-block. */
const RIGHT_TOP_COLS: string[][] = [
  ['transcription', 'voice-to-text'],
  ['news'],
]

/** Categories that span the full width of the right-block, stacked below right-top. */
const RIGHT_BOTTOM_STACK: string[] = ['automation', 'other-tools']

/**
 * Categories with a wider internal pill grid than the default 2-col.
 *   automation : 3-col pill grid → 3 tools fit in 1 row (bottom of right-block)
 *   other-tools: 3-col pill grid → 24 tools in 8 rows spanning cols 4+5 width
 */
const WIDE_PILL_CATS: Record<string, number> = {
  'automation': 3,
  'other-tools': 3,
}

/** Mobile: flat vertical order — priority-heavy cats first. */
const MOBILE_ORDER = [
  'ai', 'crm', 'data', 'transcription', 'news',
  'research', 'other-tools',
  'mailing', 'voice-to-text', 'calendar', 'communication',
  'portfolio-management', 'admin-ops', 'automation',
  'productivity', 'browser', 'vibe-coding',
]

/**
 * Broadsheet-safe fallback backgrounds. A flat ink shade chosen deterministically
 * from the tool name — no rainbow gradients, no AI palette. Always paired with
 * paper-white initials for guaranteed ≥7:1 contrast. Shades stay within the
 * warm-brown/ink family so they read as part of the paper aesthetic.
 */
const FALLBACK_SHADES = [
  '#1a1410', /* --ink */
  '#2f271f',
  '#3a322a', /* --ink-light */
  '#524a3c', /* --ink-muted */
  '#5a4731',
  '#6b5a3f',
  '#a41204', /* --red-dark */
  '#d21905', /* --red */
]

function fallbackShade(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return FALLBACK_SHADES[Math.abs(h) % FALLBACK_SHADES.length]
}

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function ToolPill({ t }: { t: Tool }) {
  const domain = domainOf(t.websiteUrl)
  const src = t.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '')
  return (
    <Link
      href={`/product/${t.slug}`}
      className="t"
      title={t.name + (domain ? ` — ${domain}` : '')}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={18}
          height={18}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[MarketMap] logo failed for ${t.name}: ${src}`)
            }
            const img = e.currentTarget
            const fb = document.createElement('div')
            fb.className = 't-fb'
            fb.textContent = initials(t.name)
            fb.style.background = fallbackShade(t.name)
            img.replaceWith(fb)
          }}
        />
      ) : (
        <div className="t-fb" style={{ background: fallbackShade(t.name) }}>{initials(t.name)}</div>
      )}
      <span>{t.name}</span>
    </Link>
  )
}

function CategoryCard({
  catName,
  tools,
  index,
  pillCols = 2,
}: {
  catName: string
  tools: Tool[]
  index: number
  /** Columns inside the pill grid. Most cards stay 2; Other Tools uses 3. */
  pillCols?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reveal = () => el.classList.add('is-in')
    if (typeof IntersectionObserver === 'undefined') { reveal(); return }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { reveal(); io.disconnect(); break }
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="card"
      style={{
        transitionDelay: `${Math.min(index, 8) * 40}ms`,
        '--pill-cols': pillCols,
      } as React.CSSProperties}
    >
      <div className="card-head">
        <span className="name">{catName}</span>
      </div>
      <div className="tools">
        {tools.map((t) => <ToolPill key={t.id} t={t} />)}
      </div>
    </div>
  )
}

export default function MarketMapPoster({ tools, categories }: Props) {
  const posterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = posterRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isNarrow = window.matchMedia('(max-width: 900px)').matches
    // Skip scroll-linked zoom on mobile — the initial faint state reads as
    // "empty section" before the user scrolls, hurting first impressions.
    if (reduce || isNarrow) {
      el.style.setProperty('--poster-scale', '1')
      el.style.setProperty('--poster-opacity', '1')
      return
    }
    let rafId = 0
    const update = () => {
      rafId = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const start = vh
      const end = vh * 0.35
      const raw = (start - rect.top) / (start - end)
      const p = Math.max(0, Math.min(1, raw))
      const eased = 1 - Math.pow(1 - p, 3)
      const scale = 0.88 + eased * 0.12
      el.style.setProperty('--poster-scale', scale.toFixed(4))
      el.style.setProperty('--poster-opacity', (0.55 + eased * 0.45).toFixed(4))
    }
    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const { bySlug, slugToName, totalAppearances, totalCats } = useMemo(() => {
    const bySlug: Record<string, Tool[]> = {}
    const slugToName: Record<string, string> = {}
    for (const c of categories) slugToName[c.slug] = c.name
    for (const t of tools) {
      const primary = t.category?.slug
      const all = [primary, ...(t.extraCategorySlugs ?? [])].filter(Boolean) as string[]
      for (const slug of all) {
        if (!bySlug[slug]) bySlug[slug] = []
        bySlug[slug].push(t)
      }
    }
    // Sort: featured tools first, then alphabetical. Stable so multiple
    // featured tools keep a predictable order (by name).
    Object.values(bySlug).forEach((list) =>
      list.sort((a, b) => {
        const af = a.isFeatured ? 0 : 1
        const bf = b.isFeatured ? 0 : 1
        if (af !== bf) return af - bf
        return a.name.localeCompare(b.name)
      }),
    )
    const totalAppearances = Object.values(bySlug).reduce((n, l) => n + l.length, 0)
    const totalCats = Object.keys(bySlug).length
    return { bySlug, slugToName, totalAppearances, totalCats }
  }, [tools, categories])

  /**
   * Build a CategoryCard for a given slug + index, or null if the category
   * has no tools. Used by every render slot (desktop cols, right-block, mobile)
   * so the shape is identical across layouts.
   */
  const renderCard = (slug: string, index: number) => {
    const list = bySlug[slug] || []
    if (!list.length) return null
    return (
      <CategoryCard
        key={slug}
        catName={slugToName[slug] || slug}
        tools={list}
        index={index}
        pillCols={WIDE_PILL_CATS[slug] ?? 2}
      />
    )
  }

  return (
    <>
      <div
        ref={posterRef}
        className="poster"
        style={{
          transform: 'scale(var(--poster-scale, 0.88))',
          opacity: 'var(--poster-opacity, 0.55)',
          transformOrigin: '50% 20%',
          willChange: 'transform, opacity',
        }}
      >
        {/* Inline counter — the homepage section header already names this block */}
        <div className="poster-counter">
          <span>{totalAppearances} tools · {totalCats} categories</span>
        </div>

        {/* ── Desktop: cols 1–3 + right-block (cols 4+5 top, Other Tools + Automation stacked below) ── */}
        <div className="landscape landscape-desktop">
          <div className="grid-block">
            {/* Left: cols 1–3 */}
            {LEFT_COLS.map((catList, idx) => (
              <div key={idx} className="col">
                {catList.map((slug, i) => renderCard(slug, idx * 5 + i))}
              </div>
            ))}

            {/* Right-block: cols 4+5 on top, then Other Tools + Automation stacked full-width */}
            <div className="right-block">
              <div className="right-top">
                {RIGHT_TOP_COLS.map((catList, idx) => (
                  <div key={idx} className="col">
                    {catList.map((slug, i) =>
                      renderCard(slug, LEFT_COLS.length * 5 + idx * 3 + i),
                    )}
                  </div>
                ))}
              </div>
              {/* Other Tools + Automation stacked, each spans full right-block width (cols 4+5) */}
              {RIGHT_BOTTOM_STACK.map((slug, i) => renderCard(slug, 20 + i))}
            </div>
          </div>
        </div>

        <div className="landscape landscape-mobile">
          {MOBILE_ORDER.map((slug, i) => renderCard(slug, i))}
        </div>

        <div className="disclaimer">
          Informational purposes only · Publicly available data + editorial curation · Not exhaustive · Trademarks belong to their respective owners
        </div>
      </div>

      <style jsx>{`
        .poster {
          /* Flat red-tint background — lighter + red-leaning (not pink).
             The trick to keep light tints red-not-pink is to widen the
             R vs B channel gap (kept ~37 here) while pushing all
             channels brighter. Lighter than the earlier #F1D8CC,
             without drifting into the pink register. */
          background: #FBE2D6;
          border: 1px solid var(--ink);
          padding: 20px;
          overflow: visible;
          transition: none;
        }
        @media (max-width: 900px) {
          .poster { padding: 14px; }
        }
        .poster-counter {
          display: flex;
          justify-content: flex-end;
          padding: 0 0 10px;
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }

        .landscape {
          padding: 0;
        }
        /* Desktop: grid block on top, full-width banners below */
        .landscape-desktop {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .grid-block {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .right-block {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .right-top {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .banners {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .landscape-mobile  { display: none; flex-direction: column; gap: 12px; }
        .col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        :global(.poster .card) {
          background: var(--paper);
          border: 1px solid var(--ink);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 520ms var(--ease-out),
            transform 520ms var(--ease-out);
        }
        :global(.poster .card.is-in) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.poster .card-head) {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          padding: 4px 10px;
        }
        :global(.poster .card-head .name) {
          font-family: var(--mono);
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
        }
        :global(.poster .tools) {
          display: grid;
          grid-template-columns: repeat(var(--pill-cols, 2), minmax(0, 1fr));
          gap: 4px 6px;
          padding: 7px 8px 9px;
          background: var(--paper-alt);
        }

        .disclaimer {
          font-family: var(--body);
          font-style: italic;
          font-size: 0.72rem;
          color: var(--ink-muted);
          text-align: center;
          padding: 14px 24px 2px;
          line-height: 1.5;
        }
      `}</style>

      <style jsx global>{`
        .poster .t {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--rule);
          border-radius: 4px;
          padding: 4px 6px;
          background: var(--paper);
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition:
            border-color 140ms ease,
            background 140ms ease,
            transform 140ms ease;
        }
        .poster .t:hover {
          border-color: var(--ink);
          background: var(--paper-alt);
          transform: translateY(-1px);
        }
        .poster .t img {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          object-fit: contain;
          flex-shrink: 0;
          background: var(--surface-logo);
          transition: transform 140ms ease;
        }
        .poster .t:hover img { transform: scale(1.08); }
        .poster .t-fb {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: var(--paper);
          text-transform: uppercase;
        }
        .poster .t span {
          font-family: var(--body);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Tablet — 2-column grid, keep the right-block 2-up layout */
        @media (max-width: 1180px) and (min-width: 901px) {
          .poster :global(.grid-block) {
            flex-wrap: wrap;
          }
          .poster :global(.grid-block) > :global(.col) {
            flex: 1 1 calc(50% - 5px);
            min-width: 0;
          }
          .poster :global(.right-block) {
            flex: 1 1 100%;
          }
        }
        @media (max-width: 900px) {
          .poster .landscape-desktop { display: none !important; }
          .poster .landscape-mobile  { display: flex !important; }
          .poster .tools {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 5px 6px;
          }
          /* WCAG 2.5.5 Target Size — 44px minimum on touch devices */
          .poster .t {
            padding: 10px 10px;
            min-height: 44px;
            min-width: 44px;
          }
          .poster .t img,
          .poster .t-fb {
            width: 22px;
            height: 22px;
          }
          .poster .t span {
            font-size: 0.85rem;
          }
        }
        @media (max-width: 480px) {
          .poster .tools { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .poster .card,
          .poster .t,
          .poster .t img { transition: none !important; }
          .poster .card { opacity: 1 !important; transform: none !important; }
        }

        /* Mobile: skip scroll-in stagger. Cards below the fold never
           trigger IntersectionObserver until the user scrolls, which
           reads as 'empty section' on first paint. */
        @media (max-width: 900px) {
          .poster .card { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  )
}
