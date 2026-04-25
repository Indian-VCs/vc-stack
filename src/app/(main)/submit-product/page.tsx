import type { Metadata } from 'next'
import Link from 'next/link'
import SubmitProductForm from './SubmitProductForm'
import { getCategories } from '@/lib/data'
import { publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Submit a Product',
  description: 'File a submission to the IndianVCs desk — a tool worth listing on the paper.',
  alternates: { canonical: publicUrl('/submit-product') },
}

export default async function SubmitProductPage() {
  const categories = await getCategories()
  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Submit a Product</span>
      </div>

      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '24px 0',
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'clamp(1.7rem, 6vw, 2.6rem)',
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          File a Submission
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            color: 'var(--ink-light)',
            marginTop: 12,
            maxWidth: 760,
          }}
        >
          Know a tool that belongs on the paper? Send it to the editors — we review
          new entries within 48 hours and run them in the next edition.
        </p>
      </header>

      <div style={{ maxWidth: 720 }}>
        <SubmitProductForm categories={categories} />
      </div>
    </div>
  )
}
