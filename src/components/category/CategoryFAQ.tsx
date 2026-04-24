import type { CategoryFAQ as FAQ } from '@/lib/types'

interface Props {
  faqs?: FAQ[] | null
  categoryName: string
}

// FAQPage JSON-LD is emitted from src/app/(main)/category/[slug]/page.tsx,
// merged into the page-level @graph so there's exactly one schema script per page.
export default function CategoryFAQ({ faqs, categoryName }: Props) {
  if (!faqs || faqs.length === 0) return null

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
        Letters to the Editor
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
        {categoryName} — frequently asked
      </h2>
      <dl style={{ margin: 0 }}>
        {faqs.map((f, i) => (
          <div
            key={i}
            style={{
              borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
              borderBottom: '1px solid var(--rule)',
              padding: '16px 0',
            }}
          >
            <dt
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--ink)',
                marginBottom: 8,
                letterSpacing: '-0.005em',
              }}
            >
              {f.question}
            </dt>
            <dd
              style={{
                fontFamily: 'var(--body)',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--ink-light)',
                margin: 0,
                maxWidth: 760,
              }}
            >
              {f.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
