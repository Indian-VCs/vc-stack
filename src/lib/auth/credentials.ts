/**
 * Admin credential lookup.
 *
 * Single admin: ADMIN_EMAIL + ADMIN_PASSWORD_HASH from env.
 * (Multi-admin can move to the `admin_users` table later — schema is ready.)
 */

import { verifyPassword } from './password'

interface AdminCredentials {
  email: string
  passwordHash: string
}

function getConfiguredAdmin(): AdminCredentials | null {
  const email = process.env.ADMIN_EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!email || !passwordHash) return null
  return { email: email.toLowerCase(), passwordHash }
}

export async function checkLogin(email: string, password: string): Promise<boolean> {
  const admin = getConfiguredAdmin()
  if (!admin) return false
  if (email.trim().toLowerCase() !== admin.email) return false
  return verifyPassword(password, admin.passwordHash)
}
