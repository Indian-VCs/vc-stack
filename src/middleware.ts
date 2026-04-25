/**
 * Edge middleware — admin route protection.
 *
 * Why `middleware.ts` and not `proxy.ts`: Next.js 16 introduced `proxy.ts` as
 * the successor convention, but it runs only on the Node.js runtime. OpenNext
 * for Cloudflare Workers (which is what Webflow Cloud uses) rejects Node.js
 * middleware ("Node.js middleware is not currently supported. Consider
 * switching to Edge Middleware."). The legacy `middleware.ts` name is the
 * only path that still supports Edge runtime, so we keep it until either
 * OpenNext supports Node.js proxy or Next.js allows Edge proxy.
 *
 * CI guardrail:
 *   grep -q "export async function middleware" src/middleware.ts
 *
 * Note on basePath: Next.js applies the `basePath: "/vc-stack"` from
 * next.config.ts transparently. The `matcher` below is written WITHOUT the
 * prefix — Next prepends it automatically. So `/admin/:path*` here matches
 * the public URL `/vc-stack/admin/:path*`.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'

export const runtime = 'experimental-edge'

export async function middleware(request: NextRequest) {
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

      // Clone nextUrl so basePath (`/vc-stack`) is preserved in the redirect.
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
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
