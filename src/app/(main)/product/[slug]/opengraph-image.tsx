/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { getToolBySlug } from '@/lib/data'

export const alt = 'Indian VCs tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Params) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
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
      size,
    )
  }

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
        {/* Header: brand wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
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
              width: 44,
              height: 6,
              background: '#D21905',
              margin: '0 14px',
            }}
          />
          <span>VCs</span>
        </div>

        {/* Body: logo + name + description */}
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

        {/* Footer: category + url + pricing */}
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
    size,
  )
}
