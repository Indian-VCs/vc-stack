/**
 * Admin sessions — iron-session backed by an HTTP-only signed cookie.
 *
 * Why iron-session: stateless (no DB lookup per request), Edge-compatible
 * (works under Cloudflare Workers), and the cookie is signed + AES-encrypted
 * so we don't need a session store. Tampering invalidates the cookie.
 *
 * Required env: SESSION_PASSWORD (32+ chars). Generate with:
 *   openssl rand -base64 48
 *
 * Three callers, three signatures:
 *   - Server Components / Server Actions / Route Handlers → getSession()
 *   - Edge proxy (request + response) → getSessionFromRequest()
 */

import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest, NextResponse } from 'next/server'

interface AdminSession {
  /** Lower-cased admin email; presence implies authenticated. */
  email?: string
  /** Unix ms at login. Used for absolute session expiry checks. */
  loggedInAt?: number
}

const SEVEN_DAYS_S = 60 * 60 * 24 * 7
const SEVEN_DAYS_MS = SEVEN_DAYS_S * 1000

export class NotAuthenticatedError extends Error {
  constructor() {
    super('Not authenticated.')
    this.name = 'NotAuthenticatedError'
  }
}

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_PASSWORD
  if (!password || password.length < 32) {
    throw new Error(
      'SESSION_PASSWORD env var must be set and >= 32 characters. ' +
        'Generate one with `openssl rand -base64 48`.',
    )
  }
  return {
    password,
    cookieName: 'indianvcs_admin_session',
    ttl: SEVEN_DAYS_S,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SEVEN_DAYS_S,
    },
  }
}

/** True iff the session contains a non-expired admin login. */
function isLive(s: AdminSession): boolean {
  if (!s.email || !s.loggedInAt) return false
  return Date.now() - s.loggedInAt < SEVEN_DAYS_MS
}

/** For Server Components / Actions / Route Handlers. */
export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<AdminSession>(cookieStore, sessionOptions())
}

/** For the edge proxy: pass the incoming request and outgoing response. */
export async function getSessionFromRequest(request: NextRequest, response: NextResponse) {
  return getIronSession<AdminSession>(request, response, sessionOptions())
}

/** True iff the current request has a live admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const s = await getSession()
  return isLive(s)
}

/**
 * For Server Components / pages: redirect to /admin/login if unauthed.
 * Defense-in-depth: the edge proxy should already have caught this, but if
 * it ever fails (config drift, edge runtime quirks) this still blocks.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const s = await getSession()
  if (!isLive(s)) {
    redirect('/admin/login')
  }
  return { email: s.email! }
}

/**
 * For Server Actions: throw rather than redirect. Actions return state to
 * the form via useActionState; redirects from inside actions confuse that.
 */
export async function requireAdminAction(): Promise<{ email: string }> {
  const s = await getSession()
  if (!isLive(s)) {
    throw new NotAuthenticatedError()
  }
  return { email: s.email! }
}
