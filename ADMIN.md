# Admin portal

Editor-only newsroom for triaging tool / firm-stack submissions and viewing the
audit log. Runs at `https://indianvcs.com/vc-stack/admin/login`. Locally:
`http://localhost:5000/vc-stack/admin/login`.

> Setup steps live in [`SETUP.md`](./SETUP.md). This doc explains what the
> portal does, how auth works, and how to operate it day-to-day.

## What's in scope

| Page | What it does |
|---|---|
| `/admin/dashboard` | Counts of active tools, sections, pending submissions, plus recent admin activity. |
| `/admin/tools` | Search, filter, paginate the catalog. Edit, archive, restore. New tool → form. |
| `/admin/tools/new` and `/admin/tools/[id]/edit` | Full tool form (name, slug, description, useCases, websiteUrl, logoUrl, section, extra sections, pricing, featured + order). |
| `/admin/categories` | List sections with live tool counts. Edit, archive (refused if section still has active tools), restore, new. |
| `/admin/featured` | Reorder the canonical Featured list. Up/down to reorder, Save to commit. Removed rows get unfeatured. |
| `/admin/submissions/tools` | Inbox for tool submissions from `/submit-product`. Approve → creates a `tools` row. Reject / archive change status only. |
| `/admin/submissions/stack` | Inbox for firm-stack submissions from `/contribute/stack`. Editor types in the slug of the published firm-profile page; we mark the submission as `published`. |
| `/admin/audit` | Last 200 admin actions, newest first. Login attempts (success & failure) are included. |

## How edits reach the public site

The public site (`src/lib/data.ts`) reads from D1 first and falls back to the
static catalog (`src/lib/tools-data.ts`) on any DB failure or empty result.

In practice, that means:

- Build-time prerendering happens against the static catalog (D1 isn't bound at build).
- After the initial deploy, D1 is bound and seeded — every read goes through D1.
- Admin writes call `revalidatePath` to bust the prerender cache.
- If D1 ever becomes unreachable, the public site silently degrades to the static
  catalog (last known good).

This is intentional: the static catalog is the load-bearing fallback. Don't delete
`tools-data.ts`. Re-seed when adding/removing many tools (`npx tsx scripts/seed.ts`).

## How auth works (the actual model — no Prisma, no NextAuth)

- **Single admin** loaded from env: `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`.
  Multi-admin via the `admin_users` table is on the schema but not wired into
  the login route yet.
- **Passwords are bcrypt**. Cost factor 12 (~250ms per verify). Generate hashes
  with `npx tsx scripts/hash-password.ts 'pw'`. Plaintext is never stored.
- **Sessions are iron-session cookies**: AES-256-GCM encrypted + HMAC signed
  with `SESSION_PASSWORD` (32+ char random). Tampering invalidates the cookie —
  there is no way to forge a session without the secret.
- **Cookie is `httpOnly`, `secure` (in prod), `sameSite=strict`**. JS can't read
  it; cross-site requests don't carry it. The session also has an absolute
  7-day expiry independent of the cookie's `maxAge`.
- **Edge proxy** at [`src/proxy.ts`](src/proxy.ts) gates every `/admin/*` and
  `/api/admin/*` request. Unauthed traffic redirects to `/admin/login` (HTML)
  or returns 401 (API). (Next.js 16 renamed this file convention from
  `middleware.ts` → `proxy.ts`. The function inside is `proxy()`, not
  `middleware()`. Renaming either silently disables the gate.)
- **Defense in depth**: every admin page also calls `requireAdmin()`, every
  admin server action calls `requireAdminAction()`. If the proxy ever fails
  silently (config drift, edge runtime quirks), the page still refuses to render.

## Login flow

1. POST `/api/admin/login` with `{ email, password }`.
2. Server checks Origin header (CSRF belt-and-braces — `sameSite=strict` already
   prevents the cookie from being attached cross-site).
3. IP-based rate limit: 5 attempts / 15 min. 429 with `Retry-After` if exceeded.
4. `bcrypt.compare(password, ADMIN_PASSWORD_HASH)` — constant-time.
5. On success: session set, rate limit cleared, `audit_log` row inserted with
   `action=login, entity=session`.
6. On failure: 401 with a uniform "Invalid email or password" message — we do
   not disclose whether the email is correct. Failed attempt is logged.

## Operating the portal

### Approving a tool submission

`/admin/submissions/tools` → click **Approve**. We:

1. Verify the submission's `categoryId` still exists.
2. Generate a slug from the tool name (collisions get a numeric suffix, then a
   random short suffix as a last resort).
3. Insert a new row into `tools` with `pricingModel=FREEMIUM` and
   `isFeatured=false` by default.
4. Update the submission with `status=approved` and `approvedToolId` pointing
   at the new tool row.
5. Write two audit entries: `create tool` and `publish tool_submission`.

After approval the tool is in the database but **does not appear on the public
site** until the public reads from D1 (see "What's not here yet" above).

### Rejecting / archiving

Both update `status` and write an audit entry. Reject means "we looked, declined
on merit." Archive means "spam / duplicate / wrong category — get it out of the
queue."

### Marking a firm-stack submission published

These submissions become editorial firm-profile pages, written by hand
elsewhere. When the page goes live, paste its slug (e.g. `accel-india-stack`)
in the input and click **Mark published**. The slug is validated as
lowercase-alphanumeric-with-hyphens and stored in `published_slug` for
reference. We do **not** auto-create a page.

## Gotcha: escaping `$` in `.env.local`

bcrypt hashes start with `$2b$12$...`. Next.js's env loader (`@next/env`) interpolates
`$VAR` syntax even inside single-quoted values, which silently mangles the hash.
**Always escape every `$` with `\\$`** in `.env.local`:

```bash
# WRONG — silently mangled to ".XDrepfu..." (length 42)
ADMIN_PASSWORD_HASH=$2b$12$AW5Mu3YfPXt.XDrepfuzXOWut/...

# RIGHT — preserves the full hash (length 60)
ADMIN_PASSWORD_HASH=\$2b\$12\$AW5Mu3YfPXt.XDrepfuzXOWut/...
```

`wrangler secret put` does NOT have this problem — paste the hash unescaped there.

## Recovering / rotating admin credentials

### Reset the password

```bash
NEW_HASH=$(npx tsx scripts/hash-password.ts 'new-strong-password')
wrangler secret put ADMIN_PASSWORD_HASH    # paste $NEW_HASH
```

Old sessions remain valid until the cookie expires. To force logout of all
sessions, also rotate `SESSION_PASSWORD`:

```bash
openssl rand -base64 48 | wrangler secret put SESSION_PASSWORD
```

### Lost the password and locked out

Same procedure — generate a new hash, push the secret, wait for redeploy.
No account-recovery flow exists by design (single admin).

## Audit log retention

Forever. The `audit_log` table never auto-prunes. If it grows large enough to
matter, archive older rows to a flat file via:

```sql
SELECT * FROM audit_log WHERE created_at < UNIXEPOCH('now', '-1 year') * 1000;
```

## Threat model (what this portal protects against, what it doesn't)

**Defended:**
- Stolen session cookie — sameSite=strict + httpOnly + signed cookie + 7-day
  absolute expiry.
- Brute-forced password — bcrypt cost 12 + IP rate limit + uniform error.
- CSRF — sameSite=strict + Origin header check on the JSON login endpoint.
- Predictable session forgery (the original audit finding) — cookie is
  encrypted, not a constant string.
- Unauthenticated access to admin pages — edge proxy (Next.js 16 `proxy.ts`
  convention) + per-page `requireAdmin()` defense-in-depth.
- Clickjacking on the login page — `X-Frame-Options: DENY` + CSP
  `frame-ancestors 'none'`.

**Not defended:**
- Compromised admin laptop — if the admin's machine is rooted, the attacker
  gets the cookie. Standard.
- Phishing the admin into typing the password into a lookalike — out of scope.
- Distributed brute force — the rate limit is per Worker isolate; an attacker
  hitting many isolates can exceed the per-isolate quota. Bcrypt cost 12 + a
  strong (24+ char) password makes this impractical anyway. If global rate
  limiting becomes important, swap the in-memory limiter in
  [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts) for a KV-backed counter —
  the `check`/`reset` interface is already in place.
