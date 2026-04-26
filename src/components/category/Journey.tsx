import type { JourneyTier } from '@/lib/types'

interface Props {
  journey?: JourneyTier | null
}

const TIERS: ReadonlyArray<{ key: keyof JourneyTier; label: string }> = [
  { key: 'beginner',     label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced',     label: 'Advanced' },
]

export default function Journey({ journey }: Props) {
  if (!journey) return null

  return (
    <section style={{ padding: '8px 0 4px' }}>
      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: '1rem',
          color: 'var(--ink-muted)',
          fontStyle: 'italic',
          marginBottom: 18,
          maxWidth: 'none',
        }}
      >
        How to approach this stack — depending on where your firm is.
      </p>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {TIERS.map((tier, i) => (
          <li
            key={tier.key}
            style={{
              borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
              borderBottom: '1px solid var(--rule)',
              padding: '14px 0',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--red)',
                paddingTop: 4,
                whiteSpace: 'nowrap',
              }}
            >
              {tier.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--body)',
                fontSize: '0.95rem',
                lineHeight: 1.55,
                color: 'var(--ink-light)',
              }}
            >
              {journey[tier.key]}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
