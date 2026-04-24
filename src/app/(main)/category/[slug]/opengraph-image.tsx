/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { getCategoryBySlug, getToolsByCategory } from '@/lib/data'

export const alt = 'Indian VCs category'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Params {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Params) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
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
        {/* Header: brand */}
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

        {/* Body: category name + count */}
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

        {/* Tool-logo strip */}
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
            {preview.map((t) => (
              <div
                key={t.id}
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
                {t.logoUrl ? (
                  <img
                    src={t.logoUrl}
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
                    {t.name.slice(0, 2).toUpperCase()}
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
    size,
  )
}
