import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge runtime so this runs on Cloudflare Workers via OpenNext.
export const runtime = 'experimental-edge'

export function middleware(request: NextRequest) {
  const { pathname, basePath } = request.nextUrl

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('indianvcs_admin')
    if (session?.value !== 'authenticated') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      // NextURL preserves basePath (`/vc-stack`) when cloned.
      void basePath
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
