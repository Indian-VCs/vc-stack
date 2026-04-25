/**
 * Edge proxy — admin route protection.
 *
 * THE FILE NAME MATTERS. Next.js 16+ invokes the proxy from `proxy.ts` (or
 * .js/.tsx/.jsx) at the project root or src/ root, exporting a function named
 * `proxy`. Renaming this file or its export silently disables the gate.
 * (Next 15 and earlier called this "middleware" — the rename is documented
 * at https://nextjs.org/docs/messages/middleware-to-proxy.)
 *
 * CI guardrail:
 *   grep -q "export async function proxy" src/proxy.ts
 *
 * Note on basePath: Next.js applies the `basePath: "/vc-stack"` from
 * next.config.ts transparently. The `matcher` below is written WITHOUT the
 * prefix — Next prepends it automatically. So `/admin/:path*` here matches
 * the public URL `/vc-stack/admin/:path*`.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login is the only admin path open to unauthed users.
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next()
  }

  // /api/admin/login is the corresponding POST endpoint.
  if (pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  // Everything else under /admin or /api/admin requires a live session.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const response = NextResponse.next()

    let authed = false
    try {
      const session = await getSessionFromRequest(request, response)
      authed = Boolean(session.email && session.loggedInAt)
    } catch {
      // Misconfigured SESSION_PASSWORD or similar — treat as unauthed.
      authed = false
    }

    if (!authed) {
      // For HTML navigation: redirect to login.
      // For API JSON: 401.
      const wantsJson =
        pathname.startsWith('/api/admin') ||
        request.headers.get('accept')?.includes('application/json')

      if (wantsJson) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
      }

      const loginUrl = new URL('/admin/login', request.url)
      const next = pathname + (request.nextUrl.search ?? '')
      if (next !== '/admin' && next !== '/admin/login') {
        loginUrl.searchParams.set('next', next)
      }
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  // Match every admin path. Excludes static assets implicitly because they
  // don't live under /admin or /api/admin.
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
