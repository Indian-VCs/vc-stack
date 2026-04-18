import Link from 'next/link'
import MarketMapPoster from '@/components/ui/MarketMapPoster'
import { getAllTools, getCategories } from '@/lib/data'

export default async function MarketMapPage() {
  const [tools, categories] = await Promise.all([getAllTools(), getCategories()])
  return (
    <div
      className="page"
      style={{ padding: '24px 24px 64px', maxWidth: 'min(1600px, calc(100vw - 32px))' }}
    >
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Market Map</span>
      </div>

      <div style={{ marginTop: 20 }}>
        <MarketMapPoster tools={tools} categories={categories} />
      </div>
    </div>
  )
}
