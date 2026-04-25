/* eslint-disable @next/next/no-img-element -- next/og ImageResponse renders remote logos with raw img tags. */
import { ImageResponse } from 'next/og'
import {
  getAllTools,
  getCanonicalStats,
  getCategories,
  getCategoryBySlug,
  getToolBySlug,
  getToolsByCategory,
} from '@/lib/data'
import { OG_IMAGE_SIZE } from '@/lib/site'
import type { Tool } from '@/lib/types'

function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: size,
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#1a1410',
      }}
    >
      <span>Indian</span>
      <div
        style={{
          display: 'flex',
          width: size === 36 ? 60 : 44,
          height: size === 36 ? 8 : 6,
          background: '#D21905',
          margin: size === 36 ? '0 18px' : '0 14px',
        }}
      />
      <span>VCs</span>
    </div>
  )
}

function FallbackImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F0E8',
          fontFamily: 'serif',
          fontSize: 48,
          color: '#1a1410',
        }}
      >
        Indian VCs
      </div>
    ),
    OG_IMAGE_SIZE,
  )
}

// ── Site OG: market-map poster ─────────────────────────────────────────
// Matches the homepage `MarketMapPosterMini` aesthetic — same 5-column
// landscape, dark category-header bars, tool pills. Uses initial badges
// instead of remote logo fetches so Satori renders fast.

const LEFT_COLS_OG: string[][] = [
  ['ai', 'mailing', 'calendar', 'admin-ops', 'productivity'],
  ['crm', 'research', 'browser'],
  ['data', 'communication', 'portfolio-management', 'vibe-coding'],
]
const RIGHT_TOP_COLS_OG: string[][] = [
  ['transcription', 'voice-to-text'],
  ['news'],
]
const RIGHT_BOTTOM_STACK_OG: string[] = ['automation', 'other-tools']
const WIDE_PILL_CATS_OG: Record<string, number> = {
  'automation': 3,
  'other-tools': 3,
}

const FALLBACK_SHADES_OG = [
  '#1a1410', '#2f271f', '#3a322a', '#524a3c',
  '#5a4731', '#6b5a3f', '#a41204', '#d21905',
]

function shadeFor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return FALLBACK_SHADES_OG[Math.abs(h) % FALLBACK_SHADES_OG.length]
}

function initialsFor(name: string): string {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

function PillOG({ tool }: { tool: Tool }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        border: '1px solid #c8bfb0',
        borderRadius: 3,
        padding: '2px 4px',
        background: '#F5F0E8',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 12,
          background: shadeFor(tool.name),
          color: '#F5F0E8',
          fontSize: 7,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initialsFor(tool.name)}
      </div>
      <div
        style={{
          fontSize: 9,
          fontWeight: 500,
          color: '#1a1410',
          lineHeight: 1,
          overflow: 'hidden',
        }}
      >
        {tool.name.length > 11 ? `${tool.name.slice(0, 10)}…` : tool.name}
      </div>
    </div>
  )
}

function CardOG({
  name,
  tools,
  pillCols = 2,
}: {
  name: string
  tools: Tool[]
  pillCols?: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#F5F0E8',
        border: '1px solid #1a1410',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#1a1410',
          padding: '3px 6px',
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#F5F0E8',
            textTransform: 'uppercase',
          }}
        >
          {name}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          padding: '4px 5px 5px',
          background: '#ede7db',
        }}
      >
        {tools.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              width: `calc((100% - ${(pillCols - 1) * 3}px) / ${pillCols})`,
            }}
          >
            <PillOG tool={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

export async function renderSiteOgImage() {
  const [categories, tools, stats] = await Promise.all([
    getCategories(),
    getAllTools(),
    getCanonicalStats(),
  ])

  // Group tools by category slug, mirroring MarketMapPoster.
  const bySlug: Record<string, Tool[]> = {}
  const slugToName: Record<string, string> = {}
  for (const c of categories) slugToName[c.slug] = c.name
  for (const t of tools) {
    const all = [t.category?.slug, ...(t.extraCategorySlugs ?? [])].filter(Boolean) as string[]
    for (const slug of all) {
      if (!bySlug[slug]) bySlug[slug] = []
      bySlug[slug].push(t)
    }
  }
  Object.values(bySlug).forEach((list) =>
    list.sort((a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
    ),
  )

  const renderCard = (slug: string) => {
    const list = bySlug[slug]
    if (!list || list.length === 0) return null
    return (
      <CardOG
        key={slug}
        name={slugToName[slug] || slug}
        tools={list}
        pillCols={WIDE_PILL_CATS_OG[slug] ?? 2}
      />
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FBE2D6',
          padding: '24px 32px',
          fontFamily: 'serif',
        }}
      >
        {/* Header strip — kicker + masthead title */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#D21905',
                marginBottom: 4,
              }}
            >
              The Market Map · 2026 Edition
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 44,
                fontWeight: 900,
                color: '#1a1410',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              <span>The Indian VC&nbsp;</span>
              <span style={{ color: '#D21905' }}>tech stack.</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#524a3c',
              paddingBottom: 6,
            }}
          >
            {stats.totalTools} tools · {stats.totalCategories} categories
          </div>
        </div>

        {/* Poster grid — left 3 cols + right block (right-top 2 cols, then 2 stacked banners) */}
        <div style={{ display: 'flex', flex: 1, gap: 6, alignItems: 'flex-start', minHeight: 0 }}>
          {LEFT_COLS_OG.map((catList, idx) => (
            <div
              key={`l${idx}`}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6, minWidth: 0 }}
            >
              {catList.map((slug) => renderCard(slug))}
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 2,
              gap: 6,
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              {RIGHT_TOP_COLS_OG.map((catList, idx) => (
                <div
                  key={`r${idx}`}
                  style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6, minWidth: 0 }}
                >
                  {catList.map((slug) => renderCard(slug))}
                </div>
              ))}
            </div>
            {RIGHT_BOTTOM_STACK_OG.map((slug) => renderCard(slug))}
          </div>
        </div>

        {/* Footer rule */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#524a3c',
          }}
        >
          <span>indianvcs.com/vc-stack</span>
          <span>The Indian VC stack · curated 2026</span>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  )
}

export async function renderCategoryOgImage(slug: string) {
  const category = await getCategoryBySlug(slug)
  if (!category) return FallbackImage()

  const { data: tools, total } = await getToolsByCategory(category.slug, { pageSize: 6 })
  const preview = tools.slice(0, 6)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5F0E8',
          padding: 64,
          fontFamily: 'serif',
        }}
      >
        <BrandMark size={28} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 600,
              color: '#D21905',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            }}
          >
            Section · {total} tools
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 128,
              fontWeight: 900,
              color: '#1a1410',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
            }}
          >
            {category.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#524a3c',
              lineHeight: 1.35,
              maxWidth: 1000,
            }}
          >
            {category.description ??
              `Curated ${category.name.toLowerCase()} tools used by Indian venture capital firms.`}
          </div>
        </div>

        {preview.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#524a3c',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginRight: 12,
              }}
            >
              Featured:
            </div>
            {preview.map((tool) => (
              <div
                key={tool.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 68,
                  height: 68,
                  background: '#ffffff',
                  border: '1px solid #c8bfb0',
                  padding: 10,
                  flexShrink: 0,
                }}
              >
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt=""
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      background: '#1a1410',
                      color: '#F5F0E8',
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    {tool.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                fontSize: 22,
                color: '#524a3c',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
              }}
            >
              indianvcs.com/vc-stack
            </div>
          </div>
        )}
      </div>
    ),
    OG_IMAGE_SIZE,
  )
}

export async function renderToolOgImage(slug: string) {
  const tool = await getToolBySlug(slug)
  if (!tool) return FallbackImage()

  const shortDesc = tool.shortDesc ?? tool.description.slice(0, 140)
  const pricingLabel =
    tool.pricingModel === 'FREE'
      ? 'Free'
      : tool.pricingModel === 'FREEMIUM'
        ? 'Freemium'
        : tool.pricingModel === 'ENTERPRISE'
          ? 'Enterprise'
          : 'Paid'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5F0E8',
          padding: 64,
          fontFamily: 'serif',
        }}
      >
        <BrandMark size={28} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {tool.logoUrl ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 160,
                height: 160,
                background: '#ffffff',
                border: '1px solid #c8bfb0',
                padding: 16,
                flexShrink: 0,
              }}
            >
              <img
                src={tool.logoUrl}
                alt=""
                width={128}
                height={128}
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 160,
                height: 160,
                background: '#1a1410',
                color: '#F5F0E8',
                fontSize: 64,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 96,
                fontWeight: 900,
                color: '#1a1410',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
              }}
            >
              {tool.name}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#524a3c',
                lineHeight: 1.35,
                fontFamily: 'serif',
              }}
            >
              {shortDesc}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            color: '#524a3c',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {tool.category && (
              <div
                style={{
                  display: 'flex',
                  padding: '8px 14px',
                  background: '#ede7db',
                  border: '1px solid #c8bfb0',
                  color: '#1a1410',
                  fontSize: 20,
                }}
              >
                {tool.category.name}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                padding: '8px 14px',
                color: '#D21905',
                borderBottom: '2px solid #D21905',
                fontSize: 20,
              }}
            >
              {pricingLabel}
            </div>
          </div>
          <div style={{ display: 'flex' }}>indianvcs.com/vc-stack</div>
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  )
}
