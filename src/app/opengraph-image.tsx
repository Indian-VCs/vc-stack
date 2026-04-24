/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const alt = 'Indian VCs — VC Stack 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 36,
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
              width: 60,
              height: 8,
              background: '#D21905',
              margin: '0 18px',
            }}
          />
          <span>VCs</span>
        </div>

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
    size,
  )
}
