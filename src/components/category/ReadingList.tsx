import type { ReadingItem } from '@/lib/types'

interface Props {
  items?: ReadingItem[] | null
}

export default function ReadingList({ items }: Props) {
  if (!items || items.length === 0) return null

  return (
    <section style={{ padding: '8px 0 4px' }}>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((item, i) => (
          <li
            key={`${item.url}-${i}`}
            style={{
              borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
              borderBottom: '1px solid var(--rule)',
              padding: '12px 0',
              fontFamily: 'var(--body)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'var(--ink-light)',
            }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                color: 'var(--ink)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--rule)',
              }}
            >
              {item.title}
            </a>
            {item.source && (
              <span style={{ color: 'var(--ink-muted)' }}> — {item.source}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
