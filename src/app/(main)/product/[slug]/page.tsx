import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getToolBySlug, getRelatedTools } from '@/lib/data'
import LogoCard from '@/components/ui/LogoCard'
import ToolsCarousel from '@/components/ui/ToolsCarousel'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.shortDesc ?? tool.description.slice(0, 160),
  }
}

const PRICING_LABELS: Record<string, string> = {
  FREE: 'Free',
  FREEMIUM: 'Freemium',
  PAID: 'Paid',
  ENTERPRISE: 'Enterprise',
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const recommended = await getRelatedTools(tool.id, tool.categoryId, 10)

  return (
    <div className="page" style={{ padding: '24px 24px 48px' }}>
      {/* Single breadcrumb at the top */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {tool.category && (
          <>
            <span className="sep">·</span>
            <Link href={`/category/${tool.category.slug}`}>{tool.category.name}</Link>
          </>
        )}
        <span className="sep">·</span>
        <span>{tool.name}</span>
      </nav>

      {/* ── Article header ────────────────────────────────────────── */}
      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '24px 0 24px',
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <LogoCard name={tool.name} logoUrl={tool.logoUrl} size="lg" style={{ position: 'relative' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 900,
                  fontSize: 'var(--fs-name)',
                  lineHeight: 1.1,
                  color: 'var(--ink)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {tool.name}
              </h1>
              {tool.category && (
                <Link
                  href={`/category/${tool.category.slug}`}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 'var(--fs-tag)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ink)',
                    background: 'var(--paper-alt)',
                    border: '1px solid var(--rule)',
                    padding: '5px 10px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {tool.category.name}
                </Link>
              )}
            </div>
            {tool.shortDesc && (
              <p
                style={{
                  fontFamily: 'var(--body)',
                  fontSize: '1.05rem',
                  color: 'var(--ink-light)',
                  fontStyle: 'italic',
                  maxWidth: 720,
                  lineHeight: 1.5,
                  marginTop: 10,
                  marginBottom: 0,
                }}
              >
                {tool.shortDesc}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Body + Sidebar ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gap: 48 }} className="lg:grid-cols-[1fr_280px]">
        {/* Description */}
        <div>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: '1rem',
              color: 'var(--ink)',
              lineHeight: 1.65,
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {tool.description}
          </p>
        </div>

        {/* Sidebar — At a glance */}
        <aside>
          <div
            style={{
              padding: 16,
              border: '1px solid var(--ink)',
              background: 'var(--paper-dark)',
            }}
          >
            <div className="section-header">At a glance</div>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary w-full justify-center"
              style={{ marginBottom: 16 }}
            >
              Visit {tool.name} ↗
            </a>
            <dl style={{ fontFamily: 'var(--body)', fontSize: 'var(--fs-body)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--rule)',
                }}
              >
                <dt style={{ color: 'var(--ink-muted)' }}>Pricing</dt>
                <dd style={{ color: 'var(--ink)', fontWeight: 600 }}>
                  {PRICING_LABELS[tool.pricingModel] ?? tool.pricingModel}
                </dd>
              </div>
              {tool.category && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <dt style={{ color: 'var(--ink-muted)' }}>Category</dt>
                  <dd>
                    <Link
                      href={`/category/${tool.category.slug}`}
                      style={{ color: 'var(--ink)', fontWeight: 600 }}
                    >
                      {tool.category.name}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      {/* ── Recommended Tools ───────────────────────────────────── */}
      {recommended.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <ToolsCarousel tools={recommended} title="Recommended Tools" />
        </div>
      )}
    </div>
  )
}
