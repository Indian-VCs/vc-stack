# TODOs

## Before shipping to production

- No blocking app-config TODOs. The app runs on static catalog data and hardcoded public
  constants only; no env vars are required for Webflow Cloud.

## Deferred (post-launch)

- **Create DESIGN.md.** Site has no written design system. For 6 months of weekly editorial
  (images, embeds, blockquotes, tables, CTAs within pieces), decisions will drift without a
  written source of truth. Run `/design-consultation` before piece #2 ships. ~30 min.

- **Wire review log for stale detection.** The `gstack-review-log` JSON entries currently lack
  a `commit` field for some older runs — staleness detection will warn on re-run. Minor.

- **Reconsider partnerships at day 45.** Per CEO plan: re-evaluate the "no gating, no partnerships"
  stance if audience growth trails 1,500 Indian VC subs by day 45. Calendar reminder recommended.

## Information architecture — the long-term plan

The `indianvcs.com` brand should become an umbrella with multiple sections. This site
(the tool directory) is one of them, to be called **VC Stack**. Decision from the
strategic IA discussion:

### Target structure

```
indianvcs.com (brand umbrella)
├── /              landing that showcases all sections
├── /stack         THIS site (tool directory + market map)
├── /insights      Hot Takes content migrates here (editorial, essays)
├── /events        meetups, demo days, calendar
├── /about         about the brand
│
└── hub.indianvcs.com   STAYS as a subdomain (it's a product, not content)
```

### Rule of thumb

- **Content → path** (compound SEO authority on the root domain)
- **Product → subdomain** (Hub has auth, different tech stack, different user state)

### Navbar: two tiers

Primary nav (stable across every page):
`VC Stack · Insights · Events · Hub ↗ · Newsletter`

Secondary nav (section-specific; only shown on /stack pages today):
`Market Map · Categories · Tools · Submit`

Primary tells users "IndianVCs has 4 things, you're in one of them." Secondary
surfaces features within the current section.

### Naming decisions

- **VC Stack** — the directory (not "Tech Stack", not "The Stack")
- **Insights** — the editorial section (not "Hot Takes"; keep "Hot Takes" as a *series* inside)
- **Events** — plain
- **Hub** — unchanged, labeled `Hub ↗` in nav to signal it opens subdomain

### Migration sequence (when ready to consolidate)

1. **Restructure navbar to two-tier pattern.** Placeholders for Insights/Events
   that resolve to "Launching soon" pages. ~30 min.
2. **Move current homepage content → `/stack`.** Root becomes a section directory
   showcasing all pieces. ~1 hour.
3. **Migrate Hot Takes content → `/insights`.** Set up per-post routes
   (`/insights/[slug]`). Add a 301 redirect from `hottakes.indianvcs.com` so
   existing SEO doesn't break. Timing: when content is actually ready to move.
4. **Add Events** when a real calendar/events platform is chosen.

### What NOT to do

- **Don't move `hub.indianvcs.com` to `/hub`.** Product-shaped subdomains with auth
  and different stacks should stay separate. Deploy coupling would be worse than
  the SEO dilution.
- **Don't build `/insights` or `/events` ahead of content.** Placeholder pages
  that say "Coming soon" for months erode trust. Only create the route when
  there's real content to ship.
- **Don't rename the current site yet.** Stay at root until the umbrella landing
  is actually being built.
