import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import EditCategoryForm from './EditCategoryForm'

export const metadata: Metadata = { title: 'Edit category' }
export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const db = await getDb()

  const [cat] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, id))
    .limit(1)
  if (!cat) notFound()

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
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 8,
          }}
        >
          Editing · {cat.slug}
          {cat.archivedAt && ' · ARCHIVED'}
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
          }}
        >
          {cat.name}
        </h1>
      </header>
      <EditCategoryForm category={cat} />
    </div>
  )
}
