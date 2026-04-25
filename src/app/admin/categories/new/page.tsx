import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import NewCategoryForm from './NewCategoryForm'

export const metadata: Metadata = { title: 'New category' }
export const dynamic = 'force-dynamic'

export default async function NewCategoryPage() {
  await requireAdmin()

  return (
    <div style={{ padding: '32px 40px 64px' }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
          }}
        >
          New category
        </h1>
      </header>
      <NewCategoryForm />
    </div>
  )
}
