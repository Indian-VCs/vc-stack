'use client'

import Link from 'next/link'
import { COMMANDK_OPEN_EVENT } from '@/components/ui/CommandK'

interface Props {
  totalTools: number
}

export default function HeroSearchCTA({ totalTools }: Props) {
  const open = () => {
    window.dispatchEvent(new Event(COMMANDK_OPEN_EVENT))
  }

  return (
    <div className="hero-cta">
      <button
        type="button"
        onClick={open}
        className="hero-cta-search"
        aria-label={`Search ${totalTools} tools`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
        <span className="hero-cta-placeholder">Search {totalTools} tools…</span>
        <kbd className="hero-cta-kbd">⌘K</kbd>
      </button>

      <Link href="/all-categories" className="hero-cta-secondary">
        Browse all categories →
      </Link>

      <style jsx>{`
        .hero-cta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .hero-cta-search {
          all: unset;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex: 1 1 320px;
          min-width: 240px;
          max-width: 440px;
          height: 48px;
          padding: 0 14px;
          background: var(--paper);
          border: 1px solid var(--ink);
          cursor: pointer;
          transition: background var(--dur-fast), color var(--dur-fast);
          color: var(--ink-muted);
        }
        .hero-cta-search:hover {
          background: var(--ink);
          color: var(--paper);
        }
        .hero-cta-search:hover .hero-cta-kbd {
          border-color: var(--paper);
          color: var(--paper);
        }
        .hero-cta-search:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .hero-cta-placeholder {
          flex: 1;
          font-family: var(--body);
          font-size: 1rem;
          text-align: left;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hero-cta-kbd {
          font-family: var(--mono);
          font-size: 0.7rem;
          padding: 3px 6px;
          border: 1px solid var(--rule);
          color: var(--ink-muted);
          line-height: 1;
          flex-shrink: 0;
          transition: border-color var(--dur-fast), color var(--dur-fast);
        }
        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 0 4px;
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--ink-muted);
          text-decoration: none;
          transition: color var(--dur-fast);
        }
        .hero-cta-secondary:hover { color: var(--red); }
        .hero-cta-secondary:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
