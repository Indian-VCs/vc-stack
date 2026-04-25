'use client'

import { useState } from 'react'
import type { CategoryActionState } from './categorySchema'

interface Props {
  defaults?: Partial<{
    name: string
    slug: string
    description: string
    icon: string
    imageUrl: string
    sortOrder: string
  }>
  state: CategoryActionState
  autoSlug?: boolean
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default function CategoryFormFields({ defaults = {}, state, autoSlug }: Props) {
  const [name, setName] = useState(defaults.name ?? '')
  const [slug, setSlug] = useState(defaults.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(defaults.slug))

  function onNameChange(value: string) {
    setName(value)
    // Mirror name → slug while the user hasn't manually edited the slug field.
    if (autoSlug && !slugTouched) setSlug(slugify(value))
  }

  const errs = state.fieldErrors ?? {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <Field label="Name" name="name" required error={errs.name?.[0]}>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          style={inputStyle}
        />
      </Field>

      <Field label="Slug" name="slug" required error={errs.slug?.[0]}>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          style={inputStyle}
        />
      </Field>

      <Field label="Description" name="description" error={errs.description?.[0]}>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults.description ?? ''}
          style={textareaStyle}
        />
      </Field>

      <Field label="Icon (single emoji)" name="icon" error={errs.icon?.[0]}>
        <input
          name="icon"
          maxLength={8}
          defaultValue={defaults.icon ?? ''}
          style={{ ...inputStyle, fontSize: '1.4rem' }}
        />
      </Field>

      <Field label="Image URL (optional)" name="imageUrl" error={errs.imageUrl?.[0]}>
        <input
          name="imageUrl"
          type="url"
          defaultValue={defaults.imageUrl ?? ''}
          style={inputStyle}
          placeholder="/images/categories/foo.jpg or https://…"
        />
      </Field>

      <Field label="Sort order (lower first)" name="sortOrder" error={errs.sortOrder?.[0]}>
        <input
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={defaults.sortOrder ?? '0'}
          style={inputStyle}
        />
      </Field>
    </div>
  )
}

function Field({
  label,
  name,
  required,
  children,
  error,
}: {
  label: string
  name: string
  required?: boolean
  children: React.ReactNode
  error?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        htmlFor={name}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--ink-muted)',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--red)' }}> *</span>}
      </label>
      {children}
      {error && (
        <div style={{ color: 'var(--red)', fontFamily: 'var(--body)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--rule)',
  background: 'var(--paper)',
  fontFamily: 'var(--body)',
  fontSize: '0.95rem',
  color: 'var(--ink)',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
}
