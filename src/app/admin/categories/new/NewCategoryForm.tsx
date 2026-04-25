'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryFormFields from '../_form/CategoryFormFields'
import { createCategory } from '../_form/actions'
import type { CategoryActionState } from '../_form/categorySchema'

const initial: CategoryActionState = { ok: false, message: '' }

export default function NewCategoryForm() {
  const [state, action, pending] = useActionState(createCategory, initial)
  const router = useRouter()

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CategoryFormFields autoSlug state={state} />

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
          {pending ? 'Creating…' : 'Create category'}
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
