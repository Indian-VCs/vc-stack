/**
 * POST /api/admin/logout — destroys the iron-session cookie.
 * Idempotent: returns 200 whether or not a session existed.
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { audit } from '@/lib/audit'

export async function POST() {
  const session = await getSession()
  const email = session.email
  session.destroy()
  if (email) {
    await audit({ adminEmail: email, action: 'login', entity: 'session', diff: { logout: true } }).catch(() => {})
  }
  return NextResponse.json({ ok: true })
}
