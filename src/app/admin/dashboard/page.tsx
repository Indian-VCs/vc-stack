import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteStats } from '@/lib/data'

export const metadata: Metadata = { title: 'Editor’s Desk — IndianVCs' }

export default async function AdminDashboardPage() {
  const stats = await getSiteStats()

  const cards = [
    { label: 'Tools Indexed', value: stats.toolCount },
    { label: 'Sections', value: stats.categoryCount },
    { label: 'Pending Submissions', value: stats.submissionCount },
    { label: 'Published Reviews', value: stats.reviewCount },
  ]

  return (
    <div style={{ padding: '32px 40px 64px' }}>
      <header
        style={{
          borderTop: '3px double var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '20px 0',
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
          Admin Dashboard
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.1,
          }}
        >
          The Newsroom
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1rem',
            color: 'var(--ink-light)',
            marginTop: 10,
            fontStyle: 'italic',
          }}
        >
          The state of the paper, at a glance.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--ink)',
          marginBottom: 48,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.label}
            style={{
              padding: '24px 20px',
              borderRight: i < cards.length - 1 ? '1px solid var(--rule)' : 'none',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--ink-muted)',
                marginBottom: 10,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: '2.4rem',
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">Quick Actions</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: '1px solid var(--ink)',
        }}
      >
        {[
          {
            title: 'Review Submissions',
            desc: `${stats.submissionCount} pending editor approval`,
            href: '/admin/submissions',
          },
          {
            title: 'Manage Tools',
            desc: 'Edit or add tools to the index',
            href: '/admin/tools',
          },
          {
            title: 'Manage Sections',
            desc: 'Curate the categories of the paper',
            href: '/admin/categories',
          },
        ].map(({ title, desc, href }, i) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: 24,
              borderRight: i < 2 ? '1px solid var(--rule)' : 'none',
              textDecoration: 'none',
              color: 'var(--ink)',
              display: 'block',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: 8,
                color: 'var(--ink)',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: '0.95rem',
                color: 'var(--ink-light)',
                marginBottom: 14,
                fontStyle: 'italic',
              }}
            >
              {desc}
            </p>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 'var(--fs-tag)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--red)',
              }}
            >
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
