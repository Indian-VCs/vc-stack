'use client'

import { useActionState, useMemo, useState } from 'react'
import { submitStack, type SubmitStackState } from '@/server/actions/contributeStack'
import type { Tool } from '@/lib/types'

const initial: SubmitStackState = { success: false, message: '' }

export default function StackContributionForm({ tools }: { tools: Tool[] }) {
  const [state, action, pending] = useActionState(submitStack, initial)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState<Map<string, string>>(new Map())
  const [query, setQuery] = useState('')

  const toolsBySlug = useMemo(() => {
    const m = new Map<string, Tool>()
    for (const t of tools) m.set(t.slug, t)
    return m
  }, [tools])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools.slice(0, 40)
    return tools
      .filter((t) => {
        if (t.name.toLowerCase().includes(q)) return true
        if (t.slug.toLowerCase().includes(q)) return true
        if (t.shortDesc?.toLowerCase().includes(q)) return true
        return false
      })
      .slice(0, 40)
  }, [tools, query])

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
        setNotes((nm) => {
          if (!nm.has(slug)) return nm
          const copy = new Map(nm)
          copy.delete(slug)
          return copy
        })
      } else {
        next.add(slug)
      }
      return next
    })
  }

  function setNote(slug: string, value: string) {
    setNotes((prev) => {
      const next = new Map(prev)
      if (value.trim() === '') next.delete(slug)
      else next.set(slug, value)
      return next
    })
  }

  const selectedSlugs = useMemo(() => [...selected], [selected])
  const notesArray = useMemo(
    () =>
      [...notes.entries()]
        .filter(([slug]) => selected.has(slug))
        .map(([slug, note]) => ({ slug, note })),
    [notes, selected],
  )

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="submit-received"
        style={{
          border: '2px solid var(--ink)',
          padding: 40,
          textAlign: 'center',
          background: 'var(--paper-alt)',
        }}
      >
        <div
          className="submit-received-stamp"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--success)',
            marginBottom: 14,
          }}
        >
          Received
        </div>
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: '1.8rem',
            color: 'var(--ink)',
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          Stack received.
        </h2>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: 'var(--ink-light)',
          }}
        >
          {state.message}
        </p>
        <style>{`
          .submit-received {
            opacity: 0;
            animation: submitReceived 520ms var(--ease-out) both;
          }
          .submit-received-stamp {
            opacity: 0;
            animation: submitStamp 280ms var(--ease-out) 420ms both;
          }
          @keyframes submitReceived {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes submitStamp {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .submit-received,
            .submit-received-stamp {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {state.message && !state.success && (
        <div
          style={{
            border: '1px solid var(--red)',
            background: 'rgba(192, 57, 43, 0.06)',
            padding: '12px 16px',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--red)',
          }}
        >
          {state.message}
        </div>
      )}

      <Field label="Firm Name" name="firmName" required error={state.errors?.firmName?.[0]}>
        <input
          id="firmName"
          type="text"
          name="firmName"
          placeholder="e.g. Blume Ventures"
          required
          autoFocus
          aria-required="true"
          aria-invalid={Boolean(state.errors?.firmName?.[0])}
          aria-describedby={state.errors?.firmName?.[0] ? 'firmName-error' : undefined}
          style={inputStyle}
        />
      </Field>

      <Field label="Firm Website" name="firmWebsite" error={state.errors?.firmWebsite?.[0]}>
        <input
          id="firmWebsite"
          type="url"
          name="firmWebsite"
          placeholder="https://blume.vc"
          aria-invalid={Boolean(state.errors?.firmWebsite?.[0])}
          aria-describedby={state.errors?.firmWebsite?.[0] ? 'firmWebsite-error' : undefined}
          style={inputStyle}
        />
      </Field>

      <Field label="Your Name" name="submitterName" required error={state.errors?.submitterName?.[0]}>
        <input
          id="submitterName"
          type="text"
          name="submitterName"
          placeholder="Pavithran"
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.submitterName?.[0])}
          aria-describedby={state.errors?.submitterName?.[0] ? 'submitterName-error' : undefined}
          style={inputStyle}
        />
      </Field>

      <Field
        label="Your Role at the Firm"
        name="submitterRole"
        error={state.errors?.submitterRole?.[0]}
      >
        <input
          id="submitterRole"
          type="text"
          name="submitterRole"
          placeholder="Partner, Investment Associate, Platform Lead…"
          aria-invalid={Boolean(state.errors?.submitterRole?.[0])}
          aria-describedby={state.errors?.submitterRole?.[0] ? 'submitterRole-error' : undefined}
          style={inputStyle}
        />
      </Field>

      <Field label="Your Email" name="submitterEmail" required error={state.errors?.submitterEmail?.[0]}>
        <input
          id="submitterEmail"
          type="email"
          name="submitterEmail"
          placeholder="you@firm.com"
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.submitterEmail?.[0])}
          aria-describedby={state.errors?.submitterEmail?.[0] ? 'submitterEmail-error' : undefined}
          style={inputStyle}
        />
      </Field>

      {/* ── Tool picker ─────────────────────────────────────────────────── */}
      <div>
        <label
          htmlFor="tool-search"
          style={{
            display: 'block',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink)',
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          The Stack
          <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>
        </label>

        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '0.9rem',
            color: 'var(--ink-light)',
            margin: '0 0 12px',
            fontStyle: 'italic',
          }}
        >
          Search the catalog and toggle on every tool your firm actually uses.
          Add a one-line note on each if you want — that&apos;s the editorial gold.
        </p>

        {/* Selected list with optional notes */}
        {selectedSlugs.length > 0 && (
          <div
            style={{
              border: '1px solid var(--ink)',
              background: 'var(--paper-alt)',
              padding: 14,
              marginBottom: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--ink-muted)',
              }}
            >
              {selectedSlugs.length} tool{selectedSlugs.length === 1 ? '' : 's'} selected
            </div>
            {selectedSlugs.map((slug) => {
              const tool = toolsBySlug.get(slug)
              if (!tool) return null
              return (
                <details
                  key={slug}
                  style={{
                    border: '1px solid var(--rule)',
                    background: 'var(--paper)',
                    padding: '8px 12px',
                  }}
                >
                  <summary
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontFamily: 'var(--body)',
                      fontSize: '0.95rem',
                      color: 'var(--ink)',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{tool.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        toggle(slug)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--mono)',
                        fontSize: 'var(--fs-tag)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--red)',
                        padding: 0,
                      }}
                      aria-label={`Remove ${tool.name}`}
                    >
                      Remove
                    </button>
                  </summary>
                  <textarea
                    rows={2}
                    placeholder={`How does your firm use ${tool.name}? (optional)`}
                    value={notes.get(slug) ?? ''}
                    onChange={(e) => setNote(slug, e.target.value)}
                    maxLength={500}
                    style={{
                      ...inputStyle,
                      marginTop: 8,
                      resize: 'vertical',
                      fontFamily: 'var(--body)',
                    }}
                  />
                </details>
              )
            })}
          </div>
        )}

        <input
          id="tool-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the catalog — Affinity, Notion, Slack…"
          style={inputStyle}
        />

        <div
          role="listbox"
          aria-label="Tool catalog"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 12,
            maxHeight: 280,
            overflowY: 'auto',
            border: '1px solid var(--rule)',
            padding: 10,
            background: 'var(--paper)',
          }}
        >
          {filtered.length === 0 && (
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                color: 'var(--ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                padding: '6px 4px',
              }}
            >
              No tools match &ldquo;{query}&rdquo;
            </div>
          )}
          {filtered.map((tool) => {
            const isSelected = selected.has(tool.slug)
            return (
              <button
                key={tool.slug}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggle(tool.slug)}
                style={{
                  background: isSelected ? 'var(--ink)' : 'var(--paper)',
                  color: isSelected ? 'var(--paper)' : 'var(--ink)',
                  border: '1px solid var(--ink)',
                  padding: '5px 10px',
                  fontFamily: 'var(--body)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderRadius: 0,
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {isSelected ? '✓ ' : ''}
                {tool.name}
              </button>
            )
          })}
        </div>

        {state.errors?.toolSlugs?.[0] && (
          <p
            id="toolSlugs-error"
            role="alert"
            style={{
              marginTop: 6,
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--red)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
            }}
          >
            {state.errors.toolSlugs[0]}
          </p>
        )}

        <input type="hidden" name="toolSlugs" value={JSON.stringify(selectedSlugs)} />
        <input type="hidden" name="notes" value={JSON.stringify(notesArray)} />
      </div>

      <Field
        label="Other tools we use that aren't in the catalog"
        name="otherTools"
        error={state.errors?.otherTools?.[0]}
      >
        <textarea
          id="otherTools"
          name="otherTools"
          rows={3}
          placeholder="Free text — e.g. internal LP CRM, a custom diligence checklist tool, regional newsletters…"
          maxLength={2000}
          aria-invalid={Boolean(state.errors?.otherTools?.[0])}
          aria-describedby={state.errors?.otherTools?.[0] ? 'otherTools-error' : undefined}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--body)' }}
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="btn btn--primary"
        style={{ marginTop: 8 }}
      >
        {pending ? 'Filing…' : 'Share the Stack →'}
      </button>

      <p
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--ink-muted)',
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        Reviewed within 48 hours · Editors&apos; discretion applies
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string
  name: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--ink)',
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          style={{
            marginTop: 6,
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            color: 'var(--red)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--paper)',
  border: '1px solid var(--ink)',
  padding: '10px 12px',
  fontFamily: 'var(--body)',
  fontSize: '1rem',
  color: 'var(--ink)',
  borderRadius: 0,
  outline: 'none',
}
