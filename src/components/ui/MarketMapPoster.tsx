'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Category, Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
  categories: Category[]
}

/** 5-column desktop layout grouped by category slug, matching the printed poster. */
const COLS: string[][] = [
  ['crm', 'admin-ops', 'captable', 'voice-to-text', 'mailing'],
  ['data', 'finance', 'productivity', 'calendar'],
  ['research', 'communication', 'vibe-coding', 'automation'],
  ['news', 'ai', 'browser'],
  ['other-tools', 'portfolio-management', 'transcription'],
]

/** Mobile: flat vertical order following a VC workflow. */
const MOBILE_ORDER = [
  'crm', 'data', 'research', 'news', 'ai',
  'portfolio-management', 'captable', 'finance',
  'admin-ops', 'automation',
  'communication', 'mailing', 'calendar',
  'transcription', 'voice-to-text',
  'productivity', 'vibe-coding', 'browser',
  'other-tools',
]

const GRAD_PAIRS = [
  ['#c0392b', '#962d22'], ['#4a4035', '#1a1410'], ['#635a4a', '#4a4035'],
  ['#8b6f47', '#5a4731'], ['#2d6a4f', '#40916c'], ['#6930c3', '#5390d9'],
  ['#e85d04', '#dc2f02'], ['#7b2cbf', '#c77dff'], ['#3a0ca3', '#4895ef'],
  ['#495057', '#810100'],
]

function gradient(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  const [a, b] = GRAD_PAIRS[Math.abs(h) % GRAD_PAIRS.length]
  return `linear-gradient(135deg,${a},${b})`
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
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget
            const fb = document.createElement('div')
            fb.className = 't-fb'
            fb.textContent = initials(t.name)
            fb.style.background = gradient(t.name)
            img.replaceWith(fb)
          }}
        />
      ) : (
        <div className="t-fb" style={{ background: gradient(t.name) }}>{initials(t.name)}</div>
      )}
      <span>{t.name}</span>
    </Link>
  )
}

function CategoryCard({
  catName,
  tools,
  index,
}: {
  catName: string
  tools: Tool[]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setVisible(true); io.disconnect(); break }
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
      className={`card ${visible ? 'is-in' : ''}`}
      style={{ transitionDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="card-head"><span className="name">{catName}</span></div>
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

        {/* ── Columns ── */}
        <div className="landscape landscape-desktop">
          {COLS.map((catList, idx) => (
            <div key={idx} className="col">
              {catList.map((slug, i) => {
                const list = bySlug[slug] || []
                if (!list.length) return null
                return (
                  <CategoryCard
                    key={slug}
                    catName={slugToName[slug] || slug}
                    tools={list}
                    index={idx * 5 + i}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="landscape landscape-mobile">
          {MOBILE_ORDER.map((slug, i) => {
            const list = bySlug[slug] || []
            if (!list.length) return null
            return (
              <CategoryCard
                key={slug}
                catName={slugToName[slug] || slug}
                tools={list}
                index={i}
              />
            )
          })}
        </div>

        <div className="disclaimer">
          Informational purposes only · Publicly available data + editorial curation · Not exhaustive · Trademarks belong to their respective owners
        </div>
      </div>

      <style jsx>{`
        .poster {
          /* Flat red-tint background — no gradient.
             Pre-mix of hub brand red (#D21905) at ~12% over cream.
             Subtle enough to read as paper, saturated enough to read as red. */
          background: #F1D8CC;
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
          padding: 0 0 12px;
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }

        .landscape {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 0;
        }
        .landscape-desktop { display: flex; }
        .landscape-mobile  { display: none; flex-direction: column; gap: 12px; }
        .col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
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
            opacity 520ms cubic-bezier(0.22, 0.61, 0.36, 1),
            transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        :global(.poster .card.is-in) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.poster .card-head) {
          background: var(--ink);
          padding: 6px 10px;
        }
        :global(.poster .card-head .name) {
          font-family: var(--mono);
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--paper);
        }
        :global(.poster .tools) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px 6px;
          padding: 8px 8px 10px;
          background: var(--paper-alt);
        }

        .disclaimer {
          font-family: var(--body);
          font-style: italic;
          font-size: 0.72rem;
          color: var(--ink-muted);
          text-align: center;
          padding: 18px 24px 4px;
          line-height: 1.5;
        }
      `}</style>

      <style jsx global>{`
        .poster .t {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--rule);
          border-radius: 3px;
          padding: 4px 6px;
          background: var(--paper);
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }
        .poster .t:hover {
          border-color: var(--ink);
          background: var(--paper-alt);
          transform: translateY(-1px);
        }
        .poster .t img {
          width: 18px;
          height: 18px;
          border-radius: 2px;
          object-fit: contain;
          flex-shrink: 0;
          background: #fff;
          transition: transform 180ms ease;
        }
        .poster .t:hover img { transform: scale(1.08); }
        .poster .t-fb {
          width: 18px;
          height: 18px;
          border-radius: 2px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: #fff;
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

        @media (max-width: 900px) {
          .poster .landscape-desktop { display: none !important; }
          .poster .landscape-mobile  { display: flex !important; }
          .poster .tools {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 6px 8px;
          }
          /* Bigger touch targets on mobile — WCAG recommends 44px min */
          .poster .t {
            padding: 8px 8px;
            min-height: 40px;
          }
          .poster .t img,
          .poster .t-fb {
            width: 20px;
            height: 20px;
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
