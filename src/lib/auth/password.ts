/**
 * Password hashing — bcryptjs.
 *
 * The single admin account is bootstrapped from env vars (ADMIN_EMAIL +
 * ADMIN_PASSWORD_HASH). To generate a hash for a new password, run:
 *
 *   npx tsx scripts/hash-password.ts <password>
 *
 * Cost factor 12 ≈ 250ms on a modern laptop — strong enough for an admin
 * gate, slow enough to make brute-force impractical.
 */

import bcrypt from 'bcryptjs'

const COST = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}
