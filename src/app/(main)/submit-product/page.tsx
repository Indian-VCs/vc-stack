import type { Metadata } from 'next'
import Link from 'next/link'
import SubmitProductForm from './SubmitProductForm'
import { getCategories } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Submit a Product',
  description: 'File a submission to the IndianVCs desk — a tool worth listing on the paper.',
  alternates: { canonical: '/vc-stack/submit-product' },
}

export default async function SubmitProductPage() {
  const categories = await getCategories()
  return (
    <div className="page" style={{ padding: '24px 24px 64px', maxWidth: 720 }}>
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
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 10,
          }}
        >
          Submissions
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.05,
          }}
        >
          File a Submission
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            color: 'var(--ink-light)',
            marginTop: 14,
            fontStyle: 'italic',
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Know a tool that belongs on the paper? Send it to the editors — we review
          new entries within 48 hours and run them in the next edition.
        </p>
      </header>

      <SubmitProductForm categories={categories} />
    </div>
  )
}
