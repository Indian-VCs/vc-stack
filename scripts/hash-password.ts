/**
 * Generate a bcrypt hash for the admin password.
 *
 * Usage:
 *   npx tsx scripts/hash-password.ts 'your-strong-password'
 *
 * Copy the output into your env as ADMIN_PASSWORD_HASH.
 * For Cloudflare:  wrangler secret put ADMIN_PASSWORD_HASH
 */

import { hashPassword } from '../src/lib/auth/password'

async function main() {
  const password = process.argv[2]
  if (!password || password.length < 12) {
    console.error('Usage: npx tsx scripts/hash-password.ts <password>')
    console.error('(password must be at least 12 characters)')
    process.exit(1)
  }
  const hash = await hashPassword(password)
  console.log(hash)
}

main()
