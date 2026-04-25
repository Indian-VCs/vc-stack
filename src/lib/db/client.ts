/**
 * DB client — picks the right driver per runtime.
 *
 * SAFETY: this file imports better-sqlite3 (Node-only native module). It must
 * never reach the client bundle. The defence is structural: the static catalog
 * (categories list + STATIC_TOOLS + categorySlugsForTool) lives in
 * `src/lib/static-catalog.ts`, not `data.ts`. Client components (Navbar, etc.)
 * import from static-catalog and never touch this file.
 *
 *   - Cloudflare Workers (prod, `npm run preview`, `npm run deploy`):
 *       Uses the D1 binding `env.DB` via `@opennextjs/cloudflare`.
 *
 *   - Local Node (`npm run dev`, `npm run test`):
 *       Uses better-sqlite3 against ./local.db.
 *
 * Both return a Drizzle handle typed by the same schema.
 */

import { drizzle as drizzleD1, type DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema'

type Db = DrizzleD1Database<typeof schema>

let nodeDbPromise: Promise<Db> | null = null

/** Lazily build the local Node SQLite handle. Kept dynamic so the Workers
 *  bundle never imports `better-sqlite3`. */
async function getNodeDb(): Promise<Db> {
  if (!nodeDbPromise) {
    nodeDbPromise = (async () => {
      const [{ default: Database }, { drizzle: drizzleSqlite }] = await Promise.all([
        import('better-sqlite3'),
        import('drizzle-orm/better-sqlite3'),
      ])
      const sqlite = new Database(process.env.DB_PATH ?? './local.db')
      sqlite.pragma('journal_mode = WAL')
      sqlite.pragma('foreign_keys = ON')
      // The D1 and better-sqlite3 drivers share the same schema-typed surface
      // for the read/write patterns we use; cast through unknown to satisfy TS.
      return drizzleSqlite(sqlite, { schema }) as unknown as Db
    })()
  }
  return nodeDbPromise
}

/**
 * Get the request-scoped DB handle.
 *
 * Routing rule:
 *   - NODE_ENV !== 'production'  → better-sqlite3 against ./local.db.
 *     Covers `next dev`, `npm run test`, scripts run via `tsx`. The OpenNext
 *     dev shim returns a working but EMPTY miniflare D1 in `next dev`, which
 *     would silently fail every query — we route around it.
 *   - NODE_ENV === 'production'  → D1 binding via OpenNext.
 *     Covers `npm run preview` (wrangler dev), `npm run deploy`, and the
 *     deployed Worker.
 *
 * To force the prod path locally, set `NODE_ENV=production` (e.g. when
 * dogfooding the OpenNext build with `npm run preview`).
 */
export async function getDb(): Promise<Db> {
  if (process.env.NODE_ENV !== 'production') {
    return getNodeDb()
  }

  const { getCloudflareContext } = await import('@opennextjs/cloudflare')
  const ctx = await getCloudflareContext({ async: true })
  const d1 = (ctx.env as { DB?: D1Database }).DB
  if (!d1) throw new Error('D1 binding `DB` is missing — check wrangler.jsonc')
  return drizzleD1(d1, { schema })
}

export { schema }
export type { Db }
