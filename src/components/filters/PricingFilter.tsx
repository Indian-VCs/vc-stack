'use client'

import Link from 'next/link'

const PRICING_OPTIONS = [
  { value: '', label: 'All Pricing' },
  { value: 'FREE', label: 'Free' },
  { value: 'FREEMIUM', label: 'Freemium' },
  { value: 'PAID', label: 'Paid' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
]

interface PricingFilterProps {
  currentPricing?: string
  basePath: string
}

export default function PricingFilter({ currentPricing, basePath }: PricingFilterProps) {
  return (
    <div>
      <div className="section-header">Pricing</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PRICING_OPTIONS.map(({ value, label }) => {
          const isActive = (currentPricing ?? '') === value
          const href = value ? `${basePath}?pricing=${value}` : basePath
          return (
            <Link
              key={value}
              href={href}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-btn)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '8px 0',
                borderBottom: '1px solid var(--rule)',
                color: isActive ? 'var(--red)' : 'var(--ink-light)',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {isActive ? '▸ ' : '  '}{label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
