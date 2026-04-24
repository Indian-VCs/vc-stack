'use client'

import { useActionState } from 'react'
import { submitTool, type SubmitToolState } from '@/server/actions/submissions'
import type { Category } from '@/lib/types'

const initial: SubmitToolState = { success: false, message: '' }

export default function SubmitProductForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(submitTool, initial)

  if (state.success) {
    return (
      <div
        style={{
          border: '2px solid var(--ink)',
          padding: 40,
          textAlign: 'center',
          background: 'var(--paper-alt)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--success)',
            marginBottom: 14,
          }}
        >
          {state.fileNo ? `Received · File ${state.fileNo}` : 'Received'}
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
          Submission received.
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
        {state.fileNo && (
          <p
            style={{
              marginTop: 16,
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-muted)',
            }}
          >
            Reference this file number if you write to the editors.
          </p>
        )}
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

      <Field label="Tool Name" name="toolName" required error={state.errors?.toolName?.[0]}>
        <input
          type="text"
          name="toolName"
          placeholder="e.g. Affinity"
          required
          autoFocus
          style={inputStyle}
        />
      </Field>

      <Field label="Website URL" name="websiteUrl" required error={state.errors?.websiteUrl?.[0]}>
        <input
          type="url"
          name="websiteUrl"
          placeholder="https://example.com"
          required
          style={inputStyle}
        />
      </Field>

      <Field label="Category" name="categoryId" required error={state.errors?.categoryId?.[0]}>
        <select name="categoryId" required style={inputStyle}>
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Description" name="description" required error={state.errors?.description?.[0]}>
        <textarea
          name="description"
          rows={5}
          required
          placeholder="Describe what the tool does and why VCs use it…"
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--body)' }}
        />
      </Field>

      <Field label="Your Email" name="submitterEmail" required error={state.errors?.submitterEmail?.[0]}>
        <input
          type="email"
          name="submitterEmail"
          placeholder="you@example.com"
          required
          style={inputStyle}
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="btn btn--primary"
        style={{ marginTop: 8 }}
      >
        {pending ? 'Filing…' : 'File Submission →'}
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
        Reviewed within 48 hours · Editors' discretion applies
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
