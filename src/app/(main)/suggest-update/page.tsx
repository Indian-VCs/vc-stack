import type { Metadata } from 'next'
import Link from 'next/link'
import SuggestUpdateForm from './SuggestUpdateForm'
import { getAllTools } from '@/lib/data'
import { publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Suggest an update',
  description:
    'Spotted something off on a tool page? Tell us what should change — pricing, features, broken links, or anything else.',
  alternates: { canonical: publicUrl('/suggest-update') },
  // Soft-noindex: the page is useful but a thin transactional form. Leaving
  // it indexable but low priority via the sitemap entry.
}

interface Props {
  searchParams: Promise<{ tool?: string }>
}

export default async function SuggestUpdatePage({ searchParams }: Props) {
  const { tool } = await searchParams
  const allTools = await getAllTools()
  const tools = allTools
    .map((t) => ({ slug: t.slug, name: t.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const defaultToolSlug =
    tool && tools.some((t) => t.slug === tool) ? tool : undefined

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Suggest an update</span>
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
          Suggest an update
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
          Spotted something off on a tool page? Pricing wrong, a feature
          missing, a broken link, copy that needs a refresh — let us know.
          Suggestions land directly with the editorial team.
        </p>
      </header>

      <div style={{ maxWidth: 720 }}>
        <SuggestUpdateForm tools={tools} defaultToolSlug={defaultToolSlug} />
      </div>
    </div>
  )
}
