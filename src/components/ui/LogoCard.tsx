'use client'

import type { CSSProperties } from 'react'
import { useState } from 'react'

interface LogoCardProps {
  name: string
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  style?: CSSProperties
}

/**
 * Broadsheet-style logo badge — a tight square card with a hairline rule,
 * on the paper palette. No rounded corners, no shadows, no floating animation.
 */
export default function LogoCard({
  name,
  logoUrl,
  size = 'md',
  style,
}: LogoCardProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const dim = size === 'lg' ? 64 : size === 'sm' ? 36 : 48
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const showImage = !!logoUrl && !imgFailed

  return (
    <div
      style={{
        width: dim,
        height: dim,
        background: 'var(--surface-logo)',
        border: '1px solid var(--rule)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: size === 'sm' ? 4 : 6,
        flexShrink: 0,
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={logoUrl!}
          alt=""
          width={dim - (size === 'sm' ? 8 : 12)}
          height={dim - (size === 'sm' ? 8 : 12)}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={() => {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[LogoCard] logo failed for ${name}: ${logoUrl}`)
            }
            setImgFailed(true)
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: dim * 0.32,
            color: 'var(--ink)',
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
