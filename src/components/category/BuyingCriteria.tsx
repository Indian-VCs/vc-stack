import type { BuyingCriterion } from '@/lib/types'

interface Props {
  criteria?: BuyingCriterion[] | null
  categoryName: string
}

export default function BuyingCriteria({ criteria, categoryName }: Props) {
  if (!criteria || criteria.length === 0) return null

  return (
    <section
      style={{
        borderTop: '2px solid var(--ink)',
        padding: '24px 0',
        marginBottom: 32,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.24em',
          color: 'var(--red)',
          marginBottom: 8,
        }}
      >
        What to look for
      </div>
      <h2
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 700,
          fontSize: '1.5rem',
          lineHeight: 1.2,
          color: 'var(--ink)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        Buying a {categoryName.toLowerCase()} for a venture fund
      </h2>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          counterReset: 'criterion',
        }}
      >
        {criteria.map((c, i) => (
          <li
            key={i}
            style={{
              counterIncrement: 'criterion',
              borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
              borderBottom: '1px solid var(--rule)',
              padding: '14px 0',
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--red)',
                paddingTop: 2,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-light)',
                }}
              >
                {c.description}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
