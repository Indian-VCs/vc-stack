'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryFormFields from '../../_form/CategoryFormFields'
import { updateCategory } from '../../_form/actions'
import type { CategoryActionState } from '../../_form/categorySchema'
import type { CategoryRow } from '@/lib/db/schema'

const initial: CategoryActionState = { ok: false, message: '' }

export default function EditCategoryForm({ category }: { category: CategoryRow }) {
  const router = useRouter()
  const action = updateCategory.bind(null, category.id)
  const [state, formAction, pending] = useActionState(action, initial)

  const defaults = {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    icon: category.icon ?? '',
    imageUrl: category.imageUrl ?? '',
    sortOrder: String(category.sortOrder ?? 0),
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CategoryFormFields defaults={defaults} state={state} />

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
          onClick={() => router.push('/admin/categories')}
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
