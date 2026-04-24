'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TOTAL_TOOL_APPEARANCES, TOTAL_CATEGORIES } from '@/lib/stats'
import { COMMANDK_OPEN_EVENT } from '@/components/ui/CommandK'

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
  const catRef = useRef<HTMLDivElement>(null)

  const isCategoryRoute = pathname.startsWith('/category') || pathname.startsWith('/all-categories')

  const openCommandK = () => {
    window.dispatchEvent(new Event(COMMANDK_OPEN_EVENT))
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategories(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowCategories(false)
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
  }, [pathname])

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
          className="flex items-center"
          style={{ height: 56, gap: 0, justifyContent: 'space-between' }}
        >
          {/* ── Left: logo + primary nav ─────────────────────────── */}
          <div className="hidden lg:flex items-center" style={{ gap: 0 }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
                textDecoration: 'none',
                marginRight: 20,
              }}
            >
              IndianVCs
            </Link>
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

          {/* ── Right: search ─────────────────────────────────────── */}
          <div className="hidden md:flex items-center" style={{ gap: 16, marginLeft: 'auto' }}>
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

        </div>
      </nav>

      <style jsx global>{`
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
