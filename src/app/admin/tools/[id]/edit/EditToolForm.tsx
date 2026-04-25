'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import ToolFormFields from '../../_form/ToolFormFields'
import { updateTool } from '../../_form/actions'
import type { ToolActionState } from '../../_form/toolSchema'
import type { CategoryRow, ToolRow } from '@/lib/db/schema'

const initial: ToolActionState = { ok: false, message: '' }

export default function EditToolForm({
  tool,
  categories,
}: {
  tool: ToolRow
  categories: Array<Pick<CategoryRow, 'id' | 'name' | 'slug'>>
}) {
  const router = useRouter()
  const action = updateTool.bind(null, tool.id)
  const [state, formAction, pending] = useActionState(action, initial)

  const defaults = {
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    shortDesc: tool.shortDesc ?? '',
    useCases: (tool.useCases ?? []).join('\n'),
    websiteUrl: tool.websiteUrl,
    logoUrl: tool.logoUrl ?? '',
    categoryId: tool.categoryId,
    extraCategorySlugs: (tool.extraCategorySlugs ?? []).join(', '),
    pricingModel: tool.pricingModel,
    isFeatured: tool.isFeatured,
    featuredOrder: tool.featuredOrder !== null && tool.featuredOrder !== undefined ? String(tool.featuredOrder) : '',
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ToolFormFields categories={categories} defaults={defaults} state={state} />

      {state.message && !state.ok && state.fieldErrors === undefined && (
        <div
          role="alert"
          style={{
            padding: 12,
            border: '1px solid var(--red)',
            background: 'rgba(210,25,5,0.06)',
            color: 'var(--red)',
            fontFamily: 'var(--body)',
          }}
        >
          {state.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            background: 'var(--ink)',
            color: 'var(--paper)',
            border: 'none',
            padding: '10px 20px',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            cursor: pending ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.5 : 1,
          }}
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/tools')}
          style={{
            background: 'transparent',
            color: 'var(--ink)',
            border: '1px solid var(--rule)',
            padding: '10px 20px',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
