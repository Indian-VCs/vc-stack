'use server'

/**
 * Seed action — populates D1 from STATIC_CATEGORIES + STATIC_TOOLS.
 *
 * Builds one big multi-statement SQL string (multi-row INSERTs + featured
 * updates) and executes it via D1's native multi-statement runner in a
 * single round-trip. Avoids drizzle's per-statement overhead that was
 * killing the Cloudflare Worker on the previous batched approach.
 *
 * Idempotent: every INSERT uses ON CONFLICT(id) DO UPDATE, so re-running
 * refreshes content without dropping admin-created rows.
 */

import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { audit } from '@/lib/audit'
import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
} from '@/lib/static-catalog'
import { buildSeedSql } from '@/lib/seed-sql'

export type SeedResult =
  | { ok: true; categories: number; tools: number; featured: number }
  | { ok: false; message: string }

// Outermost wrapper: ensures NOTHING this action does ever throws past the
// boundary into Next.js's framework code, so the user always sees a structured
// error message instead of React's masked "Server Components render" error.
export async function seedFromStaticCatalog(): Promise<SeedResult> {
  try {
    return await seedImpl()
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    console.error('[seed] uncaught', { message, err })
    return { ok: false, message: `Seed failed (uncaught): ${message.slice(0, 400)}` }
  }
}

async function seedImpl(): Promise<SeedResult> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      return { ok: false, message: 'Sign in again.' }
    }
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, message: `Auth failed: ${message.slice(0, 400)}` }
  }

  return await runSeed(admin)
}

async function runSeed(admin: { email: string }): Promise<SeedResult> {
  const seedSql = buildSeedSql()

  if (process.env.NODE_ENV === 'production') {
    await runOnD1(seedSql)
  } else {
    await runOnSqliteDev(seedSql)
  }

  // Audit + cache revalidation are best-effort — they should never bring down
  // the seed itself. revalidatePath in particular triggers a server-side
  // re-render of the named paths under OpenNext, and those renders can fail
  // independently of whether the seed succeeded. Wrap each so a render
  // failure post-seed doesn't surface as "Server Components render error"
  // when the data has already landed.
  try {
    await audit({
      adminEmail: admin.email,
      action: 'create',
      entity: 'tool',
      entityId: null,
      diff: {
        seed: true,
        categories: STATIC_CATEGORIES.length,
        tools: STATIC_TOOLS.length,
        featured: FEATURED_TOOL_SLUGS.length,
      },
    })
  } catch {
    // already logged inside audit()
  }

  for (const path of [
    '/admin/dashboard',
    '/admin/seed',
    '/admin/tools',
    '/admin/categories',
    '/admin/featured',
    '/',
  ]) {
    try {
      revalidatePath(path)
    } catch (err) {
      console.error('[seed] revalidatePath failed', { path, err })
    }
  }

  return {
    ok: true,
    categories: STATIC_CATEGORIES.length,
    tools: STATIC_TOOLS.length,
    featured: FEATURED_TOOL_SLUGS.length,
  }
}

async function runOnD1(seedSql: string): Promise<void> {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare')
  const ctx = await getCloudflareContext({ async: true })
  const d1 = (ctx.env as { DB?: D1Database }).DB
  if (!d1) throw new Error('D1 binding `DB` is missing — check wrangler.jsonc')

  // Split the multi-statement string into prepared statements and submit via
  // batch(). batch() is the production-grade D1 path: each statement runs in
  // a single transaction, the API supports up to 100 statements per call,
  // and parsing is per-statement (no fragile newline-splitting).
  const lines = seedSql
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('--'))

  const statements = lines.map((line) => d1.prepare(line))
  const CHUNK = 50
  for (let i = 0; i < statements.length; i += CHUNK) {
    const chunk = statements.slice(i, i + CHUNK)
    if (chunk.length === 0) continue
    await d1.batch(chunk as [D1PreparedStatement, ...D1PreparedStatement[]])
  }
}

async function runOnSqliteDev(seedSql: string): Promise<void> {
  const { default: Database } = await import('better-sqlite3')
  const sqlite = new Database(process.env.DB_PATH ?? './local.db')
  sqlite.pragma('foreign_keys = ON')
  try {
    sqlite.exec(seedSql)
  } finally {
    sqlite.close()
  }
}
