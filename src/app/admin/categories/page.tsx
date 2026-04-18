import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/data'

export const metadata: Metadata = { title: 'Sections — Editor’s Desk' }

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div style={{ padding: '32px 40px 64px' }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
          marginBottom: 24,
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
          Masthead · {categories.length} sections
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: 'var(--fs-name)',
              color: 'var(--ink)',
              lineHeight: 1.1,
            }}
          >
            Categories
          </h1>
          <Link href="/admin/categories/new" className="btn btn--primary">
            + New Category
          </Link>
        </div>
      </header>

      <div style={{ border: '1px solid var(--ink)', overflow: 'hidden' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--body)',
            fontSize: '0.95rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid var(--ink)', background: 'var(--paper-alt)' }}>
              {['Icon', 'Name', 'Slug', 'Tools', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontFamily: 'var(--mono)',
                    fontSize: 'var(--fs-tag)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--ink-muted)',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--rule)' }}>
                <td style={{ padding: '10px 14px', fontSize: '1.3rem' }}>{cat.icon ?? '—'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--ink)' }}>
                    {cat.name}
                  </span>
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontFamily: 'var(--mono)',
                    fontSize: 'var(--fs-tag)',
                    color: 'var(--ink-muted)',
                  }}
                >
                  {cat.slug}
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--ink-light)' }}>
                  {cat._count?.tools ?? 0}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 'var(--fs-tag)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--red)',
                      textDecoration: 'none',
                    }}
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
