# CLAUDE.md — project memory for VC Stack

Context for future Claude (or any AI) sessions working on this repo. Keeps you from re-discovering decisions that are already locked in.

## What this is

**VC Stack** — the curated tool catalog for Indian venture capital firms, shipped at `indianvcs.com/vc-stack`. 119 tools across 17 categories, each entry researched from the tool's own website and written in a specific editorial voice (below).

Owned by **Indian VCs** / **DealQuick Labs Private Limited**. Not a clone of vcstack.io — India-first in tone, examples, and tool selection (Taghash, AngelList India, LetsVenture, Inc42, The Ken all weighted heavily).

## Entry points — where to look

1. **`src/lib/tools-data.ts`** — the 119-tool catalog. Source of truth for the **public** site.
2. **`src/lib/data.ts`** — fetch helpers. Contains `FEATURED_TOOL_SLUGS` (canonical featured list).
3. **`src/lib/db/schema.ts`** — Drizzle schema for the **admin backend** (D1 in prod, SQLite in dev).
4. **`src/app/(main)/*`** — all public routes. `(main)` is a route group, not part of the URL.
5. **`src/app/admin/*`** — admin portal (gated by [`src/middleware.ts`](src/middleware.ts) + `requireAdmin()`).
6. **`src/app/layout.tsx`** — root metadata, JSON-LD structured data, GTM.
7. **`next.config.ts`** — `basePath: '/vc-stack'`; security headers; required for Webflow Cloud mount.

## Architecture decisions (and *why*)

### basePath `/vc-stack`
The app deploys **under** `indianvcs.com/vc-stack`, not at root. Next.js auto-prefixes every route, `<Link>`, and asset URL. Any hand-written absolute paths must include `/vc-stack` (rare — only in metadata `canonical` / OG `url` / JSON-LD `@id`).

### Public site: D1 with static fallback
- **Public** (`src/app/(main)/*`): reads from D1 via `src/lib/db/queries.ts`, with `src/lib/static-catalog.ts` as the fallback when D1 is empty or unreachable. The wrappers live in `src/lib/data.ts`.
- **Admin** (`src/app/admin/*`): reads and writes the same D1 tables.

The fallback is what makes the build safe — `next build` runs before D1 is bound, and the prerender quietly drops to STATIC. Once D1 is seeded, every read flows through it. Admin writes call `revalidatePath` to bust the prerender cache.

The static catalog at `src/lib/static-catalog.ts` is also the **seed source** (`scripts/seed.ts` reads it). Don't delete it.

### Admin portal — what it is
Editor-only newsroom at `/admin/login`. Triages tool / firm-stack submissions and shows an audit log. Built around:
- iron-session cookies (encrypted + signed)
- bcrypt password verification (env-based single admin)
- IP-based rate limiting on the login endpoint
- `src/middleware.ts` with `runtime = 'experimental-edge'` gating every `/admin/*` and `/api/admin/*`. **Do NOT rename to `proxy.ts`** — Next.js 16's new `proxy.ts` convention is Node.js-runtime only, and OpenNext for Cloudflare Workers (Webflow Cloud) rejects Node.js middleware ("Node.js middleware is not currently supported"). The legacy `middleware.ts` name is the only path that still supports Edge.
- `requireAdmin()` defense-in-depth on every admin page
- `audit_log` table writes for every mutation

Full docs: [`ADMIN.md`](ADMIN.md). Setup steps: [`SETUP.md`](SETUP.md).

### Security headers
`next.config.ts` exports `headers()` setting CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP. The CSP allows GTM, Google Analytics, the Google favicon service, the Webflow CDN, and Substack iframes — tune with care, test in `Content-Security-Policy-Report-Only` mode first.

### Canonical Featured list
`FEATURED_TOOL_SLUGS` in `src/lib/data.ts`. Edit that array to change what rotates in the homepage hero **and** what appears in every tool page's inline "Featured Tools" row. Both surfaces read from the same source.

### Canonical Featured list
`FEATURED_TOOL_SLUGS` in `src/lib/data.ts`. Edit that array to change what rotates in the homepage hero **and** what appears in every tool page's inline "Featured Tools" row. Both surfaces read from the same source.

### Logo
The Indian VCs primary wordmark lives inline at [`src/components/ui/IndianVCsLogo.tsx`](src/components/ui/IndianVCsLogo.tsx). **Do not** replace with a text wordmark or a different SVG — it's the only logo used across header and footer, and must link to `https://indianvcs.com`.

### Favicon
`src/app/icon.svg` — cream rounded square (`#F5F0E8`) with centered red bar (`#D21905`). Next.js auto-serves it as the favicon site-wide. If someone pastes a PNG at `src/app/icon.png`, Next will prefer that; keep them consistent.

## Content tone — the rules

**Every tool description follows the 80/20 rule:**
- **~80% plain, generic product explanation** — a non-VC reader can follow
- **~20% VC-use clause at the end** — one sentence starting with "Widely used by VC firms to…" or similar

**Length**: description = 40–70 words, 2–4 sentences. shortDesc ≤ 80 chars.

**useCases**: exactly **2** bullets, verb-first, 12–20 words each.

### Banned phrases (auto-reject)

These phrases were the "too VC-insider" voice we moved away from:

```
private capital, partner's head, fund's nervous system,
second brain for the whole fund, RoC filings, AIF reporting,
SEBI, zero-entry design, dealflow runs, JV partners, carry admin
unleash, one-stop, supercharge, seamless, leverage
```

Allowed VC vocabulary (sparingly): VC, investor, fund, portfolio, founder, dealflow, LP, diligence, warm intro, syndicate, SPV.

### Tone reference (what "good" looks like)

**Slack:**
> "The default platform for internal team communication, with channels, threads, and shared rooms that replace endless reply-all email. The app directory pipes alerts from CRMs, databases, and project tools into the place teams already look. Widely used by VC firms for partner discussion, shared channels with portfolio companies, and the searchable team memory the inbox never provides."

**ChatGPT:**
> "The most widely adopted AI product in the world, and in finance too. Custom GPTs, document analysis, browsing, canvas, and voice turn it into less a single tool than a portable reasoning layer. Widely used by VC firms to draft first-cut memos from decks, summarise earnings transcripts, and run diligence Q&A against Custom GPTs loaded with firm playbooks."

Vary openers — do not start every description with "X is…". Keep the register calm / declarative / vcstack.io-adjacent.

## Common tasks

### Add a tool (publicly visible)
**Static catalog edit** — this is what currently makes a tool appear on the public site.

1. Open `src/lib/tools-data.ts`.
2. Append a new `t(...)` inside the correct category block (`// CRM`, `// Data`, etc.).
3. ID format: `t-N` where N is the next unused integer.
4. Slug: kebab-case, unique across all tools.
5. Write shortDesc / description / useCases per the rules above.
6. `npm run dev`, visit `/vc-stack/product/<slug>` to sanity-check.
7. `npx tsc --noEmit`, commit.

> Note: editing tools through `/admin` writes to D1 only. Until the public site reads from D1, those edits don't appear publicly.

### Triage a tool submission
1. Sign in at `/admin/login`.
2. `/admin/submissions/tools` → review the queue.
3. Approve / Reject / Archive. Approve creates a `tools` row in D1 (D1-only — see note above).
4. Audit log is appended automatically.

### Rotate the admin password
```bash
NEW_HASH=$(npx tsx scripts/hash-password.ts 'new-strong-password')
wrangler secret put ADMIN_PASSWORD_HASH    # paste $NEW_HASH
```
Force-logout all sessions: also rotate `SESSION_PASSWORD` (`openssl rand -base64 48 | wrangler secret put SESSION_PASSWORD`).

### Rewrite content for many tools
See the agent prompts in prior commits. The pattern:
1. Dispatch parallel research agents, one per category group
2. Each agent writes to `/tmp/vcstack-copy/deep-BN.json`
3. Merge outputs, validate (length + banned phrases)
4. Apply via `/tmp/vcstack-copy/apply_copy.py` — regex-rewrites each `t(...)` call, preserving id / name / slug / url / pricing / category / isFeatured / extras, replacing only shortDesc / description / useCases.

### Fix a broken logo
Logos come from Google's favicon service by default: `https://www.google.com/s2/favicons?domain=<host>&sz=128`. For domains that return a placeholder 1×1 PNG (currently: `x.com`, `yourstory.com`, `exa.ai`), add an override to `LOGO_OVERRIDES` in `src/lib/tools-data.ts`:

```ts
const LOGO_OVERRIDES: Record<string, string> = {
  'your-tool-slug': 'https://path/to/actual-logo.png',
}
```

### Add / rename a category
Edit `STATIC_CATEGORIES` in `src/lib/data.ts`. Use a new `id` (`cat-N`) and slug. Update any affected tool's `categoryId`. Runtime counts auto-update via the `_count` backfill at the bottom of the file.

## Deploy

### Public site only (no admin changes)
```bash
git push origin main  # triggers Webflow Cloud auto-build
```

The public site runs on static data. Substack URL is a hardcoded public constant in `src/lib/substack.ts`.

### Admin backend
The admin needs three Cloudflare Worker secrets and a D1 database. Full setup in [`SETUP.md`](SETUP.md). Quick reference:

```bash
# Once
wrangler d1 create vc-stack                                # paste id into wrangler.jsonc
echo 'admin@indianvcs.com' | wrangler secret put ADMIN_EMAIL
npx tsx scripts/hash-password.ts 'pw' | wrangler secret put ADMIN_PASSWORD_HASH
openssl rand -base64 48 | wrangler secret put SESSION_PASSWORD

# Per release
npx wrangler d1 migrations apply vc-stack --remote
npm run deploy
```

Local preview: `npm run preview`. Needs `wrangler login` once.

### After first production deploy
1. **Google Search Console** → Sitemaps → submit `https://indianvcs.com/vc-stack/sitemap.xml`.
2. **Rich Results Test** (`search.google.com/test/rich-results`) → paste a product URL → confirm `SoftwareApplication` + `BreadcrumbList` detected.
3. **OG preview** (`opengraph.xyz`) → paste home URL and a tool URL → confirm dynamic branded cards.

## Gotchas we've hit

- **`opengraph-image.tsx` (Satori / `next/og`)**: any `<div>` with >1 child needs explicit `display: 'flex'` / `'contents'` / `'none'`. No `display: 'inline-block'`. Text nodes count as children.
- **SVG `width="auto"`** is invalid. Use CSS `style.width: 'auto'` instead. Lighthouse catches it as a console error.
- **Metadata `opengraph-image`** URLs are content-hashed by Next. Don't hardcode `/opengraph-image` — let `<head>` emit the hashed form.
- **Sitemap / robots files** must be at `src/app/sitemap.ts` and `src/app/robots.ts` (not inside `(main)`). They auto-serve at `/vc-stack/sitemap.xml` etc.
- **`app/opengraph-image.tsx` in route groups** works but requires the route group to use it on its own pages. Pages outside the group (like `src/app/page.tsx` which wraps `<PageLayout>` directly) get only the root-level OG image.
- **Turbopack dev caching**: if a new file convention (new `opengraph-image.tsx`, `sitemap.ts`, etc.) isn't discovered, kill the dev server, `rm -rf .next`, and restart. Turbopack occasionally misses metadata-route detection.
- **Content rot from the banned-phrases list**: if you paste content from elsewhere and it contains "unleash" / "one-stop" / "supercharge" / "leverage", the validation will reject it. Fix the source before pasting.

## The commit history you're inheriting

```
ccad84b  feat(seo): per-tool + per-category OG images, a11y 100, metadata polish
469e8e1  feat(seo): sitemap, robots, per-page canonicals, OG image, JSON-LD
f7b27ea  feat(brand): use official Indian VCs primary logo everywhere
6542183  feat(deploy): migrate proxy.ts → middleware.ts (Edge runtime)
0a0065d  feat(deploy): Webflow Cloud config + /vc-stack basePath
7d22a05  feat(vcstack): category+tool page rewrite, ⌘K search, Footer, deep content pass
```

Each commit body describes the *why*. Worth reading when you hit a decision point.

## Out of scope / deferred

These are tracked but intentionally not built yet. Don't scope-creep them into unrelated PRs.

- Multi-admin via the `admin_users` table (schema is ready, login route still env-based).
- pSEO content editing through `/admin` (currently only via `src/lib/category-content.ts`).
- Privacy + Terms pages (footer links 404; the user will handle this separately).
- Newsletter archive / Substack embed on home.
