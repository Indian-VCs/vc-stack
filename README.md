# VC Stack

The definitive tool catalog for Indian venture capital firms.

**Live:** [`indianvcs.com/vc-stack`](https://indianvcs.com/vc-stack)

119 tools across 17 categories — every entry researched from the tool's own website and written in the Indian VCs editorial voice. Covers the full VC operating stack: CRM, dealflow data, research, portfolio management, AI, communication, transcription, mailing, calendar, and the rest.

Curated by **Indian VCs**, built by **DealQuick Labs Private Limited**.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | Cloudflare Workers (via OpenNext) |
| Hosting | Webflow Cloud |
| Language | TypeScript 5 |
| Styling | Tailwind 4 + CSS custom properties |
| Data | Static catalog (`src/lib/tools-data.ts`) — single source of truth |

The site is mounted at `/vc-stack` on `indianvcs.com`. Every route, `<Link>`, and static asset is automatically prefixed with that basePath (see `next.config.ts`).

---

## Repo layout

```
src/
├── app/
│   ├── (main)/                    # Public routes — all mounted under /vc-stack
│   │   ├── category/[slug]/       # Category page + dynamic OG image
│   │   ├── product/[slug]/        # Tool detail page + dynamic OG image
│   │   ├── all-categories/        # Category index grid
│   │   ├── market-map/            # Full visual poster
│   │   ├── search/                # Full-page results
│   │   ├── submit-product/        # Tool-suggestion form (v2)
│   │   └── layout.tsx             # Navbar + Footer + CommandK
│   ├── og-image/route.tsx         # Default site OG image (1200×630)
│   ├── sitemap.ts                 # Dynamic sitemap
│   ├── robots.ts                  # robots.txt
│   ├── layout.tsx                 # Root metadata, JSON-LD, GTM
│   ├── page.tsx                   # Home (hero + market-map + categories + FAQ)
│   └── icon.svg                   # Favicon
├── components/
│   ├── layout/   (Navbar, Footer, PageLayout)
│   ├── cards/    (ToolCard, CategoryCard)
│   └── ui/       (CommandK, HeroFeaturedTool, MarketMapPoster,
│                  FeaturedToolStrip, LogoCard, IndianVCsLogo,
│                  FaqSection, …)
└── lib/
    ├── tools-data.ts              # 👈 source of truth for the 119-tool catalog
    ├── data.ts                    # Fetch helpers + FEATURED_TOOL_SLUGS canonical list
    ├── site.ts                    # Public URL/basePath helpers for SEO
    ├── og-images.tsx              # Shared social image renderer
    ├── types.ts                   # Tool / Category / pagination/search types
    ├── stats.ts                   # Exported counts + CATEGORY_COUNTS for SEO
    └── substack.ts                # Hardcoded newsletter URL (public)
```

Brand assets (primary logo SVG, favicon variants) live at `/Users/pc/Documents/Indian VCs Logo Kit/` and are inlined into React via [`src/components/ui/IndianVCsLogo.tsx`](src/components/ui/IndianVCsLogo.tsx).

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5000/vc-stack](http://localhost:5000/vc-stack).

The `/vc-stack` prefix is mandatory — hitting `/` returns 404. Internal navigation via Next.js `<Link>` handles the prefix automatically.

### Environment variables

None required. The app runs with zero configuration. The Substack URL is a hardcoded constant (`src/lib/substack.ts`) since the newsletter is public. Tool data lives entirely in `src/lib/tools-data.ts`. There's no database to wire up, no admin panel to secure.

---

## Deploying

Pushes to `main` are picked up automatically by Webflow Cloud:

```bash
git push origin main
# → Webflow Cloud auto-detects webflow.json, runs the OpenNext build,
#   ships the Cloudflare Worker under indianvcs.com/vc-stack.
```

No env vars need setting in Webflow Cloud — the app runs on static data and has no secrets to inject.

Useful local commands:

```bash
npm run dev       # dev server on port 5000, with hot reload
npm run build     # Next production build
npm run preview   # local Cloudflare Worker preview via OpenNext
npm run deploy    # direct deploy to Cloudflare (needs `wrangler login` once)
npx tsc --noEmit  # type check
```

---

## Adding or editing a tool

All 119 tools live in [`src/lib/tools-data.ts`](src/lib/tools-data.ts). Each entry is a single `t(...)` call with positional args:

```ts
t('t-123', 'Name', 'slug',
  'Punchy ≤80-char tagline used on cards',
  'Full description (2–4 sentences, 40–70 words). 80% plain product explanation, 20% VC-use clause at the end.',
  'https://example.com',
  'FREEMIUM',            // FREE | FREEMIUM | PAID | ENTERPRISE
  'cat-1',               // primary category ID
  true,                  // isFeatured?
  ['productivity'],      // extraCategorySlugs
  [                      // useCases — exactly 2, verb-first, 12-20 words
    'Verb-first bullet about how VCs use this',
    'Second bullet',
  ],
)
```

The rules of the house voice (banned phrases, structure, examples) live in [`CLAUDE.md`](CLAUDE.md). Edit the file, run `npm run dev`, eyeball the tool detail page, commit.

Every surface — home hero, category pages, Cmd+K search, OG share cards, JSON-LD — reads from this one file. There is no other "database" to sync.

### Featured tools

The canonical featured-tool list is the `FEATURED_TOOL_SLUGS` constant in `src/lib/data.ts`. Edit that array to change which tools rotate in the homepage hero and appear in the "Featured Tools" strip under every tool page.

---

## Content workflow

1. Research from the tool's own website (primary source)
2. Cross-reference `vcstack.io` listings where they exist, paraphrase only
3. Write per the tone rules in `CLAUDE.md`
4. Validate: 40–70 words, 2 bullets per `useCases`, no banned phrases
5. `npx tsc --noEmit`
6. Dev-server review
7. Commit — descriptive subject, detail what changed

For bulk rewrites (more than ~10 tools at once), use the `/tmp/vcstack-copy/apply_copy.py` pattern from prior refresh passes — it preserves every entry's existing id / url / categoryId / isFeatured while updating `shortDesc`, `description`, and `useCases`.

---

## SEO

- Root + per-page metadata in `src/app/layout.tsx` and each `generateMetadata`
- Dynamic sitemap at `/vc-stack/sitemap.xml` (139 URLs)
- `robots.txt` at `/vc-stack/robots.txt` with sitemap pointer
- Per-tool and per-category OG images (1200×630, served via Next.js `ImageResponse`)
- JSON-LD: `WebPage`, `Organization`, `WebSite`, `ItemList`, `SoftwareApplication`, `BreadcrumbList`, `CollectionPage`, `FAQPage`
- Canonical URLs respect `/vc-stack` basePath

After deploy, submit `https://indianvcs.com/vc-stack/sitemap.xml` in Google Search Console once. GSC covers the sub-path automatically since `indianvcs.com` is already a verified property.

---

## License

Content curated by Indian VCs.
Code owned by DealQuick Labs Private Limited.
All tool names and logos belong to their respective owners.
