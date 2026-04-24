/* eslint-disable @next/next/no-img-element -- next/og ImageResponse renders remote logos with raw img tags. */
import { ImageResponse } from 'next/og'
import { getCategoryBySlug, getToolBySlug, getToolsByCategory } from '@/lib/data'
import { OG_IMAGE_SIZE } from '@/lib/site'

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

export function renderSiteOgImage() {
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
          padding: 80,
          fontFamily: 'serif',
        }}
      >
        <BrandMark />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 900,
              color: '#1a1410',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            <span>The Indian VC&nbsp;</span>
            <span style={{ color: '#D21905' }}>tech stack.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#524a3c',
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            119+ tools across 17 categories — the complete playbook used by India&apos;s top venture capital firms.
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
          <span>indianvcs.com/vc-stack</span>
          <span>Curated 2026</span>
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
