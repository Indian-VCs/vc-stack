import { headers } from 'next/headers'
import * as rateLimit from '@/lib/rate-limit'

const SUBMISSION_LIMIT = 10
const SUBMISSION_WINDOW_MS = 60 * 60 * 1000

export function hitHoneypot(formData: FormData): boolean {
  return String(formData.get('companyWebsite') ?? '').trim().length > 0
}

export async function checkSubmissionLimit(kind: string): Promise<{
  allowed: boolean
  retryAfterSeconds?: number
}> {
  const headerStore = await headers()
  const ip = rateLimit.clientIp({ headers: headerStore })
  const result = rateLimit.check(`submission:${kind}:${ip}`, SUBMISSION_LIMIT, SUBMISSION_WINDOW_MS)

  if (result.allowed) return { allowed: true }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000)),
  }
}
