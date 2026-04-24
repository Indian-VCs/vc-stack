# Programmatic SEO Strategy — VC Stack

**Status:** Draft v1 · Owner: TBD · Last updated: 2026-04-25

Plan to grow organic traffic by building SEO-optimized pages at scale, leveraging the 17-category tools directory + Indian-VC proprietary angle. Rank for category, curation, and comparison queries — and build topical authority that lifts head terms like "VC tech stack" and "VC tech landscape" over time.

---

## TL;DR

1. **Phase 1 (wk 1–2):** Enrich all 17 category pages — unique intro, buying criteria, top picks, FAQ, schema. This is the highest-ROI move.
2. **Phase 2 (wk 3–4):** Layer curation pages (`/best/[category]`) and a head-term pillar (`/guide/vc-tech-stack`).
3. **Phase 3 (wk 5+):** Add comparisons (`/vs/a-vs-b`) and persona pages (`/for/seed-vcs`, etc.).
4. **Ongoing:** Monthly content refresh + GSC monitoring.

Target: rank for 50+ long-tail queries in 3 months; rank in top-20 for "VC tech stack" / "VC tech landscape" in 6 months.

---

## Current state (what we have)

| Asset | Count | Notes |
|---|---|---|
| Categories | 17 | CRM, Data, Research, News, AI, Portfolio Mgmt, Admin/Ops, Automation, Communication, Mailing, Calendar, Transcription, Voice-to-Text, Productivity, Vibe Coding, Browser, Other Tools |
| Tool pages | ~80+ | Auto-gen metadata, broadsheet design |
| Deploy path | `/vc-stack/...` | Subfolder (good for SEO — consolidates authority) |
| Stack | Next.js 16 + Prisma + Cloudflare | Static gen via `generateStaticParams` |

**Current category page weaknesses (from reading `src/app/(main)/category/[slug]/page.tsx`):**
- Title metadata is just the category name (thin)
- Description falls back to `"Browse ${name} tools for VC firms."` (duplicate across pages)
- Body is breadcrumb + title + italic pull-quote + tool grid — no unique content
- No FAQ, no buying guide, no editorial picks, no schema markup
- No related-category cross-linking
- **Result:** Google sees 17 pages that look like templates with swapped variables = thin-content risk

---

## Target keyword buckets

| Bucket | Difficulty | Example queries | Strategy |
|---|---|---|---|
| **Branded** | Easy | "vc stack newsletter", "indianvcs stack" | Homepage + newsletter page |
| **Head / pillar** | Hard | "vc tech stack", "vc tech landscape", "venture capital tools" | Pillar page + sitewide authority |
| **Category (pSEO sweet spot)** | Medium | "crm for vcs", "deal sourcing tools", "portfolio management software venture capital" | **Enriched category pages** |
| **Curation (pSEO)** | Medium | "best crm for vcs 2026", "top deal sourcing tools" | `/best/[category]` overlays |
| **Comparison (high intent)** | Low–Med | "affinity vs attio", "harmonic vs specter" | `/vs/[a]-vs-[b]` pages |
| **Persona** | Medium | "tools for seed vcs", "crm for early stage investors" | `/for/[persona]` pages |

---

## Playbook 1 — Enriched Directory (Phase 1)

**Goal:** Turn the 17 thin category pages into ranking assets.

**URL:** `/vc-stack/category/[slug]` (no change)
**Pattern:** `[category] tools for VCs` · `[category] software for venture capital`
**Pages:** 17
**Effort:** 1–2 weeks
**Expected:** 20–40 category queries ranking within 8 weeks

### New category page structure

```
┌────────────────────────────────────────┐
│ Breadcrumb                             │  (existing)
│ Broadsheet header: title + pull quote  │  (existing — extend pull to 150+ chars)
│                                        │
│ NEW: Intro paragraph (150–250 words)   │  ← unique per category
│ NEW: What to look for (3–5 criteria)   │  ← buying guide
│ NEW: Top picks (3 featured tools)      │  ← editorial + rationale
│                                        │
│ Subcategory tabs                       │  (existing)
│ Tools grid                             │  (existing)
│                                        │
│ NEW: FAQ (3 Q&As)                      │  ← captures long-tail
│ NEW: Related categories                │  ← internal linking
│                                        │
│ JSON-LD: ItemList + Breadcrumb + FAQ   │  ← schema markup
└────────────────────────────────────────┘
```

### Data model changes (`prisma/schema.prisma`)

```prisma
model Category {
  id            String         @id @default(cuid())
  name          String         @unique
  slug          String         @unique
  description   String?        // existing — used as pull quote (extend to 150+ chars)
  icon          String?

  // NEW pSEO fields
  intro         String?        // 150–250 word unique intro (markdown ok)
  buyingCriteria String?       // JSON: [{label, description}]
  faqs          String?        // JSON: [{question, answer}]
  topPickSlugs  String?        // JSON: ["affinity", "attio", "harmonic"]
  relatedSlugs  String?        // JSON: ["data", "research", "ai"]
  seoTitle      String?        // override for <title>
  seoDescription String?       // override for meta description
  heroAngle     String?        // one-line pitch (used in meta description fallback)

  subCategories SubCategory[]
  tools         Tool[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

Keep as strings (JSON-serialized) since SQLite. Parse at the data layer.

### Metadata function (before → after)

**Before** (`page.tsx:12-20`):
```typescript
return {
  title: category.name,
  description: category.description ?? `Browse ${category.name} tools for VC firms.`,
}
```

**After:**
```typescript
const title = category.seoTitle ?? `${category.name} for VCs · Top Tools in 2026 | VC Stack`
const description = category.seoDescription
  ?? category.heroAngle
  ?? `The ${category.name.toLowerCase()} tools India's top VCs actually use. Curated picks, buying criteria, and honest comparisons — updated 2026.`

return {
  title,
  description,
  alternates: { canonical: `/vc-stack/category/${slug}` },
  openGraph: {
    title,
    description,
    type: 'website',
    url: `/vc-stack/category/${slug}`,
  },
  twitter: { card: 'summary_large_image', title, description },
}
```

Rules: title ≤ 60 chars · description 140–160 chars · include year for freshness signal.

### Quality gates per category page

Every enriched category must pass:

- [ ] **Intro:** 150–250 words, unique (no templated variable-swap), mentions India/Indian VCs at least once
- [ ] **Buying criteria:** 3–5 items, each with 15–25 word description
- [ ] **Top picks:** 3 tools, each with 20–40 word rationale explaining *why* a VC would pick it
- [ ] **FAQ:** 3 Q&As, answers 40–80 words each, addresses actual buyer questions
- [ ] **Related categories:** 3–4 adjacent categories linked
- [ ] **Title:** ≤60 chars, unique, includes `for VCs` or `venture capital`
- [ ] **Meta description:** 140–160 chars, unique, includes the primary keyword
- [ ] **JSON-LD:** ItemList + BreadcrumbList + FAQPage rendered
- [ ] **Internal links:** ≥5 outbound links (top picks + related cats + subcategory links)

### Component breakdown

New files to create:
```
src/components/category/
  CategoryIntro.tsx           // renders intro markdown
  BuyingCriteria.tsx          // renders "what to look for" list
  TopPicks.tsx                // 3 featured tools with rationale
  CategoryFAQ.tsx             // accordion, with FAQPage schema
  RelatedCategories.tsx       // cross-links
  CategorySchema.tsx          // JSON-LD injection
```

Modify:
```
src/app/(main)/category/[slug]/page.tsx   // wire in new sections
src/lib/data.ts                            // include new fields
prisma/schema.prisma                       // add fields + migration
```

### Sample content — CRM category (use as template)

**Hero pull (150+ chars):**
> The deal-flow operating system. How Indian VCs track founder relationships, pipeline, and portfolio signals — from first meeting to exit.

**Intro (200 words):**
> For a venture fund, the CRM isn't a sales tool — it's the memory of the firm. Every coffee chat with a founder, every warm intro from an LP, every follow-on signal from a portfolio company lives (or dies) here. Indian VCs have historically bolted this onto HubSpot or Salesforce, but the last three years have seen a generation of purpose-built investor CRMs that treat deal flow, relationship graphs, and portfolio ops as first-class citizens.
>
> We've surveyed what India's active investors — Blume, Elevation, Peak XV, Lightspeed India, and dozens of micro-VCs — actually use in 2026. The answer isn't one tool; it's a stack, usually centered on a core CRM (Affinity, Attio, or Airtable-based custom builds) and layered with enrichment tools, meeting transcription, and LP reporting add-ons.
>
> This page is the working list. Pricing, feature depth, and India-specific fit vary — we've called out the tradeoffs where they matter. If you're evaluating a CRM switch, read the "what to look for" section first; the top three picks below are the ones we'd actually recommend for a fund under $200M AUM.

**Buying criteria (4):**
1. **Relationship graph depth** — Does it auto-capture email/calendar signal, or does your team have to log everything manually? Manual logging = dead data in 6 months.
2. **Deal pipeline + portfolio in one view** — Post-investment, the same founder is still in your CRM. Tools that separate "deal" and "portfolio" force duplicate data entry.
3. **LP and co-investor contact layer** — The best CRMs treat LPs, co-investors, and founders as one contact graph with different views.
4. **India-specific enrichment** — Crunchbase / Pitchbook data thins out for pre-seed Indian founders. Check whether native integrations cover Venture Intelligence, Tracxn, or Inc42.

**Top picks (3):**
1. **Affinity** — The default for mid-sized Indian funds ($100M–$1B AUM). Best-in-class auto-enrichment from email/calendar, deep LP workflow, but priced for teams ≥10 and clunky for custom portfolio fields.
2. **Attio** — The modern alternative. Cleaner UI, flexible data model, fair pricing for emerging-manager funds. Weaker on VC-specific workflows but catching up fast; worth a serious look in 2026.
3. **Airtable (custom build)** — What most <$50M funds actually run. Not a real CRM, but with 2–3 strong scripts you get 70% of Affinity for 5% of the cost. Best for funds with an in-house ops hire.

**FAQs (3):**
- **Q: What CRM do Indian VCs use most?**
  A: Affinity dominates among funds managing $100M+; Attio is rising fast for emerging managers; Airtable-based custom stacks remain common under $50M AUM. Salesforce/HubSpot are legacy choices being phased out as purpose-built investor CRMs have matured.

- **Q: How much does a VC CRM cost in 2026?**
  A: Affinity is typically $150–$300/user/month on annual contracts, with minimums around 10 seats. Attio starts at $29/user/month and scales with feature tiers. Airtable runs $20–$45/user. Budget $50K–$150K/year for a fund of 10 — less if you DIY on Airtable.

- **Q: Is it worth switching CRMs mid-fund?**
  A: Rarely. Migration pain is real — relationship history is the asset, and exports lose fidelity. Switch at fund closes, not mid-deployment. If you're on Salesforce/HubSpot and considering a move, time it to your next fund cycle and run parallel for 3 months.

**Related categories:** Data · Research · Portfolio Management · Admin/Ops

This content depth is the target for all 17 categories.

---

## Playbook 2 — Curation Overlays (Phase 2)

**Goal:** Capture "best [X] for VCs" queries with editorial rankings.

**URL:** `/vc-stack/best/[category]`
**Pattern:** `best [category] for VCs` · `top [category] 2026 venture capital`
**Pages:** 17 initially
**Effort:** 1 week (after Phase 1 — reuses category data)
**Expected:** Rank for "best" modifier queries (often higher CPC intent)

### Structure

- H1: `Best [Category] for VCs in 2026`
- Intro explaining methodology (200 words)
- Ranked list of top 5 with deep rationale per tool (80–120 words each)
- Scoring matrix: price, India fit, team size fit, integrations, maturity
- "How we picked" transparency section
- Link back to the full category page

### Data additions

Reuse `topPickSlugs` from Phase 1; add `curationRationale` JSON field per category with `{slug, rank, rationale, scores}`.

### Key tradeoff

Ranked lists are a commitment. If Affinity is #1 for CRM, you'll get vendor pressure and reader pushback. Publish your methodology (transparency = trust), and update quarterly.

---

## Playbook 3 — Comparisons (Phase 3)

**Goal:** Intercept highest-intent queries ("vendor A vs vendor B").

**URL:** `/vc-stack/vs/[toolA]-vs-[toolB]`
**Pattern:** `[A] vs [B]` · `[A] vs [B] for VCs`
**Pages:** Start with top 10 most-contested pairs:
1. `affinity-vs-attio`
2. `affinity-vs-salesforce`
3. `harmonic-vs-specter`
4. `tracxn-vs-venture-intelligence`
5. `pitchbook-vs-crunchbase`
6. `fireflies-vs-otter`
7. `notion-vs-coda`
8. `linear-vs-jira`
9. `hubspot-vs-attio`
10. `airtable-vs-attio`

**Effort:** 1 week template + 3 days per comparison (content is the bottleneck)

### Structure

- H1: `[A] vs [B]: Which is better for VCs in 2026?`
- TL;DR verdict (1 paragraph, honest recommendation)
- Side-by-side feature comparison table
- Pricing comparison
- "When to pick [A]" / "When to pick [B]" sections
- "What Indian VCs actually use" — survey data or qualitative take
- Related: link to both tool pages + parent category

### Defensibility

Comparison pages are competitive — many affiliate sites already rank. Your edge: the India-VC specificity. "Affinity vs Attio for a Series A-focused Indian fund" is a narrower query with less competition and higher intent.

---

## Bonus — Head-term Pillar (Phase 2, parallel track)

**Goal:** Rank for "VC tech stack" / "VC tech landscape" head terms.

**URL:** `/vc-stack/guide/vc-tech-stack` (or make this the `/market-map` page)
**Type:** Long-form pillar (2,000–3,000 words)
**Content:**
- What is a VC tech stack? (definition + why it matters)
- The 17 categories, each with a 100-word summary linking to the category page
- How it evolved (2020 → 2026)
- Indian VC-specific context
- Download: the poster/market-map PNG

This is not pSEO — it's a single authoritative page. But it's the spoke all category pages link up to, and it's your shot at "VC tech landscape" rankings.

---

## Persona pages (Phase 3+, optional)

**URL:** `/vc-stack/for/[persona]` — e.g. `/for/seed-vcs`, `/for/growth-vcs`, `/for/cvcs`, `/for/emerging-managers`

**Pages:** 5–8 personas

**Structure:** "The tools a [persona] actually needs" — curated stack across categories, tailored to that persona's workflow.

Defer until Phases 1–2 prove out.

---

## Internal linking architecture

**Hub-and-spoke pattern:**

```
Home (/) 
  └→ All Categories (hub) 
      └→ Category pages (spokes) 
          └→ Tool pages (leaves)
              └→ back to Category + 3 related tools
          └→ Related Categories (lateral)
          └→ /best/[category] (curation variant)
          └→ /vs/... (relevant comparisons)

Home (/)
  └→ /guide/vc-tech-stack (pillar)
      └→ all 17 category pages
```

**Rules:**
- Every tool page → parent category page (done)
- Every tool page → 3 related tools (verify / add)
- Every category page → 3–4 related categories (new)
- Every category page → its `/best/[category]` variant (when Phase 2 ships)
- Pillar page → all 17 category pages
- Footer: link to top 5 categories + all-categories

**Sitemap:**
- Split by page type: `sitemap-categories.xml`, `sitemap-tools.xml`, `sitemap-comparisons.xml`
- Submit to GSC

---

## JSON-LD schema plan

| Page type | Schema |
|---|---|
| Home | `WebSite`, `Organization` |
| Category | `CollectionPage` + `ItemList` + `BreadcrumbList` + `FAQPage` |
| Tool | `SoftwareApplication` + `BreadcrumbList` + `AggregateRating` (when reviews exist) |
| Comparison | `Article` + `BreadcrumbList` |
| Pillar | `Article` + `BreadcrumbList` |

Use a shared `<JsonLd>` component to keep schemas consistent.

---

## What NOT to do

- **Don't spin up location pages** ("VCs in Mumbai", "VCs in Bangalore") — you don't have proprietary firm data, and the SERP is already owned by Crunchbase/Tracxn.
- **Don't auto-generate content** — every page needs human-written unique value. Thin variable-swap content = Google penalty risk.
- **Don't use subdomains** — stay on `/vc-stack/...` subfolder for authority consolidation.
- **Don't chase generic SaaS queries** ("what is CRM") — low intent + high competition. Stay VC-specific.
- **Don't publish empty categories** — if a category has <3 tools, `noindex` it until it fills out.
- **Don't forget mobile** — 60%+ of discovery is mobile; test all new sections at 375px width.

---

## Execution plan (week-by-week)

### Week 1 — Infrastructure + top 5 categories
- [ ] Migrate `Category` schema (add `intro`, `buyingCriteria`, `faqs`, `topPickSlugs`, `relatedSlugs`, `seoTitle`, `seoDescription`, `heroAngle`)
- [ ] Build 5 new components (`CategoryIntro`, `BuyingCriteria`, `TopPicks`, `CategoryFAQ`, `RelatedCategories`)
- [ ] Update `generateMetadata` in `category/[slug]/page.tsx`
- [ ] Write + publish content for **CRM, Data, Research, AI, Portfolio Mgmt** (top-volume cats)
- [ ] Add JSON-LD for category pages
- [ ] Deploy + submit updated sitemap to GSC

### Week 2 — Remaining 12 categories
- [ ] Content for News, Admin/Ops, Automation, Communication, Mailing, Calendar, Transcription, Voice-to-Text, Productivity, Vibe Coding, Browser, Other Tools
- [ ] Add related-category cross-links
- [ ] QA: all 17 pages pass the quality-gate checklist
- [ ] Start pillar page draft (`/guide/vc-tech-stack`)

### Week 3 — Pillar + curation template
- [ ] Ship `/guide/vc-tech-stack` pillar page
- [ ] Build `/best/[category]` route + template
- [ ] Write curation content for top 5 categories

### Week 4 — Curation rollout + internal linking
- [ ] Curation content for remaining 12 categories
- [ ] Footer update: top 5 categories + pillar link
- [ ] Tool page audit: ensure 3 related-tools links each

### Week 5+ — Comparisons
- [ ] Build `/vs/[a]-vs-[b]` template
- [ ] Publish first 5 comparison pages (Affinity vs Attio, Harmonic vs Specter, Pitchbook vs Crunchbase, Tracxn vs Venture Intelligence, Notion vs Coda)
- [ ] Submit comparison sitemap

### Ongoing (monthly)
- [ ] Refresh top-3 picks per category (pricing, new entrants)
- [ ] Add 2–3 new comparison pages based on GSC queries that show up
- [ ] Update year in titles (Jan refresh)
- [ ] Review GSC: which queries are ranking 5–20? Those pages need content expansion

---

## Measurement

### Setup (pre-launch)
- [ ] Google Search Console verified (both root domain + `/vc-stack` if separate property)
- [ ] Google Analytics 4 with enhanced measurement
- [ ] Baseline snapshot: current impressions, clicks, position for the 17 category URLs

### KPIs
| Metric | Baseline | 4 wk target | 12 wk target |
|---|---|---|---|
| Indexed pages | TBD | All 17 categories + all tools | +17 curation + 10 comparisons |
| Organic impressions | TBD | 5K/mo | 25K/mo |
| Avg position (tracked keywords) | TBD | Top 30 | Top 15 |
| Ranking keywords | TBD | 30 | 100 |
| Organic sessions | TBD | 500/mo | 3K/mo |

### Weekly review
Check GSC every Monday:
- Which queries gained impressions? → expand that page's content.
- Which pages have impressions but low CTR? → fix title/description.
- Which pages are indexed but ranking #30+? → review content depth vs SERP winners.

### Tracked keywords (starting list)
Head: `vc tech stack` · `vc tech landscape` · `tools for vcs`
Category: `crm for vcs` · `deal sourcing tools` · `portfolio management software venture capital` · `vc research tools` · `ai tools for investors`
Curation: `best crm for vcs` · `best deal sourcing tools`
Comparison: `affinity vs attio` · `harmonic vs specter`
Branded: `vc stack` · `vc stack newsletter` · `indianvcs`

---

## Open questions (resolve before execution)

1. **Writing capacity:** 17 categories × ~500 words each = ~8,500 words. Who writes? (Pavithran solo? Contributors? Hire?)
2. **Curation methodology:** How opinionated do we want to be? Is it OK to say "don't use HubSpot"?
3. **Review/rating data:** Do we have user reviews? If not, `AggregateRating` schema is skipped — that's fine but worth noting.
4. **Refresh cadence:** Monthly, quarterly, or only on request? Recommend quarterly.
5. **Newsletter wiring:** Each enriched page should have a newsletter CTA. Where does it live (end of intro? after tools grid? sticky?)
6. **Indian VC angle specificity:** How much do we lean in? My recommendation: hard. It's the moat.

---

## Appendix — Related skill references

- `~/.agents/skills/programmatic-seo/SKILL.md` — the playbook this strategy was built from
- `~/.agents/skills/programmatic-seo/references/playbooks.md` — detailed playbook implementation
