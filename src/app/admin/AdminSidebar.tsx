'use client'

/**
 * Admin nav. Renders only on authed pages (the layout decides). Logout is a
 * client-side fetch so we can clear UI state and redirect afterwards.
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/tools', label: 'Tools' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/featured', label: 'Featured order' },
  { href: '/admin/submissions/tools', label: 'Tool submissions' },
  { href: '/admin/submissions/stack', label: 'Stack submissions' },
  { href: '/admin/audit', label: 'Audit log' },
] as const

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 240,
        flex: '0 0 240px',
        borderRight: '1px solid var(--rule)',
        padding: '24px 16px',
        background: 'var(--paper-alt)',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--red)',
            marginBottom: 4,
          }}
        >
          Indian VCs
        </div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: '1.4rem',
            color: 'var(--ink)',
          }}
        >
          Newsroom
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{
                padding: '8px 12px',
                fontFamily: 'var(--body)',
                fontSize: '0.95rem',
                color: active ? 'var(--red)' : 'var(--ink)',
                textDecoration: 'none',
                borderLeft: active ? '2px solid var(--red)' : '2px solid transparent',
                background: active ? 'var(--paper)' : 'transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--ink-light)',
            textDecoration: 'none',
          }}
        >
          ← Back to site
        </Link>
        <button
          type="button"
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid var(--rule)',
            padding: '8px 12px',
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--ink)',
            textAlign: 'left',
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
