import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import EditToolForm from './EditToolForm'

export const metadata: Metadata = { title: 'Edit tool' }
export const dynamic = 'force-dynamic'

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const db = await getDb()

  const [tool] = await db.select().from(schema.tools).where(eq(schema.tools.id, id)).limit(1)
  if (!tool) notFound()

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
          Editing · {tool.slug}
          {tool.archivedAt && ' · ARCHIVED'}
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
          }}
        >
          {tool.name}
        </h1>
      </header>
      <EditToolForm tool={tool} categories={cats} />
    </div>
  )
}
