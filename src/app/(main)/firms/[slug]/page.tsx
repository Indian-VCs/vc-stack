import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FIRMS } from '@/lib/resources-data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return FIRMS.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const firm = FIRMS.find((f) => f.slug === slug)
  if (!firm) return {}
  return {
    title: `${firm.name} Stack — IndianVCs`,
    description: `See the ${firm.tools.length} tools ${firm.name} uses: ${firm.tools.map((t) => t.name).join(', ')}.`,
  }
}

export default async function FirmPage({ params }: Props) {
  const { slug } = await params
  const firm = FIRMS.find((f) => f.slug === slug)
  if (!firm) notFound()

  return (
    <div className="page" style={{ padding: '24px 24px 48px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>{firm.name}</span>
      </div>

      {/* Header */}
      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '24px 0',
          marginBottom: 32,
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
          Field Report · {firm.location}
        </div>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: '1fr',
            alignItems: 'center',
          }}
          className="sm:grid-cols-[auto_1fr]"
        >
          <div
            style={{
              width: 120,
              height: 120,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={firm.logo}
              alt={firm.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: 'var(--fs-name)',
                color: 'var(--ink)',
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {firm.name}
            </h1>
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: '1rem',
                color: 'var(--ink-light)',
                marginBottom: 16,
                maxWidth: 640,
                lineHeight: 1.5,
              }}
            >
              {firm.description}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Visit website ↗
              </a>
              {firm.twitter && (
                <a href={firm.twitter} target="_blank" rel="noopener noreferrer" className="btn">
                  Twitter
                </a>
              )}
              {firm.linkedin && (
                <a href={firm.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tools */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-hero)',
            color: 'var(--ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}
        >
          Their Stack
        </h2>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-muted)',
          }}
        >
          {firm.tools.length} tools
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 0 }}>
        {firm.tools.map((tool, i) => (
          <Link
            key={`${tool.name}-${i}`}
            href={tool.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              textDecoration: 'none',
              marginLeft: -1,
              marginTop: -1,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                border: '1px solid var(--rule)',
                padding: 4,
                background: 'var(--paper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src={tool.logo}
                alt={tool.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'var(--fs-result)',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {tool.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--fs-tag)',
                  color: 'var(--ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {tool.category}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
