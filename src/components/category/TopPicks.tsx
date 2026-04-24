import Link from 'next/link'
import type { Tool, TopPick } from '@/lib/types'

interface Props {
  picks?: TopPick[] | null
  tools: Tool[]
  categoryName: string
}

export default function TopPicks({ picks, tools, categoryName }: Props) {
  if (!picks || picks.length === 0) return null

  // Resolve pick slugs → full Tool objects. Skip any that don't exist.
  const resolved = picks
    .map((p) => {
      const tool = tools.find((t) => t.slug === p.slug)
      return tool ? { tool, rationale: p.rationale } : null
    })
    .filter((p): p is { tool: Tool; rationale: string } => p !== null)

  if (resolved.length === 0) return null

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
        Editor&rsquo;s Picks
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
        Top {categoryName.toLowerCase()} tools in 2026
      </h2>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 16,
        }}
      >
        {resolved.map(({ tool, rationale }, i) => (
          <li
            key={tool.id}
            style={{
              border: '1px solid var(--rule)',
              padding: 18,
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              gap: 16,
              background: 'var(--paper)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '2.5rem',
                fontWeight: 900,
                lineHeight: 1,
                color: 'var(--red)',
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>
                <Link
                  href={`/product/${tool.slug}`}
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {tool.name}
                </Link>
                {tool.shortDesc ? (
                  <span
                    style={{
                      fontFamily: 'var(--body)',
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      color: 'var(--ink-muted)',
                      marginLeft: 10,
                    }}
                  >
                    — {tool.shortDesc}
                  </span>
                ) : null}
              </div>
              <p
                style={{
                  fontFamily: 'var(--body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-light)',
                  margin: 0,
                }}
              >
                {rationale}
              </p>
              <Link
                href={`/product/${tool.slug}`}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--fs-tag)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--red)',
                  display: 'inline-block',
                  marginTop: 8,
                  textDecoration: 'none',
                }}
              >
                Read full review →
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
