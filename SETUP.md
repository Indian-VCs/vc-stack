# Admin dashboard — setup

Steps to bring up the DB-backed admin once the code is merged. Run these once
locally, then again with `--remote` when you're ready to ship.

## 1. Install (one-time)

```bash
npm install
```

This pulls drizzle-orm, bcryptjs, iron-session, drizzle-kit, better-sqlite3.

## 2. Generate + apply migrations

```bash
# Generate the SQL migration from the Drizzle schema
npx drizzle-kit generate

# Apply to local SQLite (./local.db) — used by `npm run dev`
npx drizzle-kit push

# Seed local DB from the static catalog
npx tsx scripts/seed.ts --reset
```

You should see: `✓ seeded 17 categories and 119 tools into ./local.db`.

## 3. Generate the admin password hash

```bash
npx tsx scripts/hash-password.ts 'your-very-strong-password-here'
```

Copy the printed `$2b$12$...` string — you'll paste it as `ADMIN_PASSWORD_HASH`.

## 4. Local env (`.env.local`)

Create `.env.local` at the repo root:

```bash
ADMIN_EMAIL=you@indianvcs.com
ADMIN_PASSWORD_HASH=$2b$12$...        # from step 3
SESSION_PASSWORD=                     # 32+ random chars; generate with: openssl rand -base64 48
```

Restart `npm run dev`. Visit http://localhost:5000/vc-stack/admin/login.

## 5. Cloudflare D1 (production)

One-time:

```bash
wrangler login
wrangler d1 create vc-stack
# Copy the printed database_id and paste into wrangler.jsonc under `d1_databases`
```

Add to `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "vc-stack",
    "database_id": "<paste-from-wrangler-create>"
  }
]
```

Apply migrations + seed to remote D1:

```bash
npx wrangler d1 migrations apply vc-stack --remote
npx wrangler d1 execute vc-stack --remote --command "$(cat scripts/seed.sql)"
# (Or run the seed script against a local file then pipe — see scripts/seed.ts header)
```

Set Cloudflare secrets:

```bash
echo 'you@indianvcs.com'         | wrangler secret put ADMIN_EMAIL
echo '$2b$12$...'                | wrangler secret put ADMIN_PASSWORD_HASH
openssl rand -base64 48          | wrangler secret put SESSION_PASSWORD
```

Deploy:

```bash
npm run deploy
```

## Day-to-day

- All catalog edits flow through `/vc-stack/admin`. The `tools-data.ts` file is now
  only the **seed source** — once D1 is the source of truth, edits to that file
  do nothing in production.
- To re-seed (e.g. after schema changes), run step 2 again with `--reset`.
- Every admin write is logged to the `audit_log` table — viewable on the dashboard.
