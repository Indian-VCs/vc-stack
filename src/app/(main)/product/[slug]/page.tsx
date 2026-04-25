import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getToolBySlug, getFeaturedToolsExcluding } from '@/lib/data'
import { OG_IMAGE_SIZE, categoryUrl as buildCategoryUrl, ogImageUrl, publicUrl, toolUrl as buildToolUrl } from '@/lib/site'
import LogoCard from '@/components/ui/LogoCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return {}
  const path = `/product/${tool.slug}`
  const url = buildToolUrl(tool.slug)
  const description = tool.shortDesc ?? tool.description.slice(0, 160)
  const title = `${tool.name} — ${tool.category?.name ?? 'Tool'} for VCs`
  const imageUrl = ogImageUrl(`${path}/og-image`)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Indian VCs',
      type: 'article',
      locale: 'en_IN',
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: `${tool.name} on VC Stack`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@indianvcs',
      images: [imageUrl],
    },
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  const spotlight = await getFeaturedToolsExcluding(tool.slug)
  const FEATURED_CAP = 5
  const spotlightShown = spotlight.slice(0, FEATURED_CAP)
  const spotlightOverflow = Math.max(0, spotlight.length - FEATURED_CAP)

  // Structured data: SoftwareApplication + BreadcrumbList
  const toolPageUrl = buildToolUrl(tool.slug)
  const parentCategoryUrl = tool.category
    ? buildCategoryUrl(tool.category.slug)
    : undefined
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${toolPageUrl}#software`,
        name: tool.name,
        description: tool.description,
        url: tool.websiteUrl,
        applicationCategory: tool.category?.name ?? 'BusinessApplication',
        ...(tool.logoUrl ? { image: tool.logoUrl } : {}),
        offers: {
          '@type': 'Offer',
          category:
            tool.pricingModel === 'FREE'
              ? 'Free'
              : tool.pricingModel === 'FREEMIUM'
                ? 'Freemium'
                : tool.pricingModel === 'ENTERPRISE'
                  ? 'Enterprise'
                  : 'Paid',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: publicUrl('/'),
          },
          ...(tool.category && parentCategoryUrl
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: tool.category.name,
                  item: parentCategoryUrl,
                },
              ]
            : []),
          {
            '@type': 'ListItem',
            position: tool.category ? 3 : 2,
            name: tool.name,
            item: toolPageUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <Script
        id={`tool-jsonld-${tool.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
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

      {/* ── Article header — single row: logo · name · visit · category ── */}
      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '22px 0',
        }}
      >
        <div className="tool-head-row">
          <div className="hero-enter" style={{ animationDelay: '0ms' }}>
            <LogoCard name={tool.name} logoUrl={tool.logoUrl} size="lg" />
          </div>
          <h1 className="tool-head-name hero-enter" style={{ animationDelay: '80ms' }}>
            {tool.name}
          </h1>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tool-head-visit hero-enter"
            style={{ animationDelay: '200ms' }}
          >
            Visit Website ↗
          </a>
          {tool.category && (
            <Link
              href={`/category/${tool.category.slug}`}
              className="tool-head-cat hero-enter"
              style={{ animationDelay: '280ms' }}
            >
              {tool.category.name}
            </Link>
          )}
          {tool.isFeatured && (
            <span
              className="tool-head-featured hero-enter"
              style={{ animationDelay: '320ms' }}
            >
              Featured
            </span>
          )}
        </div>

        <style>{`
          .tool-head-row {
            display: flex;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
          }
          .tool-head-name {
            font-family: var(--serif);
            font-weight: 900;
            font-size: clamp(1.4rem, 5vw, 2.6rem);
            line-height: 1.1;
            color: var(--ink);
            letter-spacing: -0.01em;
            margin: 0;
            flex: 1 1 auto;
            min-width: 0;
            word-break: break-word;
          }
          .tool-head-visit {
            font-family: var(--mono);
            font-size: var(--fs-tag);
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--paper);
            background: var(--red);
            border: 1px solid var(--red);
            padding: 7px 12px;
            text-decoration: none;
            white-space: nowrap;
            flex-shrink: 0;
            transition: background var(--dur-fast), border-color var(--dur-fast);
          }
          .tool-head-visit:hover {
            background: var(--red-dark);
            border-color: var(--red-dark);
          }
          .tool-head-cat {
            font-family: var(--mono);
            font-size: var(--fs-tag);
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--ink);
            background: var(--paper-alt);
            border: 1px solid var(--rule);
            padding: 7px 12px;
            text-decoration: none;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .tool-head-cat:hover {
            border-color: var(--ink);
          }
          .tool-head-featured {
            font-family: var(--mono);
            font-size: var(--fs-tag);
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--red);
            background: var(--paper);
            border: 1px solid var(--red);
            padding: 7px 12px;
            white-space: nowrap;
            flex-shrink: 0;
          }
          @media (max-width: 640px) {
            .tool-head-row { gap: 12px; }
            .tool-head-visit,
            .tool-head-cat,
            .tool-head-featured {
              flex: 1 1 auto;
              text-align: center;
            }
          }
        `}</style>
      </header>

      {/* ── Description (full width, compact section, larger font) ─── */}
      <article style={{ marginTop: 28, marginBottom: 32 }}>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.125rem',
            color: 'var(--ink)',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            margin: 0,
          }}
        >
          {tool.description}
        </p>
      </article>

      {/* ── Popular use cases ─────────────────────────────────────── */}
      {tool.useCases && tool.useCases.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="section-header">Popular use cases</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {tool.useCases.map((uc, i) => (
              <li
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '18px 1fr',
                  alignItems: 'start',
                  gap: 10,
                  fontFamily: 'var(--body)',
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  color: 'var(--ink)',
                }}
              >
                <span style={{ color: 'var(--red)', fontWeight: 700, lineHeight: 1.55 }}>·</span>
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Featured Tools — inline logo+name links (excludes current tool) ── */}
      {spotlight.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px 10px',
            paddingTop: 20,
            borderTop: '1px solid var(--rule)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 'var(--fs-tag)',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--ink-muted)',
              marginRight: 4,
            }}
          >
            Featured Tools:
          </span>
          {spotlightShown.map((t, i) => (
            <span
              key={t.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--body)',
                fontSize: 'var(--fs-body)',
              }}
            >
              <Link
                href={`/product/${t.slug}`}
                className="ft-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  transition: 'color 160ms ease',
                }}
              >
                {t.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.logoUrl}
                    alt=""
                    style={{
                      width: 14,
                      height: 14,
                      objectFit: 'contain',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span className="ft-link-name">{t.name}</span>
              </Link>
              {(i < spotlightShown.length - 1 || spotlightOverflow > 0) && (
                <span style={{ color: 'var(--ink-muted)', marginLeft: 4 }}>·</span>
              )}
            </span>
          ))}
          {spotlightOverflow > 0 && (
            <Link
              href="/all-categories"
              className="ft-link"
              style={{
                fontFamily: 'var(--body)',
                fontSize: 'var(--fs-body)',
                color: 'var(--ink-muted)',
                textDecoration: 'none',
              }}
            >
              +{spotlightOverflow}
            </Link>
          )}
          <style>{`
            .ft-link:hover { color: var(--red); }
            .ft-link-name {
              border-bottom: 1px solid var(--rule);
              padding-bottom: 1px;
              transition: border-color 160ms ease;
            }
            .ft-link:hover .ft-link-name { border-color: var(--red); }
          `}</style>
        </div>
      )}
    </div>
  )
}
