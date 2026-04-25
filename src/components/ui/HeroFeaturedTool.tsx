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

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

export default function HeroFeaturedTool({ tools }: Props) {
  const rotation = tools.slice(0, 8)
  const [i, setI] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const hoverPausedRef = useRef(false)
  const router = useRouter()

  /* Respect the OS-level reduced-motion preference. */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const isPlaying = rotation.length > 1 && !userPaused && !reducedMotion

  useEffect(() => {
    if (!isPlaying) return
    const id = window.setInterval(() => {
      if (!hoverPausedRef.current) setI((n) => (n + 1) % rotation.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [isPlaying, rotation.length])

  if (!rotation.length) return null

  const t = rotation[i]
  const icon = t.logoUrl || faviconFor(t.websiteUrl)
  // Prefer the long `description` so the hero card fills its 3-line
  // description area consistently. `shortDesc` is reserved for compact
  // surfaces such as category previews.
  const subDesc = t.description?.trim() || t.shortDesc?.trim() || ''

  const goProduct = () => router.push(`/product/${t.slug}`)
  const goPrev = () => setI((n) => (n - 1 + rotation.length) % rotation.length)
  const goNext = () => setI((n) => (n + 1) % rotation.length)

  // Stops card-level navigation on any interactive control inside the card
  const stop = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="hft-card"
      role="link"
      tabIndex={0}
      aria-label={t.name}
      onClick={goProduct}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target as HTMLElement
          if (target.closest('button')) return
          e.preventDefault()
          goProduct()
        }
      }}
      onMouseEnter={() => { hoverPausedRef.current = true }}
      onMouseLeave={() => { hoverPausedRef.current = false }}
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
              <img
                src={icon}
                alt=""
                width={40}
                height={40}
                className="hft-icon"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="hft-icon hft-icon-fb">{initials(t.name)}</div>
            )}
          </div>
          <div className="hft-title-wrap">
            <h2 className="hft-name">{t.name}</h2>
            {t.category && <span className="hft-cat-pill">{t.category.name}</span>}
          </div>
        </div>

        {/* 2b — description only (no meta bullets) */}
        <div className="hft-row hft-row-text">
          <p className="hft-desc">{subDesc}</p>
          <div className="hft-cta-row">
            <span className="hft-cta">
              Read more
              <span className="hft-arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 3 · Card footer (prev/next + slider, fixed) ── */}
      {rotation.length > 1 && (
        <div className="hft-footer">
          <button
            type="button"
            className="hft-nav-btn"
            aria-label={isPlaying ? 'Pause featured tools rotation' : 'Play featured tools rotation'}
            aria-pressed={!isPlaying}
            onClick={(e) => { stop(e); setUserPaused((p) => !p) }}
            onKeyDown={stop}
            disabled={reducedMotion}
            title={reducedMotion ? 'Rotation disabled by system preference' : undefined}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="3" y="2.5" width="2.5" height="9" fill="currentColor" />
                <rect x="8.5" y="2.5" width="2.5" height="9" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2.5 L4 11.5 L11 7 Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="hft-nav-btn"
            aria-label="Previous featured tool"
            onClick={(e) => { stop(e); goPrev() }}
            onKeyDown={stop}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="hft-dots" role="tablist" aria-label="Featured tool">
            {rotation.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Show featured tool ${idx + 1}`}
                className={`hft-dot-btn ${idx === i ? 'is-on' : ''}`}
                onClick={(e) => { stop(e); setI(idx) }}
                onKeyDown={stop}
              >
                <span className="hft-dot-bar" />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hft-nav-btn"
            aria-label="Next featured tool"
            onClick={(e) => { stop(e); goNext() }}
            onKeyDown={stop}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5 2 L10 7 L5 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
          height: 320px;
        }
        @media (max-width: 859px) {
          .hft-card { height: auto; min-height: 300px; }
        }
        .hft-card:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 3px;
        }

        /* ROW 1 — header */
        .hft-header {
          display: flex;
          align-items: center;
          padding: 9px 18px;
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
          animation: hftFade 360ms var(--ease-out);
          flex: 1;
        }
        @keyframes hftFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hft-row {
          padding: 12px 18px;
          border-bottom: 1px solid var(--rule);
        }
        .hft-row:last-child { border-bottom: 0; }

        /* 2a — icon + big name + category pill on right */
        .hft-row-head {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
          flex: 0 0 auto;
        }
        .hft-icon-wrap {
          width: 56px;
          height: 56px;
          border: 1px solid var(--rule);
          background: var(--surface-logo);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hft-icon { width: 40px; height: 40px; object-fit: contain; }
        .hft-icon-fb {
          width: 100%;
          height: 100%;
          background: var(--ink);
          color: var(--paper);
          font-family: var(--mono);
          font-weight: 700;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hft-title-wrap {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .hft-name {
          font-family: var(--serif);
          font-weight: 900;
          font-size: clamp(1.4rem, 2vw, 1.75rem);
          color: var(--ink);
          line-height: 1.1;
          letter-spacing: -0.01em;
          /* Lock height to one line so short/long names don't shift layout */
          height: 1.1em;
          margin: 0;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hft-cat-pill {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--paper-alt);
          border: 1px solid var(--rule);
          padding: 5px 10px;
          line-height: 1.3;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* 2b — description + inline CTA */
        .hft-row-text {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 12px;
          padding-bottom: 12px;
        }
        .hft-desc {
          font-family: var(--body);
          font-size: 1rem;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          /* Lock to exactly 3 lines so short/long descriptions don't
             shift the CTA position between tools */
          height: calc(1.5em * 3);
        }

        /* Inline CTA (text-style, right-aligned) */
        .hft-cta-row {
          display: flex;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 12px;
        }
        .hft-cta {
          font-family: var(--mono);
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: var(--ink);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 3px;
          transition: color 180ms ease, border-color 180ms ease;
        }
        .hft-card:hover .hft-cta {
          color: var(--red);
          border-color: var(--red);
        }
        .hft-card:hover .hft-arrow { transform: translateX(3px); }
        .hft-arrow { font-size: 0.95rem; transition: transform 200ms ease; }

        /* ROW 3 — slider footer (fixed) */
        .hft-footer {
          padding: 10px 14px;
          background: var(--paper-alt);
          border-top: 1px solid var(--ink);
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 0 0 auto;
        }
        .hft-nav-btn {
          all: unset;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border: 1px solid var(--rule);
          background: var(--paper);
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
          flex-shrink: 0;
        }
        .hft-nav-btn:hover {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }
        .hft-nav-btn:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .hft-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .hft-nav-btn:disabled:hover {
          background: var(--paper);
          color: var(--ink);
          border-color: var(--rule);
        }
        .hft-dots {
          display: flex;
          gap: 4px;
          flex: 1;
          justify-content: center;
          flex-wrap: wrap;
        }
        /* Dot BUTTON has a padded hit area; dot BAR is visual only */
        .hft-dot-btn {
          all: unset;
          cursor: pointer;
          padding: 10px 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .hft-dot-btn:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .hft-dot-bar {
          display: block;
          width: 28px;
          height: 4px;
          background: var(--rule);
          transition: background 220ms ease, width 220ms ease;
        }
        .hft-dot-btn:hover .hft-dot-bar { background: var(--ink-muted); }
        .hft-dot-btn.is-on .hft-dot-bar {
          background: var(--red);
          width: 44px;
        }

        /* No underlines anywhere inside the card */
        .hft-card, .hft-card * { text-decoration: none; }

        @media (prefers-reduced-motion: reduce) {
          .hft-body { animation: none; }
        }

        @media (max-width: 480px) {
          .hft-row-head { gap: 12px; }
          .hft-icon-wrap { width: 44px; height: 44px; }
          .hft-icon { width: 30px; height: 30px; }
          .hft-title-wrap {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            justify-content: flex-start;
          }
          .hft-name {
            font-size: 1.25rem;
            white-space: normal;
            height: auto;
            overflow: visible;
            text-overflow: clip;
          }
          .hft-cta { letter-spacing: 0.18em; }
          .hft-footer { padding: 8px 10px; gap: 8px; }
          .hft-dot-bar { width: 18px; }
          .hft-dot-btn.is-on .hft-dot-bar { width: 28px; }
        }
      `}</style>
    </div>
  )
}
