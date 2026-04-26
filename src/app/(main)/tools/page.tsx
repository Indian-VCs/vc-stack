import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTools, getCategories } from '@/lib/data'
import ToolsDirectory from './ToolsDirectory'

export const metadata: Metadata = {
  title: 'The Tool Directory — IndianVCs',
  description:
    'Search, filter, and browse every tool in the IndianVCs tech stack — by section, pricing, or keyword.',
}

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([getAllTools(), getCategories()])

  return (
    <div className="page" style={{ padding: '24px 24px 64px' }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Tool Directory</span>
      </div>

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
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Directory · {tools.length} tools on file
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            textWrap: 'balance',
          }}
        >
          The Tool Directory
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            color: 'var(--ink-light)',
            marginTop: 10,
            maxWidth: 720,
            fontStyle: 'italic',
            textWrap: 'pretty',
          }}
        >
          Every tool in the IndianVCs tech stack, in one searchable list.
          Filter by section, pricing, or keyword — then click through for the full entry.
        </p>
      </header>

      <ToolsDirectory tools={tools} categories={categories} />
    </div>
  )
}
