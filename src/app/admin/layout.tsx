/**
 * Admin layout — defense-in-depth auth guard + chrome.
 *
 * The edge proxy (src/proxy.ts) is the primary protection. This layout is
 * the second layer: it calls `isAuthenticated()` and renders the login page
 * standalone (no sidebar) when unauthed, OR the full admin chrome when authed.
 *
 * The login page itself does NOT call `requireAdmin()` (it's the only admin
 * route open to unauthed users). All other admin pages SHOULD call
 * `requireAdmin()` at the top — the proxy should have already redirected,
 * but if it hasn't, requireAdmin will.
 */

import type { Metadata } from 'next'
import { isAuthenticated } from '@/lib/auth'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = {
  title: { template: '%s | Admin · Indian VCs', default: 'Admin · Indian VCs' },
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()

  if (!authed) {
    // Render whatever child is here without the chrome. In practice the
    // proxy should already have routed unauthed traffic to /admin/login,
    // so the only child you'll see in this branch is the login page.
    return <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>{children}</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  )
}
