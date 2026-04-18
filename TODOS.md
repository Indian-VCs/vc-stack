# TODOs

## Before shipping to production

- **Set `NEXT_PUBLIC_SUBSTACK_URL` env var.** Once The Dispatch is live on Substack, set this
  to the subscribe URL (e.g. `https://indianvcs.substack.com/`). Until then, both homepage
  signup surfaces render a "Launching soon" state. `.env.example` documents the var.

## Deferred (post-launch)

- **Prisma schema: multi-category support.** Today, `Tool.extraCategorySlugs` lives only in the
  static catalog (`src/lib/tools-data.ts`). When CMS-driven tool creation goes live, this needs
  a proper many-to-many `Tool ↔ Category` relation in the Prisma schema. Until then, tools added
  through the admin UI will only appear in a single category on the market map. ~1 hour with CC.
  Non-blocking for the 6-month editorial-first strategy.

- **Create DESIGN.md.** Site has no written design system. For 6 months of weekly editorial
  (images, embeds, blockquotes, tables, CTAs within pieces), decisions will drift without a
  written source of truth. Run `/design-consultation` before piece #2 ships. ~30 min.

- **Wire review log for stale detection.** The `gstack-review-log` JSON entries currently lack
  a `commit` field for some older runs — staleness detection will warn on re-run. Minor.

- **Reconsider partnerships at day 45.** Per CEO plan: re-evaluate the "no gating, no partnerships"
  stance if audience growth trails 1,500 Indian VC subs by day 45. Calendar reminder recommended.
