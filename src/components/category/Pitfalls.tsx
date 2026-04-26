import type { Pitfall } from '@/lib/types'

interface Props {
  pitfalls?: Pitfall[] | null
  categoryName: string
}

export default function Pitfalls({ pitfalls, categoryName }: Props) {
  if (!pitfalls || pitfalls.length === 0) return null

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
        Where {categoryName.toLowerCase()} stacks usually break.
      </p>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          counterReset: 'pitfall',
        }}
      >
        {pitfalls.map((p, i) => (
          <li
            key={i}
            style={{
              counterIncrement: 'pitfall',
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
                {p.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-light)',
                }}
              >
                {p.description}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
