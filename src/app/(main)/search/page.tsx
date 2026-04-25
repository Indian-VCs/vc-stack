import type { Metadata } from 'next'
import { searchTools, getAllTools } from '@/lib/data'
import ToolCard from '@/components/cards/ToolCard'
import SearchBox from '@/components/ui/SearchBox'
import Pagination from '@/components/ui/Pagination'
import RevealStagger from '@/components/ui/RevealStagger'
import Link from 'next/link'
import { publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Search Tools',
  description: 'Search across every tool in the Indian VC stack.',
  alternates: { canonical: publicUrl('/search') },
  robots: { index: false, follow: true },
}

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageStr } = await searchParams
  const requestedPage = Number(pageStr ?? 1)

  const [result, allTools] = await Promise.all([
    searchTools({ query: q, page: requestedPage, pageSize: 24 }),
    getAllTools(),
  ])

  const { data: tools, total, totalPages, page: currentPage } = result
  const totalInCorpus = allTools.length

  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 48 }}>
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
          className="hero-enter"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 8,
            animationDelay: '0ms',
          }}
        >
          The Archive
        </div>
        <h1
          className="hero-enter"
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'clamp(1.7rem, 6vw, 2.6rem)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 16,
            wordBreak: 'break-word',
            animationDelay: '80ms',
          }}
        >
          {q ? `Results for “${q}”` : `Search across ${totalInCorpus} tools`}
        </h1>
        <div className="hero-enter" style={{ animationDelay: '160ms' }}>
          <SearchBox defaultValue={q} />
        </div>
        <p
          className="hero-enter"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-muted)',
            marginTop: 16,
            animationDelay: '240ms',
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
          <RevealStagger className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <div key={tool.id} style={{ marginLeft: -1, marginTop: -1 }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </RevealStagger>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            hrefFor={(p) => `/search?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${p}`}
          />
        </>
      )}
    </div>
  )
}
