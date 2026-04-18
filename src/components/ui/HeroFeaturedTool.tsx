'use client'

/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
}

const AUTOPLAY_MS = 6000

function faviconFor(url: string) {
  try {
    const d = new URL(url).hostname.replace(/^www\./, '')
    return `https://www.google.com/s2/favicons?domain=${d}&sz=128`
  } catch {
    return ''
  }
}

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

function splitParts(t: Tool): { subDesc: string; uses: string[] } {
  const text = (t.description || '').trim()
  const sents = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const subDesc = t.shortDesc?.trim() || sents[0] || text.slice(0, 160)
  const start = t.shortDesc ? 0 : 1
  const real = sents
    .slice(start)
    .filter((s) => s.length >= 12 && s.length <= 140)
    .slice(0, 2)

  const uses = [...real]
  if (uses.length < 2 && t.category?.name) {
    uses.push(`Category · ${t.category.name}`)
  }
  if (uses.length < 2 && t.pricingModel) {
    uses.push(`Pricing · ${t.pricingModel.toLowerCase()}`)
  }
  if (uses.length < 2 && t.websiteUrl) {
    const d = domainOf(t.websiteUrl)
    if (d) uses.push(`Website · ${d}`)
  }

  return { subDesc, uses: uses.slice(0, 2) }
}

export default function HeroFeaturedTool({ tools }: Props) {
  const rotation = tools.slice(0, 8)
  const [i, setI] = useState(0)
  const pausedRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (rotation.length < 2) return
    const id = window.setInterval(() => {
      if (!pausedRef.current) setI((n) => (n + 1) % rotation.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [rotation.length])

  if (!rotation.length) return null

  const t = rotation[i]
  const icon = t.logoUrl || faviconFor(t.websiteUrl)
  const { subDesc, uses } = splitParts(t)

  const goProduct = () => router.push(`/product/${t.slug}`)

  return (
    <div
      className="hft-card"
      role="link"
      tabIndex={0}
      aria-label={`Open ${t.name}`}
      onClick={goProduct}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goProduct()
        }
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* ── Row 1 · Card header (fixed) ── */}
      <div className="hft-header">
        <span className="hft-header-label">Featured Tool</span>
      </div>

      {/* ── Row 2 · Card body (changes per tool) ── */}
      <div className="hft-body" key={t.id}>
        {/* 2a — logo + name + category pill */}
        <div className="hft-row hft-row-head">
          <div className="hft-icon-wrap">
            {icon ? (
              <img src={icon} alt="" className="hft-icon" loading="lazy" />
            ) : (
              <div className="hft-icon hft-icon-fb">{initials(t.name)}</div>
            )}
          </div>
          <h3 className="hft-name">{t.name}</h3>
          {t.category && <span className="hft-cat-pill">{t.category.name}</span>}
        </div>

        {/* 2b — sub-description + use cases + inline CTA */}
        <div className="hft-row hft-row-text">
          <p className="hft-desc">{subDesc}</p>
          {uses.length > 0 && (
            <ul className="hft-uses">
              {uses.map((u, idx) => (
                <li key={idx}>{u}</li>
              ))}
            </ul>
          )}
          <div className="hft-cta-row">
            <span className="hft-cta">
              Read more
              <span className="hft-arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 3 · Card footer (slider, fixed) ── */}
      {rotation.length > 1 && (
        <div className="hft-footer">
          <div className="hft-dots" role="tablist" aria-label="Featured tool">
            {rotation.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Show featured tool ${idx + 1}`}
                className={`hft-dot ${idx === i ? 'is-on' : ''}`}
                onClick={(e) => { e.stopPropagation(); setI(idx) }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .hft-card {
          display: flex;
          flex-direction: column;
          background: var(--paper);
          border: 1px solid var(--ink);
          cursor: pointer;
          overflow: hidden;
          min-width: 0;
          color: var(--ink);
          text-decoration: none;
          height: 340px;
        }
        @media (max-width: 859px) {
          .hft-card { height: auto; min-height: 320px; }
        }
        .hft-card:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 3px;
        }

        /* ROW 1 — header */
        .hft-header {
          display: flex;
          align-items: center;
          padding: 10px 18px;
          background: var(--ink);
          color: var(--paper);
          border-bottom: 1px solid var(--ink);
          flex: 0 0 auto;
        }
        .hft-header-label {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* ROW 2 — body */
        .hft-body {
          display: flex;
          flex-direction: column;
          animation: hftFade 360ms cubic-bezier(0.22, 0.61, 0.36, 1);
          flex: 1;
        }
        @keyframes hftFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hft-row {
          padding: 10px 16px;
          border-bottom: 1px solid var(--rule);
        }
        .hft-row:last-child { border-bottom: 0; }

        /* 2a — icon + big name + category pill on right */
        .hft-row-head {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          flex: 0 0 auto;
        }
        .hft-icon-wrap {
          width: 48px;
          height: 48px;
          border: 1px solid var(--rule);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hft-icon { width: 32px; height: 32px; object-fit: contain; }
        .hft-icon-fb {
          width: 100%;
          height: 100%;
          background: var(--ink);
          color: var(--paper);
          font-family: var(--mono);
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hft-name {
          font-family: var(--serif);
          font-weight: 900;
          font-size: clamp(1.5rem, 2vw, 1.75rem);
          color: var(--ink);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hft-cat-pill {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--paper-alt);
          border: 1px solid var(--rule);
          padding: 5px 10px;
          line-height: 1.3;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* 2b — combined description + use cases + inline CTA */
        .hft-row-text {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .hft-desc {
          font-family: var(--body);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hft-uses {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .hft-uses li {
          font-family: var(--body);
          font-size: 0.8rem;
          color: var(--ink-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Inline CTA (text-style, right-aligned) */
        .hft-cta-row {
          display: flex;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 8px;
        }
        .hft-cta {
          font-family: var(--mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--ink);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
          transition: color 180ms ease, border-color 180ms ease;
        }
        .hft-card:hover .hft-cta {
          color: var(--red);
          border-color: var(--red);
        }
        .hft-card:hover .hft-arrow { transform: translateX(3px); }
        .hft-arrow { font-size: 0.85rem; transition: transform 200ms ease; }

        /* ROW 3 — slider footer (fixed) */
        .hft-footer {
          padding: 10px 18px;
          background: var(--paper-alt);
          border-top: 1px solid var(--ink);
          display: flex;
          justify-content: center;
          flex: 0 0 auto;
        }
        .hft-dots {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .hft-dot {
          width: 22px;
          height: 3px;
          background: var(--rule);
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: background 220ms ease, width 220ms ease;
        }
        .hft-dot:hover { background: var(--ink-muted); }
        .hft-dot.is-on {
          background: var(--red);
          width: 36px;
        }

        /* No underlines anywhere inside the card */
        .hft-card, .hft-card * { text-decoration: none; }

        @media (prefers-reduced-motion: reduce) {
          .hft-body { animation: none; }
        }
      `}</style>
    </div>
  )
}
