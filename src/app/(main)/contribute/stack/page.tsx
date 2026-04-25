import type { Metadata } from 'next'
import Link from 'next/link'
import StackContributionForm from './StackContributionForm'
import { getAllTools } from '@/lib/data'
import { publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: "Share your firm's stack",
  description:
    'Tell us which tools your VC firm actually uses. We curate the best submissions into firm-profile pages.',
  alternates: { canonical: publicUrl('/contribute/stack') },
}

export default async function ContributeStackPage() {
  const tools = await getAllTools()

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Share your stack</span>
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
          Share your firm&apos;s stack
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
          Tell us which tools your firm actually runs on — pick from the
          catalog, add a line on how you use them. Editors curate the best
          submissions into firm-profile pages.
        </p>
      </header>

      <div style={{ maxWidth: 820 }}>
        <StackContributionForm tools={tools} />
      </div>
    </div>
  )
}
