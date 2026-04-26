'use client'

import { useActionState } from 'react'
import {
  submitUpdateSuggestion,
  type SubmitUpdateState,
} from '@/server/actions/update-feedback'

const initial: SubmitUpdateState = { success: false, message: '' }

interface ToolOption {
  slug: string
  name: string
}

export default function SuggestUpdateForm({
  tools,
  defaultToolSlug,
}: {
  tools: ToolOption[]
  defaultToolSlug?: string
}) {
  const [state, action, pending] = useActionState(submitUpdateSuggestion, initial)

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
          Suggestion received.
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

      <Field label="Tool" name="toolSlug" required error={state.errors?.toolSlug?.[0]}>
        <select
          id="toolSlug"
          name="toolSlug"
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.toolSlug?.[0])}
          aria-describedby={state.errors?.toolSlug?.[0] ? 'toolSlug-error' : undefined}
          defaultValue={defaultToolSlug ?? ''}
          style={inputStyle}
        >
          <option value="">Select a tool…</option>
          {tools.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="What needs updating?"
        name="fieldArea"
        required
        error={state.errors?.fieldArea?.[0]}
      >
        <select
          id="fieldArea"
          name="fieldArea"
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.fieldArea?.[0])}
          aria-describedby={state.errors?.fieldArea?.[0] ? 'fieldArea-error' : undefined}
          defaultValue=""
          style={inputStyle}
        >
          <option value="">Select an area…</option>
          <option value="description">Description / overview</option>
          <option value="pricing">Pricing</option>
          <option value="use_cases">Use cases</option>
          <option value="key_features">Key features</option>
          <option value="logo">Logo</option>
          <option value="broken_link">Broken link</option>
          <option value="other">Something else</option>
        </select>
      </Field>

      <Field
        label="Suggested change"
        name="suggestion"
        required
        error={state.errors?.suggestion?.[0]}
      >
        <textarea
          id="suggestion"
          name="suggestion"
          rows={6}
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.suggestion?.[0])}
          aria-describedby={state.errors?.suggestion?.[0] ? 'suggestion-error' : undefined}
          placeholder="Tell us what's wrong, what's missing, or what should change. The more specific, the faster we can apply it."
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--body)' }}
        />
      </Field>

      <Field
        label="Your Email"
        name="submitterEmail"
        required
        error={state.errors?.submitterEmail?.[0]}
      >
        <input
          id="submitterEmail"
          type="email"
          name="submitterEmail"
          placeholder="you@example.com"
          required
          aria-required="true"
          aria-invalid={Boolean(state.errors?.submitterEmail?.[0])}
          aria-describedby={state.errors?.submitterEmail?.[0] ? 'submitterEmail-error' : undefined}
          style={inputStyle}
        />
      </Field>

      <Field
        label="Your Role"
        name="submitterRole"
        error={state.errors?.submitterRole?.[0]}
      >
        <select
          id="submitterRole"
          name="submitterRole"
          aria-invalid={Boolean(state.errors?.submitterRole?.[0])}
          aria-describedby={state.errors?.submitterRole?.[0] ? 'submitterRole-error' : undefined}
          defaultValue=""
          style={inputStyle}
        >
          <option value="">—</option>
          <option value="gp">GP / Partner</option>
          <option value="analyst">Analyst / Associate</option>
          <option value="operator">Platform / Operations</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="btn btn--primary"
        style={{ marginTop: 8 }}
      >
        {pending ? 'Sending…' : 'Send Suggestion →'}
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
        Reviewed within a few days · Editors&apos; discretion applies
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
