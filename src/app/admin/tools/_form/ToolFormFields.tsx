'use client'

import { useState } from 'react'
import type { ToolActionState } from './toolSchema'
import type { CategoryRow } from '@/lib/db/schema'

interface Props {
  categories: Array<Pick<CategoryRow, 'id' | 'name' | 'slug'>>
  defaults?: Partial<{
    name: string
    slug: string
    description: string
    shortDesc: string
    useCases: string
    keyFeatures: string
    websiteUrl: string
    logoUrl: string
    categoryId: string
    extraCategorySlugs: string
    pricingModel: 'FREE' | 'FREEMIUM' | 'PAID' | 'ENTERPRISE'
    isFeatured: boolean
    featuredOrder: string
  }>
  state: ToolActionState
  /** Optional slug derivation from name when slug field is empty. */
  autoSlug?: boolean
}

const PRICING_OPTIONS = ['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE'] as const

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default function ToolFormFields({ categories, defaults = {}, state, autoSlug }: Props) {
  const [name, setName] = useState(defaults.name ?? '')
  const [slug, setSlug] = useState(defaults.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(defaults.slug))
  const [isFeatured, setIsFeatured] = useState(Boolean(defaults.isFeatured))

  function onNameChange(value: string) {
    setName(value)
    // Mirror name → slug while the user hasn't manually edited the slug field.
    if (autoSlug && !slugTouched) setSlug(slugify(value))
  }

  const errs = state.fieldErrors ?? {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
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

      <Field label="Website URL" name="websiteUrl" required error={errs.websiteUrl?.[0]}>
        <input
          name="websiteUrl"
          type="url"
          required
          defaultValue={defaults.websiteUrl ?? ''}
          style={inputStyle}
        />
      </Field>

      <Field label="Short description (≤80 chars)" name="shortDesc" error={errs.shortDesc?.[0]}>
        <input
          name="shortDesc"
          maxLength={200}
          defaultValue={defaults.shortDesc ?? ''}
          style={inputStyle}
        />
      </Field>

      <Field label="Description (40–70 words)" name="description" required error={errs.description?.[0]}>
        <textarea
          name="description"
          required
          rows={6}
          defaultValue={defaults.description ?? ''}
          style={textareaStyle}
        />
      </Field>

      <Field
        label="Use cases (one per line, 2 expected)"
        name="useCases"
        error={errs.useCases?.[0]}
      >
        <textarea
          name="useCases"
          rows={3}
          defaultValue={defaults.useCases ?? ''}
          style={textareaStyle}
          placeholder="Used to ..."
        />
      </Field>

      <Field
        label="Key features (one per line, 2–3 expected — leave blank for niche tools)"
        name="keyFeatures"
        error={errs.keyFeatures?.[0]}
      >
        <textarea
          name="keyFeatures"
          rows={3}
          defaultValue={defaults.keyFeatures ?? ''}
          style={textareaStyle}
          placeholder="What the product *is* — short product-feature bullets."
        />
      </Field>

      <Field label="Logo URL (https://…)" name="logoUrl" error={errs.logoUrl?.[0]}>
        <input
          name="logoUrl"
          type="url"
          defaultValue={defaults.logoUrl ?? ''}
          style={inputStyle}
        />
      </Field>

      <Field label="Section" name="categoryId" required error={errs.categoryId?.[0]}>
        <select name="categoryId" required defaultValue={defaults.categoryId ?? ''} style={inputStyle}>
          <option value="" disabled>
            Choose…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.slug})
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Extra category slugs (comma-separated)"
        name="extraCategorySlugs"
        error={errs.extraCategorySlugs?.[0]}
      >
        <input
          name="extraCategorySlugs"
          defaultValue={defaults.extraCategorySlugs ?? ''}
          placeholder="data, research"
          style={inputStyle}
        />
      </Field>

      <Field label="Pricing" name="pricingModel" error={errs.pricingModel?.[0]}>
        <select
          name="pricingModel"
          defaultValue={defaults.pricingModel ?? 'FREEMIUM'}
          style={inputStyle}
        >
          {PRICING_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--body)' }}>
          <input
            type="checkbox"
            name="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Featured</span>
        </label>

        <Field
          label="Featured order (lower first)"
          name="featuredOrder"
          error={errs.featuredOrder?.[0]}
        >
          <input
            name="featuredOrder"
            type="number"
            min={0}
            defaultValue={defaults.featuredOrder ?? ''}
            disabled={!isFeatured}
            style={{ ...inputStyle, opacity: isFeatured ? 1 : 0.5 }}
          />
        </Field>
      </div>
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
  fontFamily: 'var(--body)',
  resize: 'vertical',
  minHeight: 80,
}
