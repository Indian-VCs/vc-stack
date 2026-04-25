/**
 * POST /api/admin/login
 *
 * Body: { email: string, password: string }
 * 200  → sets session cookie, returns { ok: true }
 * 400  → malformed body
 * 401  → bad credentials
 * 403  → cross-site origin (CSRF guard)
 * 429  → rate limited
 *
 * Defence layers:
 *   1. Origin allowlist (CSRF belt-and-braces; sameSite=strict already blocks the cookie).
 *   2. IP-based rate limit: 5 attempts / 15 min.
 *   3. bcrypt password verify (constant time).
 *   4. Audit log every attempt — both successful and failed.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkLogin } from '@/lib/auth/credentials'
import { getSession } from '@/lib/auth/session'
import * as rateLimit from '@/lib/rate-limit'
import { auditFailedLogin, auditSuccessfulLogin } from '@/lib/audit'

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
})

const LIMIT = 5
const WINDOW_MS = 15 * 60 * 1000

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  // Same-origin POSTs from the login form may omit Origin in some browsers.
  if (!origin) return true
  try {
    const originHost = new URL(origin).host
    // Behind a proxy (Webflow Cloud / Cloudflare), `host` reflects the internal
    // worker hostname, so accept any of: host, x-forwarded-host, request URL host.
    // Cloudflare strips client-provided x-forwarded-host on the way in, so this
    // remains trusted.
    const candidates = [
      request.headers.get('host'),
      request.headers.get('x-forwarded-host'),
      new URL(request.url).host,
    ].filter((h): h is string => Boolean(h))
    return candidates.includes(originHost)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 })
  }

  const ip = rateLimit.clientIp(request)
  const limit = rateLimit.check(`login:${ip}`, LIMIT, WINDOW_MS)
  if (!limit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body.' }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
  }

  const { email, password } = parsed.data

  const ok = await checkLogin(email, password)
  if (!ok) {
    // Don't disclose whether the email exists — uniform 401 either way.
    await auditFailedLogin(email, 'invalid credentials').catch(() => {})
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const session = await getSession()
  session.email = email
  session.loggedInAt = Date.now()
  await session.save()

  rateLimit.reset(`login:${ip}`)
  await auditSuccessfulLogin(email).catch(() => {})

  return NextResponse.json({ ok: true })
}
