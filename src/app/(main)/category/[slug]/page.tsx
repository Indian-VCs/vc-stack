import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getCategoryBySlug, getToolsByCategory, getCategories } from '@/lib/data'
import ToolCard from '@/components/cards/ToolCard'
import CategoryControls from '@/components/ui/CategoryControls'
import Pagination from '@/components/ui/Pagination'
import CategoryIntro from '@/components/category/CategoryIntro'
import BuyingCriteria from '@/components/category/BuyingCriteria'
import TopPicks from '@/components/category/TopPicks'
import CategoryFAQ from '@/components/category/CategoryFAQ'
import RelatedCategories from '@/components/category/RelatedCategories'
import RevealStagger from '@/components/ui/RevealStagger'
import type { PricingModel, SortOrder } from '@/lib/types'

const VALID_PRICING = new Set(['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE'])
const VALID_SORT = new Set<SortOrder>(['featured', 'alpha', 'reviews'])

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; pricing?: string; sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  const path = `/vc-stack/category/${category.slug}`
  const url = `https://www.indianvcs.com${path}`
  const count = category._count?.tools ?? 0
  // pSEO overrides come first; fall back to the count-based template.
  const title = category.seoTitle ?? `${category.name} Tools for VCs — ${count}+ curated`
  const description =
    category.seoDescription ??
    category.heroAngle ??
    category.description ??
    `Browse ${count} ${category.name} tools used by Indian venture capital firms.`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Indian VCs',
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: '@indianvcs',
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
  const { page: pageStr, pricing: pricingStr, sort: sortStr } = await searchParams
  const rawPage = Number(pageStr ?? 1)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1
  const pricing = VALID_PRICING.has(pricingStr ?? '')
    ? (pricingStr as PricingModel)
    : ''
  const sort: SortOrder = VALID_SORT.has(sortStr as SortOrder)
    ? (sortStr as SortOrder)
    : 'featured'

  const [category, result, unfilteredResult] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug, { page, pageSize: 24, pricing, sort }),
    // When filtered, we also fetch the unfiltered count to show "N of M".
    // Skipped when no filter applied (same total either way).
    pricing
      ? getToolsByCategory(slug, { page: 1, pageSize: 1, sort })
      : Promise.resolve(null),
  ])

  if (!category) notFound()

  const { data: tools, total, totalPages } = result
  const totalUnfiltered = unfilteredResult?.total ?? total

  const allCategories = category.faqs || category.relatedSlugs ? await getCategories() : []

  const categoryUrl = `https://www.indianvcs.com/vc-stack/category/${category.slug}`
  type JsonLdNode = Record<string, unknown>
  const graph: JsonLdNode[] = [
    {
      '@type': 'CollectionPage',
      '@id': `${categoryUrl}#page`,
      url: categoryUrl,
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
          url: `https://www.indianvcs.com/vc-stack/product/${t.slug}`,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.indianvcs.com/vc-stack' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'All Categories',
          item: 'https://www.indianvcs.com/vc-stack/all-categories',
        },
        { '@type': 'ListItem', position: 3, name: category.name, item: categoryUrl },
      ],
    },
  ]
  if (category.faqs && category.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: category.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }
  const jsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <div className="page" style={{ padding: '24px 24px 48px' }}>
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
        <div
          className="hero-enter"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 8,
            animationDelay: '0ms',
          }}
        >
          Section · {category.slug}
        </div>
        <h1
          className="hero-enter"
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            lineHeight: 1.1,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            animationDelay: '80ms',
          }}
        >
          {category.name}
        </h1>
        {(category.heroAngle ?? category.description) && (
          <p
            className="hero-enter"
            style={{
              fontFamily: 'var(--body)',
              fontSize: '1rem',
              lineHeight: 1.5,
              color: 'var(--ink-light)',
              marginTop: 10,
              maxWidth: 760,
              fontStyle: 'italic',
              animationDelay: '160ms',
            }}
          >
            {category.heroAngle ?? category.description}
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
            animationDelay: '240ms',
          }}
        >
          {totalUnfiltered} {totalUnfiltered === 1 ? 'tool' : 'tools'} in this beat
        </div>
      </header>

      {/* pSEO sections — silently skip when the category has no content */}
      <CategoryIntro intro={category.intro} />
      <BuyingCriteria criteria={category.buyingCriteria} categoryName={category.name} />
      <TopPicks picks={category.topPicks} tools={tools} categoryName={category.name} />

      <CategoryControls
        basePath={`/category/${slug}`}
        pricing={pricing}
        sort={sort}
        filteredCount={total}
        totalCount={totalUnfiltered}
      />

      {/* Subcategory tabs */}
      {category.subCategories && category.subCategories.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <Link href={`/category/${slug}`} className="tag tag--accent">
            All
          </Link>
          {category.subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${slug}?sub=${sub.slug}`}
              className="tag"
              style={{ textDecoration: 'none' }}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {tools.length === 0 ? (
        <div className="empty">
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 10 }}>
            {pricing
              ? `No ${pricing.toLowerCase()} tools in this beat yet.`
              : 'No tools in this beat yet.'}
          </p>
          {pricing && (
            <Link href={`/category/${slug}`} className="btn btn--ghost">
              Clear filter
            </Link>
          )}
        </div>
      ) : (
        <>
          <RevealStagger className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool, i) => (
              <div key={tool.id} style={{ marginLeft: -1, marginTop: -1 }}>
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </RevealStagger>

          <Pagination
            page={page}
            totalPages={totalPages}
            hrefFor={(p) => {
              const qs = new URLSearchParams()
              if (pricing) qs.set('pricing', pricing)
              if (sort !== 'featured') qs.set('sort', sort)
              if (p !== 1) qs.set('page', String(p))
              const str = qs.toString()
              return str ? `/category/${slug}?${str}` : `/category/${slug}`
            }}
          />
        </>
      )}

      <CategoryFAQ faqs={category.faqs} categoryName={category.name} />
      <RelatedCategories
        relatedSlugs={category.relatedSlugs}
        allCategories={allCategories}
        currentSlug={category.slug}
      />
    </div>
  )
}
