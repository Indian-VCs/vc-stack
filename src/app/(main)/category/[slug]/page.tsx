import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getCategoryBySlug, getToolsByCategory, getCategories } from '@/lib/data'
import { OG_IMAGE_SIZE, categoryUrl as buildCategoryUrl, ogImageUrl, publicUrl, toolUrl as buildToolUrl } from '@/lib/site'
import ToolCard from '@/components/cards/ToolCard'
import Pagination from '@/components/ui/Pagination'
import CategoryIntro from '@/components/category/CategoryIntro'
import BuyingCriteria from '@/components/category/BuyingCriteria'
import Journey from '@/components/category/Journey'
import Pitfalls from '@/components/category/Pitfalls'
import ReadingList from '@/components/category/ReadingList'
import RelatedCategories from '@/components/category/RelatedCategories'
import RevealStagger from '@/components/ui/RevealStagger'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  const path = `/category/${category.slug}`
  const url = buildCategoryUrl(category.slug)
  const count = category._count?.tools ?? 0
  const title = category.seoTitle ?? `${category.name} Tools for VCs — ${count}+ curated`
  const description =
    category.seoDescription ??
    category.heroAngle ??
    category.description ??
    `Browse ${count} ${category.name} tools used by Indian venture capital firms.`
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
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: `${category.name} tools on VC Stack`,
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

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export const revalidate = 3600

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const rawPage = Number(pageStr ?? 1)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug, { page, pageSize: 24 }),
  ])

  if (!category) notFound()

  const { data: tools, total, totalPages, page: currentPage } = result
  const allCategories = category.relatedSlugs ? await getCategories() : []
  const hasAccordionContent = Boolean(
    category.intro ||
      (category.buyingCriteria && category.buyingCriteria.length > 0) ||
      category.journey ||
      (category.pitfalls && category.pitfalls.length > 0) ||
      (category.readingList && category.readingList.length > 0),
  )

  const categoryPageUrl = buildCategoryUrl(category.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${categoryPageUrl}#page`,
        url: categoryPageUrl,
        name: `${category.name} tools for VCs`,
        description:
          category.heroAngle ??
          category.description ??
          `Curated ${category.name} tools used by Indian venture capital firms.`,
        isPartOf: { '@id': 'https://www.indianvcs.com/#website' },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: total,
          itemListElement: tools.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.name,
            url: buildToolUrl(t.slug),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: publicUrl('/') },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'All Categories',
            item: publicUrl('/all-categories'),
          },
          { '@type': 'ListItem', position: 3, name: category.name, item: categoryPageUrl },
        ],
      },
    ],
  }

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <Script
        id={`category-jsonld-${category.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <Link href="/all-categories">Categories</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>{category.name}</span>
      </div>

      {/* ── Section header (broadsheet) ───────────────────────────── */}
      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 28,
        }}
      >
        <h1
          className="hero-enter"
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'clamp(1.7rem, 6vw, 2.6rem)',
            lineHeight: 1.1,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            animationDelay: '0ms',
          }}
        >
          {category.name}
        </h1>
        {(category.description ?? category.heroAngle) && (
          <p
            className="hero-enter"
            style={{
              fontFamily: 'var(--body)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--ink-light)',
              marginTop: 12,
              maxWidth: 760,
              animationDelay: '120ms',
            }}
          >
            {category.description ?? category.heroAngle}
          </p>
        )}
        <div
          className="hero-enter"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-muted)',
            marginTop: 14,
            animationDelay: '200ms',
          }}
        >
          {total} {total === 1 ? 'tool' : 'tools'} in this beat
        </div>
      </header>

      {/* ── Tools grid (top of page) ──────────────────────────────── */}
      {tools.length === 0 ? (
        <div className="empty">
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 10 }}>
            No tools in this beat yet.
          </p>
        </div>
      ) : (
        <>
          <RevealStagger className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <div key={tool.id} style={{ marginLeft: -1, marginTop: -1 }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </RevealStagger>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            hrefFor={(p) => (p === 1 ? `/category/${slug}` : `/category/${slug}?page=${p}`)}
          />
        </>
      )}

      {/* ── Accordion: Brief + What to look for (below tools) ─────── */}
      {hasAccordionContent && (
        <section className="cat-accordion">
          <div className="cat-accordion-header">About this category</div>
          {category.intro && (
            <details className="cat-accordion-item">
              <summary>
                <span>The Brief</span>
                <span aria-hidden="true" className="cat-accordion-icon">+</span>
              </summary>
              <div className="cat-accordion-body">
                <CategoryIntro intro={category.intro} />
              </div>
            </details>
          )}
          {category.journey && (
            <details className="cat-accordion-item">
              <summary>
                <span>How to approach this stack</span>
                <span aria-hidden="true" className="cat-accordion-icon">+</span>
              </summary>
              <div className="cat-accordion-body">
                <Journey journey={category.journey} />
              </div>
            </details>
          )}
          {category.buyingCriteria && category.buyingCriteria.length > 0 && (
            <details className="cat-accordion-item">
              <summary>
                <span>What to look for when buying</span>
                <span aria-hidden="true" className="cat-accordion-icon">+</span>
              </summary>
              <div className="cat-accordion-body">
                <BuyingCriteria
                  criteria={category.buyingCriteria}
                  categoryName={category.name}
                />
              </div>
            </details>
          )}
          {category.pitfalls && category.pitfalls.length > 0 && (
            <details className="cat-accordion-item">
              <summary>
                <span>Common pitfalls</span>
                <span aria-hidden="true" className="cat-accordion-icon">+</span>
              </summary>
              <div className="cat-accordion-body">
                <Pitfalls
                  pitfalls={category.pitfalls}
                  categoryName={category.name}
                />
              </div>
            </details>
          )}
          {category.readingList && category.readingList.length > 0 && (
            <details className="cat-accordion-item">
              <summary>
                <span>Further reading</span>
                <span aria-hidden="true" className="cat-accordion-icon">+</span>
              </summary>
              <div className="cat-accordion-body">
                <ReadingList items={category.readingList} />
              </div>
            </details>
          )}

          <style>{`
            .cat-accordion {
              margin-top: 48px;
              border-top: 2px solid var(--ink);
              padding-top: 4px;
            }
            .cat-accordion-header {
              font-family: var(--mono);
              font-size: var(--fs-tag);
              letter-spacing: 0.24em;
              text-transform: uppercase;
              color: var(--ink-muted);
              padding: 14px 0 6px;
            }
            .cat-accordion-item {
              border-top: 1px solid var(--rule);
            }
            .cat-accordion-item:last-child {
              border-bottom: 1px solid var(--rule);
            }
            .cat-accordion-item summary {
              list-style: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 18px 2px;
              font-family: var(--serif);
              font-weight: 700;
              font-size: 1.15rem;
              color: var(--ink);
              letter-spacing: -0.005em;
              transition: color var(--dur-fast);
            }
            .cat-accordion-item summary::-webkit-details-marker { display: none; }
            .cat-accordion-item summary:hover { color: var(--red); }
            .cat-accordion-icon {
              font-family: var(--mono);
              font-size: 1rem;
              color: var(--ink-muted);
              transition: transform var(--dur-fast);
            }
            .cat-accordion-item[open] summary { color: var(--red); }
            .cat-accordion-item[open] .cat-accordion-icon { transform: rotate(45deg); }
            .cat-accordion-body {
              padding-bottom: 8px;
            }
            /* Neutralise the nested section margins so they sit inside the accordion panel cleanly. */
            .cat-accordion-body > section {
              border: 0 !important;
              margin: 0 !important;
              padding: 4px 0 20px !important;
            }
            @media (max-width: 640px) {
              .cat-accordion-item summary {
                font-size: 1rem;
                padding: 16px 2px;
                gap: 12px;
              }
            }
          `}</style>
        </section>
      )}

      <RelatedCategories
        relatedSlugs={category.relatedSlugs}
        allCategories={allCategories}
        currentSlug={category.slug}
      />
    </div>
  )
}
