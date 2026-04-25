import type { Metadata } from 'next'
import { asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import NewToolForm from './NewToolForm'

export const metadata: Metadata = { title: 'New tool' }
export const dynamic = 'force-dynamic'

export default async function NewToolPage() {
  await requireAdmin()
  const db = await getDb()
  const cats = await db
    .select({ id: schema.categories.id, name: schema.categories.name, slug: schema.categories.slug })
    .from(schema.categories)
    .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name))

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
          New tool
        </h1>
      </header>
      <NewToolForm categories={cats} />
    </div>
  )
}
