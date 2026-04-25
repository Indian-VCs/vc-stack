import type { Config } from 'drizzle-kit'

/**
 * Drizzle Kit config — generates migrations from `src/lib/db/schema.ts`.
 * Migrations are dialect-portable SQLite, applied to:
 *   - local dev: `local.db` via better-sqlite3
 *   - production: Cloudflare D1 via `wrangler d1 migrations apply vc-stack`
 */
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  // For local dev introspection only — never used by the running app.
  dbCredentials: { url: 'file:./local.db' },
} satisfies Config
