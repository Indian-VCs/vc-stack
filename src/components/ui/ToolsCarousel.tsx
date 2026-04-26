'use client'

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { useRef } from 'react'
import type { Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
  title?: string
}

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
  return w.length === 1 ? w[0].substring(0, 2).toUpperCase() : (w[0][0] + w[1][0]).toUpperCase()
}

export default function ToolsCarousel({ tools, title = 'Recommended Tools' }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  if (!tools.length) return null

  return (
    <section className="tc">
      <header className="tc-head">
        <h2 className="tc-title">{title}</h2>
        <div className="tc-nav" aria-label="Carousel navigation">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5 2 L10 7 L5 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="tc-scroller" ref={scrollerRef}>
        {tools.map((t) => {
          const icon = t.logoUrl || faviconFor(t.websiteUrl)
          return (
            <Link key={t.id} href={`/product/${t.slug}`} className="tc-card">
              <div className="tc-card-head">
                <div className="tc-icon-wrap">
                  {icon ? (
                    <img src={icon} alt="" className="tc-icon" loading="lazy" />
                  ) : (
                    <div className="tc-icon tc-icon-fb">{initials(t.name)}</div>
                  )}
                </div>
                {t.category && <span className="tc-cat">{t.category.name}</span>}
              </div>
              <h3 className="tc-name">{t.name}</h3>
              <p className="tc-desc">
                {t.shortDesc ?? t.description.slice(0, 140)}
              </p>
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        .tc { display: flex; flex-direction: column; gap: 14px; }
        .tc-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          border-top: 2px solid var(--ink);
          padding-top: 18px;
        }
        .tc-title {
          font-family: var(--serif);
          font-weight: 900;
          font-size: var(--fs-hero);
          color: var(--ink);
          letter-spacing: 0.01em;
          text-transform: uppercase;
          text-wrap: balance;
          margin: 0;
        }
        .tc-nav { display: flex; gap: 6px; }
        .tc-nav button {
          all: unset;
          cursor: pointer;
          position: relative;
          width: 34px;
          height: 34px;
          border: 1px solid var(--ink);
          background: var(--paper);
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 180ms ease, color 180ms ease, transform 180ms ease;
        }
        /* Extend hit area to 40×40 without changing visible size */
        .tc-nav button::after {
          content: '';
          position: absolute;
          inset: -3px;
        }
        .tc-nav button:hover { background: var(--ink); color: var(--paper); }
        .tc-nav button:active { transform: scale(0.96); }

        .tc-scroller {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(240px, 1fr);
          gap: 14px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          padding: 2px 2px 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--rule) transparent;
        }
        @media (min-width: 720px) {
          .tc-scroller { grid-auto-columns: calc((100% - 14px * 4) / 5); }
        }
        .tc-scroller::-webkit-scrollbar { height: 6px; }
        .tc-scroller::-webkit-scrollbar-thumb {
          background: var(--rule);
          border-radius: 3px;
        }

        .tc-card {
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          background: var(--paper);
          border: 1px solid var(--ink);
          color: inherit;
          text-decoration: none;
          transition: background 180ms ease, transform 180ms ease;
          min-width: 0;
        }
        .tc-card:hover { background: var(--paper-alt); }
        .tc-card:active { transform: scale(0.96); }

        .tc-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--rule);
        }
        .tc-icon-wrap {
          width: 36px;
          height: 36px;
          border: 1px solid var(--rule);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tc-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
          outline: 1px solid rgba(0, 0, 0, 0.1);
          outline-offset: -1px;
        }
        .tc-icon-fb {
          width: 100%;
          height: 100%;
          background: var(--ink);
          color: var(--paper);
          font-family: var(--mono);
          font-weight: 700;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tc-cat {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }

        .tc-name {
          font-family: var(--serif);
          font-weight: 900;
          font-size: 1.1rem;
          color: var(--ink);
          line-height: 1.2;
          letter-spacing: -0.005em;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-wrap: balance;
        }
        .tc-desc {
          font-family: var(--body);
          font-size: 0.86rem;
          color: var(--ink-light);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-wrap: pretty;
        }
      `}</style>
    </section>
  )
}
