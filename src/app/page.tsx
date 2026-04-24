import PageLayout from '@/components/layout/PageLayout'
import CategoryCard from '@/components/cards/CategoryCard'
import SubstackEmbed from '@/components/ui/SubstackEmbed'
import HeroFeaturedTool from '@/components/ui/HeroFeaturedTool'
import HeroSearchCTA from '@/components/ui/HeroSearchCTA'
import MarketMapPoster from '@/components/ui/MarketMapPoster'
import FaqSection from '@/components/ui/FaqSection'
import Link from 'next/link'
import {
  getCategories,
  getCategoryPreviewTools,
  getAllTools,
  getCanonicalFeaturedTools,
  getCanonicalStats,
} from '@/lib/data'

export const revalidate = 3600

export default async function HomePage() {
  const [categories, previewToolsMap, allTools, heroRotation, stats] = await Promise.all([
    getCategories(),
    getCategoryPreviewTools(),
    getAllTools(),
    getCanonicalFeaturedTools(),
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
              fontSize: 'clamp(1.9rem, 3.4vw, 2.9rem)',
              lineHeight: 1.05,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
            }}
          >
            The Indian VC{' '}
            <span style={{ color: 'var(--red)' }}>tech stack.</span>
          </h1>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              color: 'var(--ink-light)',
              maxWidth: 520,
              margin: '0 0 24px',
            }}
          >
            Browse {stats.totalTools} tools across {stats.totalCategories} categories — from sourcing and research to portfolio ops and back office.
          </p>

          {/* Primary CTA — search + browse */}
          <HeroSearchCTA totalTools={stats.totalTools} />

          {/* Inline newsletter embed — secondary CTA below the fold of the hero */}
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--ink-muted)',
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              The Dispatch · Weekly
            </div>
            <SubstackEmbed wide />
          </div>
        </div>
        <div>
          <HeroFeaturedTool tools={heroRotation} />
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
              grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
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
            paddingTop: 4,
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
      <section className="page" style={{ padding: '12px 24px 48px', borderTop: '1px solid var(--rule)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: 24,
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

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <FaqSection />

    </PageLayout>
  )
}
