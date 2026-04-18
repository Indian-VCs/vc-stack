import PageLayout from '@/components/layout/PageLayout'
import CategoryCard from '@/components/cards/CategoryCard'
import NewsletterForm from '@/components/ui/NewsletterForm'
import HeroFeaturedTool from '@/components/ui/HeroFeaturedTool'
import MarketMapPoster from '@/components/ui/MarketMapPoster'
import Link from 'next/link'
import {
  getCategories,
  getFeaturedTools,
  getCategoryPreviewTools,
  getAllTools,
  getCanonicalStats,
} from '@/lib/data'

export const revalidate = 3600

export default async function HomePage() {
  const [categories, featuredTools, previewToolsMap, allTools, stats] = await Promise.all([
    getCategories(),
    getFeaturedTools(20),
    getCategoryPreviewTools(),
    getAllTools(),
    getCanonicalStats(),
  ])

  return (
    <PageLayout>
      {/* ── Hero (two-column 50/50: copy + featured tool card) ── */}
      <section
        className="page hero-grid"
        style={{
          padding: '28px 24px 28px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
              lineHeight: 1.05,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              margin: '0 0 18px',
            }}
          >
            The Indian VC tech stack.
          </h1>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: '1.15rem',
              lineHeight: 1.5,
              color: 'var(--ink-light)',
              maxWidth: 460,
              margin: 0,
            }}
          >
            Browse {stats.totalTools} tools across {stats.totalCategories} categories — from sourcing and research to portfolio ops and back office.
          </p>
        </div>
        <div>
          <HeroFeaturedTool tools={featuredTools} />
        </div>

        <style>{`
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            align-items: center;
          }
          @media (min-width: 860px) {
            .hero-grid {
              grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
              gap: 48px;
            }
          }
        `}</style>
      </section>

      {/* ── Market Map (Tech Stack 2026 poster) ─────────────────── */}
      <section className="page" style={{ padding: '48px 24px 48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 16,
            flexWrap: 'wrap',
            borderTop: '2px solid var(--ink)',
            paddingTop: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: 'var(--fs-hero)',
              color: 'var(--ink)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            The Market Map
          </h2>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 'var(--fs-body)',
              color: 'var(--ink-muted)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Every tool, grouped by section. Click any entry for the full report.
          </p>
        </div>
        <MarketMapPoster tools={allTools} categories={categories} />
      </section>

      {/* ── Browse by Category ──────────────────────────────────── */}
      <section className="page" style={{ padding: '12px 24px 48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '2px solid var(--ink)',
            paddingTop: 20,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: 'var(--fs-hero)',
              color: 'var(--ink)',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Browse by Category
          </h2>
          <Link href="/all-categories" className="btn btn--ghost">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ gap: 0 }}>
          {categories.map((cat, i) => (
            <div key={cat.id} style={{ marginLeft: -1, marginTop: -1 }}>
              <CategoryCard
                category={cat}
                variant="default"
                previewTools={previewToolsMap[cat.slug] ?? []}
                index={i}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter / The Dispatch ───────────────────────────── */}
      <section className="page" style={{ padding: '0 24px 60px' }}>
        <div
          style={{
            border: '2px solid var(--ink)',
            padding: 32,
            display: 'grid',
            gap: 24,
          }}
          className="md:grid-cols-[1fr_auto]"
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--red)',
                marginBottom: 8,
              }}
            >
              The Dispatch · Weekly edition
            </div>
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: '1.8rem',
                color: 'var(--ink)',
                marginBottom: 8,
              }}
            >
              Opinionated takes on the tools Indian VCs actually use.
            </h3>
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: 'var(--fs-body)',
                color: 'var(--ink-light)',
                maxWidth: 520,
              }}
            >
              One well-argued piece every Monday. Which CRM we'd pick for a seed fund,
              which research tools survive diligence, and the judgments behind the stack.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
