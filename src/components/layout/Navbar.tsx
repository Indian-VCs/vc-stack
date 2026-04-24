'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TOTAL_TOOL_APPEARANCES, TOTAL_CATEGORIES } from '@/lib/stats'
import { COMMANDK_OPEN_EVENT } from '@/components/ui/CommandK'
import IndianVCsLogo from '@/components/ui/IndianVCsLogo'

type Cat = { name: string; slug: string }

const CATEGORIES_PRIMARY: Cat[] = [
  { name: 'CRM',                 slug: 'crm' },
  { name: 'Data',                slug: 'data' },
  { name: 'Research',            slug: 'research' },
  { name: 'News',                slug: 'news' },
  { name: 'AI',                  slug: 'ai' },
  { name: 'Portfolio Mgmt',      slug: 'portfolio-management' },
  { name: 'Admin & Ops',         slug: 'admin-ops' },
  { name: 'Automation',          slug: 'automation' },
]

const CATEGORIES_SECONDARY: Cat[] = [
  { name: 'Communication',       slug: 'communication' },
  { name: 'Mailing',             slug: 'mailing' },
  { name: 'Calendar',            slug: 'calendar' },
  { name: 'Transcription',       slug: 'transcription' },
  { name: 'Voice to Text',       slug: 'voice-to-text' },
  { name: 'Productivity',        slug: 'productivity' },
  { name: 'Vibe Coding',         slug: 'vibe-coding' },
  { name: 'Browser',             slug: 'browser' },
  { name: 'Other Tools',         slug: 'other-tools' },
]

const BLOG_EXTERNAL = 'https://hub.indianvcs.com/'
const NEWSLETTER_EXTERNAL = 'https://hub.indianvcs.com/newsletter'

export default function Navbar() {
  const pathname = usePathname() || '/'
  const [showCategories, setShowCategories] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  const isCategoryRoute = pathname.startsWith('/category') || pathname.startsWith('/all-categories')

  const openCommandK = () => {
    window.dispatchEvent(new Event(COMMANDK_OPEN_EVENT))
    setShowMobile(false)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategories(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowCategories(false)
        setShowMobile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  useEffect(() => {
    setShowCategories(false)
    setShowMobile(false)
  }, [pathname])

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (showMobile) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [showMobile])

  return (
    <header style={{ background: 'var(--paper)', borderBottom: '1px solid var(--ink)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* ── Nav rail ───────────────────────────────────────────────── */}
      <nav
        className="page nav-rail"
        style={{
          padding: '0 24px',
          position: 'relative',
        }}
      >
        <div
          className="nav-bar"
          style={{ height: 56, gap: 0, justifyContent: 'space-between' }}
        >
          {/* ── Brand: official Indian VCs logo, always visible, links to parent site ── */}
          <a
            href="https://indianvcs.com"
            aria-label="Indian VCs — back to indianvcs.com"
            className="nav-brand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <IndianVCsLogo height={22} />
          </a>

          {/* ── Desktop: primary nav ──────────────────────────────── */}
          <div className="nav-desktop" style={{ gap: 0 }}>
            <NavLink href="/" label="Home" active={pathname === '/'} />

            {/* Categories megamenu trigger */}
            <div ref={catRef} className="relative" style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                className={`nav-link ${isCategoryRoute ? 'is-active' : ''} ${showCategories ? 'is-open' : ''}`}
                onClick={() => setShowCategories(v => !v)}
                aria-expanded={showCategories}
                aria-haspopup="true"
              >
                <span>Categories</span>
                <svg
                  width="8" height="8" viewBox="0 0 8 8"
                  style={{
                    marginLeft: 6,
                    transition: 'transform var(--dur-fast)',
                    transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden="true"
                >
                  <path d="M1 2 L4 6 L7 2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
              </button>

              {showCategories && (
                <div className="megamenu" role="menu">
                  <div className="megamenu-grid">
                    <div>
                      <div className="megamenu-header">Core Stack</div>
                      <ul className="megamenu-list">
                        {CATEGORIES_PRIMARY.map(({ name, slug }) => (
                          <li key={slug}>
                            <Link
                              href={`/category/${slug}`}
                              className="megamenu-item"
                            >
                              <span className="megamenu-bullet">·</span>
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="megamenu-header">Workflow & More</div>
                      <ul className="megamenu-list">
                        {CATEGORIES_SECONDARY.map(({ name, slug }) => (
                          <li key={slug}>
                            <Link
                              href={`/category/${slug}`}
                              className="megamenu-item"
                            >
                              <span className="megamenu-bullet">·</span>
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <aside className="megamenu-aside">
                      <div className="megamenu-header" style={{ color: 'var(--red)' }}>Browse</div>
                      <p className="megamenu-blurb">
                        {TOTAL_CATEGORIES} categories · {TOTAL_TOOL_APPEARANCES} tools curated from the Indian VC stack.
                      </p>
                      <Link href="/all-categories" className="megamenu-cta">
                        View all categories →
                      </Link>
                      <Link href="/market-map" className="megamenu-cta megamenu-cta--ghost">
                        Open market map →
                      </Link>
                    </aside>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/market-map" label="Market Map" active={pathname.startsWith('/market-map')} />
            <NavLink href={BLOG_EXTERNAL} label="VC Hub" external active={false} />
            <NavLink href={NEWSLETTER_EXTERNAL} label="Newsletter" external active={false} />
          </div>

          {/* ── Desktop: search ──────────────────────────────────── */}
          <div className="nav-desktop-search" style={{ gap: 16, marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={openCommandK}
              className="nav-search"
              aria-label="Open search (Cmd+K)"
            >
              <svg
                className="nav-search-icon"
                width="14" height="14" viewBox="0 0 14 14"
                aria-hidden="true"
              >
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M9.5 9.5 L13 13" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </svg>
              <span className="nav-search-placeholder">Search tools, categories…</span>
              <kbd className="nav-search-kbd">⌘K</kbd>
            </button>
          </div>

          {/* ── Mobile: compact search + hamburger ─────────────────── */}
          <div className="nav-mobile-controls">
            <button
              type="button"
              onClick={openCommandK}
              className="nav-icon-btn"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
                <path d="M12 12 L16 16" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowMobile(v => !v)}
              className="nav-icon-btn"
              aria-label={showMobile ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobile}
              aria-controls="nav-mobile-sheet"
            >
              {showMobile ? (
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M3 5 H15 M3 9 H15 M3 13 H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile sheet ─────────────────────────────────────────── */}
        {showMobile && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="nav-mobile-scrim"
              onClick={() => setShowMobile(false)}
            />
            <div
              id="nav-mobile-sheet"
              className="nav-mobile-sheet"
              role="dialog"
              aria-label="Site menu"
            >
              <button
                type="button"
                onClick={openCommandK}
                className="nav-mobile-search"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <path d="M9.5 9.5 L13 13" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>
                <span>Search tools, categories…</span>
              </button>

              <div className="nav-mobile-section">
                <div className="nav-mobile-header">Navigate</div>
                <Link href="/" className={`nav-mobile-link ${pathname === '/' ? 'is-active' : ''}`}>Home</Link>
                <Link href="/all-categories" className={`nav-mobile-link ${pathname.startsWith('/all-categories') ? 'is-active' : ''}`}>All Categories</Link>
                <Link href="/market-map" className={`nav-mobile-link ${pathname.startsWith('/market-map') ? 'is-active' : ''}`}>Market Map</Link>
                <a href={BLOG_EXTERNAL} target="_blank" rel="noopener noreferrer" className="nav-mobile-link">
                  VC Hub <span className="ext-arrow" aria-hidden="true">↗</span>
                </a>
                <a href={NEWSLETTER_EXTERNAL} target="_blank" rel="noopener noreferrer" className="nav-mobile-link">
                  Newsletter <span className="ext-arrow" aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="nav-mobile-section">
                <div className="nav-mobile-header">Core Stack</div>
                <div className="nav-mobile-cats">
                  {CATEGORIES_PRIMARY.map(({ name, slug }) => (
                    <Link key={slug} href={`/category/${slug}`} className="nav-mobile-cat">{name}</Link>
                  ))}
                </div>
              </div>

              <div className="nav-mobile-section">
                <div className="nav-mobile-header">Workflow & More</div>
                <div className="nav-mobile-cats">
                  {CATEGORIES_SECONDARY.map(({ name, slug }) => (
                    <Link key={slug} href={`/category/${slug}`} className="nav-mobile-cat">{name}</Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <style jsx global>{`
        .nav-bar {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .nav-brand {
          margin-right: 20px;
          flex-shrink: 0;
        }
        /* Desktop vs. mobile visibility */
        .nav-desktop, .nav-desktop-search { display: none; }
        .nav-mobile-controls {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }
        @media (min-width: 900px) {
          .nav-desktop { display: inline-flex; align-items: center; }
          .nav-desktop-search { display: inline-flex; align-items: center; }
          .nav-mobile-controls { display: none; }
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 48px;
          padding: 0 14px;
          font-family: var(--mono);
          font-size: var(--fs-btn);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink);
          text-decoration: none;
          background: transparent;
          border: 0;
          cursor: pointer;
          transition: color var(--dur-fast);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 8px;
          height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform var(--dur-fast) ease-out;
        }
        .nav-link:hover { color: var(--red); }
        .nav-link:hover::after,
        .nav-link.is-active::after,
        .nav-link.is-open::after { transform: scaleX(1); }
        .nav-link.is-active { color: var(--ink); }
        .nav-link.is-open { color: var(--red); }

        .nav-link .ext-arrow {
          margin-left: 4px;
          font-size: 0.85em;
          color: var(--ink-muted);
        }

        /* Megamenu */
        .megamenu {
          position: absolute;
          top: 48px;
          left: 0;
          right: auto;
          width: min(720px, calc(100vw - 48px));
          background: var(--paper);
          border: 1px solid var(--ink);
          border-top: 2px solid var(--red);
          padding: 20px 22px;
          z-index: 50;
          box-shadow: var(--shadow-soft);
        }
        .megamenu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.1fr;
          gap: 24px;
        }
        .megamenu-header {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-muted);
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--rule);
        }
        .megamenu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 2px;
        }
        .megamenu-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 5px 0;
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink);
          text-decoration: none;
          transition: color var(--dur-fast), transform var(--dur-fast);
        }
        .megamenu-bullet {
          color: var(--red);
          font-weight: 700;
        }
        .megamenu-item:hover {
          color: var(--red);
          transform: translateX(3px);
        }
        .megamenu-aside {
          padding-left: 22px;
          border-left: 1px solid var(--rule);
        }
        .megamenu-blurb {
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink-muted);
          line-height: 1.45;
          margin: 0 0 12px;
        }
        .megamenu-cta {
          display: block;
          font-family: var(--mono);
          font-size: var(--fs-btn);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--red);
          text-decoration: none;
          padding: 8px 0;
          border-top: 1px solid var(--rule);
        }
        .megamenu-cta--ghost { color: var(--ink-muted); }
        .megamenu-cta:hover { color: var(--ink); }

        /* Search (button that opens CommandK) */
        .nav-search {
          all: unset;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          padding: 0 10px;
          background: var(--paper-alt, #ede7db);
          border: 1px solid var(--rule);
          transition: border-color var(--dur-fast), background var(--dur-fast);
          cursor: pointer;
        }
        .nav-search:hover {
          border-color: var(--ink);
          background: var(--paper);
        }
        .nav-search:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .nav-search-icon {
          color: var(--ink-muted);
          flex-shrink: 0;
        }
        .nav-search-placeholder {
          font-family: var(--body);
          font-size: var(--fs-body);
          color: var(--ink-muted);
          width: 220px;
          line-height: 32px;
          text-align: left;
        }
        .nav-search-kbd {
          font-family: var(--mono);
          font-size: 0.65rem;
          color: var(--ink-muted);
          padding: 1px 5px;
          border: 1px solid var(--rule);
          background: var(--paper);
          line-height: 1;
        }

        /* Newsletter CTA */
        .nav-cta {
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 14px;
          font-family: var(--mono);
          font-size: var(--fs-btn);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--paper);
          background: var(--red);
          text-decoration: none;
          border: 1px solid var(--red);
          transition: background var(--dur-fast), color var(--dur-fast);
        }
        .nav-cta:hover {
          background: var(--ink);
          border-color: var(--ink);
          color: var(--paper);
        }
        .nav-cta.is-active { background: var(--ink); border-color: var(--ink); }

        @media (max-width: 1180px) {
          .nav-search-placeholder { width: 160px; }
        }

        /* Mobile icon buttons — 44x44 minimum WCAG touch target */
        .nav-icon-btn {
          all: unset;
          cursor: pointer;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          border: 1px solid transparent;
          transition: border-color var(--dur-fast), color var(--dur-fast);
        }
        .nav-icon-btn:hover { color: var(--red); }
        .nav-icon-btn:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: -2px;
        }

        /* Mobile sheet */
        .nav-mobile-scrim {
          all: unset;
          position: fixed;
          inset: 56px 0 0 0;
          background: rgba(26, 20, 16, 0.35);
          z-index: 90;
          cursor: pointer;
        }
        .nav-mobile-sheet {
          position: absolute;
          top: 56px;
          left: 0;
          right: 0;
          background: var(--paper);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--ink);
          box-shadow: var(--shadow-soft);
          padding: 18px 24px 28px;
          z-index: 95;
          max-height: calc(100vh - 56px);
          overflow-y: auto;
          animation: nav-sheet-in 180ms var(--ease-out);
        }
        @keyframes nav-sheet-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-mobile-sheet { animation: none; }
        }
        .nav-mobile-search {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 44px;
          padding: 0 12px;
          background: var(--paper-alt);
          border: 1px solid var(--rule);
          cursor: pointer;
          font-family: var(--body);
          font-size: 0.95rem;
          color: var(--ink-muted);
        }
        .nav-mobile-search:hover { border-color: var(--ink); }
        .nav-mobile-section { margin-top: 20px; }
        .nav-mobile-header {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          padding-bottom: 8px;
          margin-bottom: 6px;
          border-bottom: 1px solid var(--rule);
        }
        .nav-mobile-link {
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 44px;
          padding: 12px 0;
          font-family: var(--serif);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--rule);
        }
        .nav-mobile-link:last-child { border-bottom: 0; }
        .nav-mobile-link:hover { color: var(--red); }
        .nav-mobile-link:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
        .nav-mobile-link.is-active { color: var(--red); }
        .nav-mobile-link .ext-arrow {
          font-size: 0.85em;
          color: var(--ink-muted);
        }
        .nav-mobile-cats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 16px;
        }
        .nav-mobile-cat {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 10px 0;
          font-family: var(--body);
          font-size: 0.95rem;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--rule);
        }
        .nav-mobile-cat:hover { color: var(--red); }
        .nav-mobile-cat:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
      `}</style>
    </header>
  )
}

function NavLink({
  href,
  label,
  active,
  external,
}: {
  href: string
  label: string
  active: boolean
  external?: boolean
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`nav-link ${active ? 'is-active' : ''}`}
      >
        {label}
        <span className="ext-arrow">↗</span>
      </a>
    )
  }
  return (
    <Link href={href} className={`nav-link ${active ? 'is-active' : ''}`}>
      {label}
    </Link>
  )
}
