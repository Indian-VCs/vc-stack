'use client'

/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
}

const MAX_RESULTS = 8

export const COMMANDK_OPEN_EVENT = 'commandk:open'

function faviconFor(url: string) {
  try {
    const d = new URL(url).hostname.replace(/^www\./, '')
    return `https://www.google.com/s2/favicons?domain=${d}&sz=64`
  } catch {
    return ''
  }
}

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1 ? w[0].substring(0, 2).toUpperCase() : (w[0][0] + w[1][0]).toUpperCase()
}

function matches(tool: Tool, q: string): boolean {
  const haystack = [
    tool.name,
    tool.shortDesc ?? '',
    tool.description ?? '',
    tool.category?.name ?? '',
  ].join(' ').toLowerCase()
  return haystack.includes(q)
}

export default function CommandK({ tools }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools.filter((t) => t.isFeatured).slice(0, MAX_RESULTS)
    return tools.filter((t) => matches(t, q)).slice(0, MAX_RESULTS)
  }, [query, tools])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
    const prev = previouslyFocused.current
    if (prev && document.body.contains(prev) && typeof prev.focus === 'function') {
      prev.focus()
    } else {
      // Fallback: return focus to the nav search trigger if present, else body
      const trigger = document.querySelector<HTMLElement>('[aria-label="Open search (Cmd+K)"]')
      trigger?.focus()
    }
  }, [])

  const openModal = useCallback(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  // Global keyboard trigger + custom event trigger
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        if (open) close()
        else openModal()
      }
    }
    function onOpenEvent() {
      openModal()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(COMMANDK_OPEN_EVENT, onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(COMMANDK_OPEN_EVENT, onOpenEvent)
    }
  }, [open, close, openModal])

  // Focus input, lock body scroll while open. Capture the original inline
  // overflow value at effect-setup time so cleanup restores it even if the
  // component unmounts mid-open (e.g., page navigation).
  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => { document.body.style.overflow = originalOverflow }
  }, [open])

  // Focus trap: keep Tab/Shift+Tab cycling inside the modal while open
  useEffect(() => {
    if (!open) return
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeEl = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (activeEl === first || !panel.contains(activeEl)) {
          e.preventDefault()
          last.focus()
        }
      } else if (activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleFocusTrap)
    return () => window.removeEventListener('keydown', handleFocusTrap)
  }, [open])

  const select = useCallback((tool: Tool) => {
    close()
    router.push(`/product/${tool.slug}`)
  }, [close, router])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (results.length) setActive((a) => (a + 1) % results.length)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length) setActive((a) => (a - 1 + results.length) % results.length)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const chosen = results[active]
      if (chosen) select(chosen)
    }
  }

  if (!open) return null

  return (
    <div
      className="ckk-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div ref={panelRef} className="ckk-panel">
        <div className="ckk-input-row">
          <svg className="ckk-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, categories…"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="ckk-kbd" aria-label="Close with Escape">Esc</kbd>
        </div>

        <ul className="ckk-results" role="listbox">
          {results.length === 0 ? (
            <li className="ckk-empty">
              <div className="ckk-empty-title">No tools match “{query}”</div>
              <button
                type="button"
                className="ckk-empty-link"
                onClick={() => { close(); router.push('/') }}
              >
                Browse all categories →
              </button>
            </li>
          ) : (
            results.map((tool, idx) => {
              const icon = tool.logoUrl || faviconFor(tool.websiteUrl)
              const isActive = idx === active
              return (
                <li key={tool.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    className={`ckk-row ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => select(tool)}
                  >
                    <div className="ckk-row-icon-wrap">
                      {icon ? (
                        <img
                          src={icon}
                          alt=""
                          width={22}
                          height={22}
                          className="ckk-row-icon"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="ckk-row-icon ckk-row-icon-fb">{initials(tool.name)}</div>
                      )}
                    </div>
                    <div className="ckk-row-body">
                      <div className="ckk-row-name">{tool.name}</div>
                      {tool.shortDesc && <div className="ckk-row-desc">{tool.shortDesc}</div>}
                    </div>
                    {tool.category && (
                      <span className="ckk-row-cat">{tool.category.name}</span>
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>

        <div className="ckk-footer">
          <span><kbd className="ckk-hint">↑</kbd><kbd className="ckk-hint">↓</kbd> navigate</span>
          <span><kbd className="ckk-hint">↵</kbd> open</span>
          <span><kbd className="ckk-hint">Esc</kbd> close</span>
        </div>
      </div>

      <style jsx>{`
        .ckk-overlay {
          position: fixed;
          inset: 0;
          background: rgba(25, 24, 22, 0.42);
          z-index: 200;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: min(15vh, 120px) 16px 16px;
          animation: ckkFade 160ms var(--ease-out);
        }
        @keyframes ckkFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ckk-panel {
          width: 100%;
          max-width: 640px;
          background: var(--paper);
          border: 1px solid var(--ink);
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          max-height: min(70vh, 560px);
          animation: ckkPanel 220ms var(--ease-out) both;
        }
        /* Panel descends subtly from above — feels grounded, editorial,
           like a drawer pulled down rather than a modal that "pops". */
        @keyframes ckkPanel {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ckk-overlay, .ckk-panel { animation: none; }
        }

        .ckk-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--rule);
        }
        .ckk-icon {
          color: var(--ink-muted);
          flex-shrink: 0;
        }
        .ckk-input-row input {
          all: unset;
          flex: 1;
          font-family: var(--body);
          font-size: 1rem;
          color: var(--ink);
          line-height: 1.4;
        }
        .ckk-input-row input::placeholder { color: var(--ink-muted); }
        .ckk-kbd {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--ink-muted);
          padding: 2px 6px;
          border: 1px solid var(--rule);
          background: var(--paper-alt);
          line-height: 1;
        }

        .ckk-results {
          list-style: none;
          padding: 6px 0;
          margin: 0;
          overflow-y: auto;
          flex: 1;
        }
        .ckk-empty {
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        .ckk-empty-title {
          font-family: var(--body);
          color: var(--ink-muted);
        }
        .ckk-empty-link {
          all: unset;
          cursor: pointer;
          font-family: var(--mono);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--red);
        }
        .ckk-empty-link:hover { color: var(--ink); }

        .ckk-row {
          all: unset;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 120ms ease;
          box-sizing: border-box;
        }
        .ckk-row.is-active { background: var(--paper-alt); }
        .ckk-row-icon-wrap {
          width: 32px;
          height: 32px;
          border: 1px solid var(--rule);
          background: var(--surface-logo);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ckk-row-icon { width: 22px; height: 22px; object-fit: contain; }
        .ckk-row-icon-fb {
          width: 100%;
          height: 100%;
          background: var(--ink);
          color: var(--paper);
          font-family: var(--mono);
          font-weight: 700;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ckk-row-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .ckk-row-name {
          font-family: var(--serif);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--ink);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ckk-row-desc {
          font-family: var(--body);
          font-size: 0.82rem;
          color: var(--ink-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ckk-row-cat {
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-muted);
          padding: 3px 6px;
          border: 1px solid var(--rule);
          background: var(--paper-alt);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ckk-footer {
          display: flex;
          gap: 16px;
          padding: 10px 16px;
          border-top: 1px solid var(--rule);
          background: var(--paper-alt);
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .ckk-hint {
          font-family: var(--mono);
          font-size: 0.68rem;
          margin-right: 4px;
          padding: 1px 5px;
          border: 1px solid var(--rule);
          background: var(--paper);
          color: var(--ink);
          line-height: 1;
        }

        @media (max-width: 640px) {
          .ckk-overlay { padding-top: 40px; }
          .ckk-row-desc { display: none; }
          .ckk-footer { font-size: 0.6rem; gap: 10px; }
        }
      `}</style>
    </div>
  )
}
