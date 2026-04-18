import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getCategoryPreviewTools } from '@/lib/data'
import CategoryCard from '@/components/cards/CategoryCard'

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse all VC tool categories — from deal sourcing to fund administration.',
}

export const revalidate = 3600

export default async function AllCategoriesPage() {
  const [categories, previewToolsMap] = await Promise.all([
    getCategories(),
    getCategoryPreviewTools(),
  ])

  return (
    <div className="page" style={{ padding: '24px 24px 48px' }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>All Categories</span>
      </div>

      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 28,
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
          The Index · Complete Listing
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.1,
          }}
        >
          All Categories
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            color: 'var(--ink-light)',
            marginTop: 10,
            fontStyle: 'italic',
          }}
        >
          {categories.length} sections, each covering a beat of the VC operations stack.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 0 }}>
        {categories.map((cat, i) => (
          <div key={cat.id} style={{ marginLeft: -1, marginTop: -1 }}>
            <CategoryCard
              category={cat}
              previewTools={previewToolsMap[cat.slug] ?? []}
              index={i}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
