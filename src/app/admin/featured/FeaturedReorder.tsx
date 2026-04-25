'use client'

/**
 * Featured-list reorder UI.
 *
 * Local-state only until the editor hits "Save order" — at which point the
 * full list of IDs is shipped to the `saveFeaturedOrder` server action in one
 * batch. Keeps the wire chatter to a single round trip and avoids any half-
 * applied reordering if the network drops mid-shuffle.
 */

import { useState, useTransition } from 'react'
import type { ToolRow } from '@/lib/db/schema'
import { saveFeaturedOrder } from './actions'

type Status = { ok: boolean; message: string } | null

export default function FeaturedReorder({ tools }: { tools: ToolRow[] }) {
  const [order, setOrder] = useState<ToolRow[]>(tools)
  const [status, setStatus] = useState<Status>(null)
  const [pending, startTransition] = useTransition()

  const initialIds = tools.map((t) => t.id).join('|')
  const currentIds = order.map((t) => t.id).join('|')
  const dirty = initialIds !== currentIds

  function move(idx: number, dir: -1 | 1) {
    setStatus(null)
    setOrder((prev) => {
      const next = prev.slice()
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  function reset() {
    setStatus(null)
    setOrder(tools)
  }

  function save() {
    setStatus(null)
    const ids = order.map((t) => t.id)
    startTransition(async () => {
      try {
        const result = await saveFeaturedOrder(ids)
        setStatus({
          ok: result.ok,
          message: result.message ?? (result.ok ? 'Order saved.' : 'Save failed.'),
        })
      } catch (err) {
        setStatus({
          ok: false,
          message: err instanceof Error ? err.message : 'Unexpected error.',
        })
      }
    })
  }

  if (order.length === 0) {
    return (
      <div
        style={{
          padding: 48,
          border: '1px solid var(--rule)',
          background: 'var(--paper-alt)',
          textAlign: 'center',
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          color: 'var(--ink-light)',
        }}
      >
        No tools are currently featured. Toggle <code style={{ fontFamily: 'var(--mono)' }}>isFeatured</code>{' '}
        on a tool from the Tools list to add one.
      </div>
    )
  }

  return (
    <div>
      <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
        {order.map((tool, idx) => {
          const isFirst = idx === 0
          const isLast = idx === order.length - 1
          return (
            <div
              key={tool.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr auto',
                gap: 16,
                alignItems: 'center',
                padding: '14px 16px',
                borderBottom:
                  idx < order.length - 1 ? '1px solid var(--rule)' : 'none',
                background: idx % 2 === 0 ? 'var(--paper)' : 'var(--paper-alt)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--fs-tag)',
                  color: 'var(--red)',
                  letterSpacing: '0.16em',
                  textAlign: 'center',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                  }}
                >
                  {tool.name}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    fontFamily: 'var(--mono)',
                    fontSize: 'var(--fs-tag)',
                    color: 'var(--ink-muted)',
                  }}
                >
                  <span>/{tool.slug}</span>
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--ink-light)', textDecoration: 'underline' }}
                  >
                    {tool.websiteUrl}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={isFirst || pending}
                  aria-label={`Move ${tool.name} up`}
                  style={moveButton(isFirst || pending)}
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={isLast || pending}
                  aria-label={`Move ${tool.name} down`}
                  style={moveButton(isLast || pending)}
                >
                  ↓ Down
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          style={{
            padding: '10px 20px',
            background: !dirty || pending ? 'var(--ink-light)' : 'var(--ink)',
            color: 'var(--paper)',
            border: 'none',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            cursor: !dirty || pending ? 'not-allowed' : 'pointer',
          }}
        >
          {pending ? 'Saving…' : 'Save order'}
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={!dirty || pending}
          style={{
            padding: '10px 16px',
            background: 'transparent',
            color: 'var(--ink)',
            border: '1px solid var(--rule)',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            cursor: !dirty || pending ? 'not-allowed' : 'pointer',
            opacity: !dirty || pending ? 0.5 : 1,
          }}
        >
          Reset
        </button>

        {dirty && !status && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--ink-muted)',
              letterSpacing: '0.12em',
            }}
          >
            Unsaved changes
          </span>
        )}

        {status && (
          <span
            role="status"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              letterSpacing: '0.12em',
              color: status.ok ? 'var(--ink)' : 'var(--red)',
            }}
          >
            {status.message}
          </span>
        )}
      </div>
    </div>
  )
}

function moveButton(disabled: boolean): React.CSSProperties {
  return {
    padding: '6px 10px',
    background: 'var(--paper)',
    color: 'var(--ink)',
    border: '1px solid var(--rule)',
    fontFamily: 'var(--mono)',
    fontSize: 'var(--fs-tag)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }
}
