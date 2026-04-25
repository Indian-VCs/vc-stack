'use client'

import { useState, useTransition } from 'react'
import type { StackSubmissionRow } from '@/lib/db/schema'
import { displayExternalUrl, externalHref } from '@/lib/url'
import { publishStack, rejectStack, archiveStack } from './actions'

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--red)',
  published: 'var(--success, #2a7a2a)',
  rejected: 'var(--ink-muted)',
  archived: 'var(--ink-muted)',
}

export default function StackRow({ row }: { row: StackSubmissionRow }) {
  const [isPending, start] = useTransition()
  const [error, setError] = useState('')
  const [status, setStatus] = useState(row.status)
  const [publishedSlug, setPublishedSlug] = useState(row.publishedSlug ?? '')
  const firmWebsiteHref = externalHref(row.firmWebsite)

  function run(fn: () => Promise<{ ok: boolean; message?: string; status?: typeof row.status }>) {
    setError('')
    start(async () => {
      const res = await fn()
      if (!res.ok) {
        setError(res.message ?? 'Action failed.')
        return
      }
      if (res.status) setStatus(res.status)
    })
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        background: status === 'pending' ? 'var(--paper)' : 'var(--paper-alt)',
        padding: 18,
        opacity: status === 'pending' ? 1 : 0.75,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: 'var(--ink)',
            }}
          >
            {row.firmName}
          </div>
          {firmWebsiteHref && (
            <a
              href={firmWebsiteHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                color: 'var(--red)',
                textDecoration: 'none',
              }}
            >
              {displayExternalUrl(row.firmWebsite)}
            </a>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: STATUS_COLORS[status] ?? 'var(--ink-muted)',
              fontWeight: 600,
            }}
          >
            {status}
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              color: 'var(--ink-muted)',
            }}
          >
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--body)',
          fontSize: '0.9rem',
          color: 'var(--ink)',
          marginBottom: 12,
        }}
      >
        <strong>{row.toolSlugs.length}</strong> tools selected
        {row.otherTools && (
          <>
            {' · '}<em>plus typed in:</em> {row.otherTools}
          </>
        )}
        {row.notes && row.notes.length > 0 && (
          <>
            {' · '}<strong>{row.notes.length}</strong> per-tool notes
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          color: 'var(--ink-light)',
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span>
          From{' '}
          <span style={{ color: 'var(--ink)' }}>
            {row.submitterName}
            {row.submitterRole && `, ${row.submitterRole}`}
          </span>
        </span>
        <span>· {row.submitterEmail}</span>
        {publishedSlug && <span>· published: /{publishedSlug}</span>}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            color: 'var(--red)',
            fontFamily: 'var(--body)',
            fontSize: '0.9rem',
            marginBottom: 8,
          }}
        >
          {error}
        </div>
      )}

      {status === 'pending' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="published slug (e.g. firmname-stack)"
            value={publishedSlug}
            onChange={(e) => setPublishedSlug(e.target.value)}
            style={{
              flex: '1 1 240px',
              padding: '8px 10px',
              border: '1px solid var(--rule)',
              fontFamily: 'var(--mono)',
              fontSize: '0.85rem',
            }}
          />
          <button
            type="button"
            disabled={isPending || !publishedSlug.trim()}
            onClick={() => run(() => publishStack(row.id, publishedSlug.trim()))}
            style={btn(isPending || !publishedSlug.trim(), true)}
          >
            Mark published
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => rejectStack(row.id))}
            style={btn(isPending, false)}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => archiveStack(row.id))}
            style={btn(isPending, false)}
          >
            Archive
          </button>
        </div>
      )}
    </div>
  )
}

function btn(disabled: boolean, primary: boolean): React.CSSProperties {
  return {
    background: primary ? 'var(--ink)' : 'transparent',
    color: primary ? 'var(--paper)' : 'var(--ink)',
    border: primary ? 'none' : '1px solid var(--rule)',
    padding: '8px 14px',
    fontFamily: 'var(--mono)',
    fontSize: 'var(--fs-tag)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  }
}
