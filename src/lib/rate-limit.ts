/**
 * IP-based rate limiter for the admin login endpoint.
 *
 * Implementation: in-memory sliding window per Worker isolate. Cloudflare
 * spreads requests across many isolates, so an attacker hitting different
 * isolates can exceed the per-isolate quota. This is acceptable here because:
 *   1. The admin password is bcrypt(cost=12) — each guess costs ~250ms of
 *      CPU. A distributed attacker still can't iterate fast enough to be
 *      meaningful against a strong password.
 *   2. Cloudflare's edge already provides DDoS / volumetric protection.
 *   3. The protection that matters most — preventing log-spam and slow
 *      online enumeration — works fine per-isolate.
 *
 * For stronger global limiting, swap the in-memory Map for a KV / D1 backed
 * counter. The interface (`check`, `reset`) is unchanged — see the
 * UPGRADE_TO_KV note below.
 */

interface Bucket {
  count: number
  /** Unix ms when this bucket's window started. */
  windowStartedAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  /** Unix ms when the bucket resets. */
  resetAt: number
}

/**
 * @param key                Unique per identity; usually the client IP.
 * @param limit              Max attempts per window.
 * @param windowMs           Window length in ms.
 * @param now                Injectable clock for tests.
 */
export function check(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStartedAt >= windowMs) {
    buckets.set(key, { count: 1, windowStartedAt: now })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  bucket.count += 1
  const allowed = bucket.count <= limit
  return {
    allowed,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.windowStartedAt + windowMs,
  }
}

/** Wipe a bucket — called after a successful login so the user isn't penalised next time. */
export function reset(key: string): void {
  buckets.delete(key)
}

/**
 * Pull the client IP out of common headers Cloudflare / proxies set.
 * Falls back to a static "unknown" key — those requests share a bucket.
 */
export function clientIp(request: Request | { headers: Headers }): string {
  const h = request.headers
  return (
    h.get('cf-connecting-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  )
}

// UPGRADE_TO_KV: when distributed rate limiting is needed, replace the
// `buckets` Map with a Cloudflare KV / D1 counter. Keep the same `check` /
// `reset` signatures — every call site already uses them.
