import type { Metadata } from 'next'
import { searchTools } from '@/lib/data'
import ToolCard from '@/components/cards/ToolCard'
import SearchBox from '@/components/ui/SearchBox'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Search Tools',
  description: 'Search across every tool in the Indian VC stack.',
}

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageStr } = await searchParams
  const page = Number(pageStr ?? 1)

  const result = await searchTools({
    query: q,
    page,
    pageSize: 24,
  })

  const { data: tools, total, totalPages } = result

  return (
    <div className="page" style={{ padding: '24px 24px 48px' }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Search</span>
      </div>

      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 28,
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
          The Archive
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {q ? `Results for “${q}”` : 'Search the paper'}
        </h1>
        <SearchBox defaultValue={q} />
        <p
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-muted)',
            marginTop: 16,
          }}
        >
          {total} {total === 1 ? 'match' : 'matches'}
        </p>
      </header>

      {tools.length === 0 ? (
        <div className="empty">
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 6 }}>
            No matches found.
          </p>
          <p style={{ marginBottom: 14 }}>Try a different term.</p>
          <Link href="/" className="btn btn--ghost">Back to home</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool, i) => (
              <div key={tool.id} style={{ marginLeft: -1, marginTop: -1 }}>
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                marginTop: 32,
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-btn)',
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/search?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${p}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    border: '1px solid var(--rule)',
                    textDecoration: 'none',
                    background: p === page ? 'var(--ink)' : 'var(--paper)',
                    color: p === page ? 'var(--paper)' : 'var(--ink-light)',
                  }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
