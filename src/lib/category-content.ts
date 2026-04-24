/**
 * Programmatic-SEO content for category pages.
 * See docs/pseo-strategy.md (Playbook 1) for the editorial framework.
 *
 * Each entry enriches a category page with:
 *   - intro        — 150–250 word unique paragraph (markdown ok)
 *   - buyingCriteria — 3–5 "what to look for" items
 *   - relatedSlugs — 3–4 adjacent categories to cross-link
 *   - seoTitle / seoDescription / heroAngle — metadata overrides
 *
 * Categories with no entry here render only the existing broadsheet header +
 * tools grid (no thin-content risk — pSEO sections are silently skipped).
 */

import type { BuyingCriterion } from './types'

interface CategoryContent {
  intro?: string
  buyingCriteria?: BuyingCriterion[]
  relatedSlugs?: string[]
  seoTitle?: string
  seoDescription?: string
  heroAngle?: string
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  // ─── CRM — fully fleshed template ─────────────────────────────────────────
  crm: {
    seoTitle: 'CRM for VCs · Top Tools in 2026 | VC Stack',
    seoDescription:
      "The CRMs India's top VCs actually use in 2026. Buying guide, editorial top picks (Affinity, Attio, Taghash), and honest comparisons for funds of every size.",
    heroAngle:
      "The deal-flow operating system. How Indian VCs track founder relationships, pipeline, and portfolio signals — from first meeting to exit.",
    intro: `For a venture fund, the CRM isn't a sales tool — it's the memory of the firm. Every coffee chat with a founder, every warm intro from an LP, every follow-on signal from a portfolio company lives (or dies) here. Indian VCs have historically bolted this onto HubSpot or Salesforce, but the last three years have seen a generation of purpose-built investor CRMs that treat deal flow, relationship graphs, and portfolio ops as first-class citizens.

We've surveyed what India's active investors — Blume, Kalaari, Peak XV, Lightspeed India, and dozens of micro-VCs — actually use in 2026. The answer isn't one tool; it's a stack, usually centered on a core CRM (Affinity, Attio, or Taghash for India-first funds) and layered with enrichment, meeting transcription, and LP reporting on top.

This page is the working list. Pricing, feature depth, and India-specific fit vary — we've called out the tradeoffs where they matter. If you're evaluating a CRM switch, read the "what to look for" section first; the top three picks below are what we'd recommend for a fund under $200M AUM.`,
    buyingCriteria: [
      {
        label: 'Relationship graph depth',
        description:
          'Does it auto-capture email and calendar signal, or does your team log everything manually? Manual logging decays into dead data inside six months.',
      },
      {
        label: 'Deal pipeline + portfolio in one view',
        description:
          'Post-investment, the same founder is still in your CRM. Tools that separate "deal" and "portfolio" force duplicate data entry and drift.',
      },
      {
        label: 'LP and co-investor contact layer',
        description:
          'The best CRMs treat LPs, co-investors, and founders as one contact graph with different views — not three disconnected spreadsheets.',
      },
      {
        label: 'India-specific enrichment',
        description:
          'Crunchbase and PitchBook thin out for pre-seed Indian founders. Check native integrations with Venture Intelligence, Tracxn, Inc42 Data Labs, and MCA filings.',
      },
    ],
    relatedSlugs: ['data', 'research', 'portfolio-management', 'admin-ops'],
  },

  // ─── Data — private-market intelligence ───────────────────────────────────
  data: {
    seoTitle: 'Data Tools for VCs · Private Market Intelligence 2026',
    seoDescription:
      "The private-market data stack Indian VCs run on in 2026. PitchBook, Harmonic, Tracxn, Venture Intelligence — picked for dealflow, diligence, and LP work.",
    heroAngle:
      'Market databases, company graphs, and private-market intelligence. The raw material behind every investment memo.',
    intro: `Every investment memo starts with data. Who raised, how much, when, from whom, at what multiple. For a generation that meant Crunchbase and PitchBook; today the stack is fragmented, with global databases, India-specific databases, founder-detection engines, and enrichment layers all doing different jobs.

The honest truth for India-focused funds: the global players (PitchBook, Crunchbase, CB Insights) thin out dramatically below Series B in India. MCA filings, unlisted-company financials, and stealth founders surface better on Indian platforms — Venture Intelligence for historical comps going back to 1999, Inc42 Data Labs for thesis-era signal, Tracxn for curated sector taxonomies, Private Circle for regulatory diligence.

The new category shift is detection. Tools like Harmonic and EverTrace don't just record funding rounds after the fact — they flag stealth builders from GitHub commits, domain registrations, and LinkedIn role changes weeks before anyone lists a company. For early-stage Indian VCs competing on speed, that gap between "founder visible" and "deal closed" is where the edge lives.

This page is the working stack. Pricing ranges from free to $50K+/year. Stack breadth matters more than any single tool; we've flagged where India coverage beats global, and where global still wins for LP research and fund benchmarking.`,
    buyingCriteria: [
      {
        label: 'India coverage depth',
        description:
          'Global databases under-cover Indian pre-seed, MCA filings, and regional LP/co-investor activity. Pick at least one India-native source alongside a global one.',
      },
      {
        label: 'Signal vs record',
        description:
          "Is the tool for discovering founders early (Harmonic, EverTrace) or recording what's already public (Crunchbase, PitchBook)? Different tools serve different stages of the funnel.",
      },
      {
        label: 'CRM integration',
        description:
          'Enriched data is only useful if it flows into your deal system. Confirm native connectors to Affinity, Attio, or your fund OS before committing — CSV exports decay fast.',
      },
      {
        label: 'Pricing tier vs team size',
        description:
          'PitchBook and CB Insights are enterprise-priced; Crunchbase Pro is accessible. Match the contract size to how many analysts will actually log in weekly — seat minimums bite.',
      },
    ],
    relatedSlugs: ['crm', 'research', 'news', 'portfolio-management'],
  },

  // ─── Research — primary + secondary diligence workbenches ─────────────────
  research: {
    seoTitle: 'Research Tools for VCs · Diligence Stack 2026',
    seoDescription:
      "The research tools Indian VCs use for diligence: expert networks, sector intelligence, and primary-market research. AlphaSense, Redseer, Kavi, and more.",
    heroAngle:
      'Primary and secondary research workbenches. Expert calls, sector scans, and the long read behind a short decision.',
    intro: `Research is where a thesis gets pressure-tested before a term sheet gets signed. For VCs, that splits into three jobs: secondary desk research (what does the public record say?), primary expert calls (what do operators and customers think?), and competitive intelligence (who's actually winning?). No single tool covers all three well.

The secondary layer has consolidated around AI-native platforms — AlphaSense for filings and broker research, Perplexity and ChatGPT with Deep Research for rapid sector scans, Statista and Gartner for citable market-size anchors. The expert-network layer is dominated globally by GLG, with Kavi Research carving out an India-specific niche at a fraction of the cost. And the competitive-traffic layer — Similarweb, Semrush, Ahrefs — has become table stakes for diligencing any consumer or B2B SaaS growth claim.

For Indian VCs, the India-focused research gap is real. RedSeer remains the default for bespoke strategy work on Indian consumer and fintech; 1Lattice has built a strong panel and expert-call business for primary survey work. Global tools plug the gaps but rarely match local depth.

The working rule: use AI tools for speed, expert networks for depth, and traffic-analytics for truth-checking founder growth claims. This page lists the full stack — pick two or three tools per research job, not one that claims to do everything.`,
    buyingCriteria: [
      {
        label: 'Research job clarity',
        description:
          'Is this for desk research, expert calls, or competitive traffic analysis? Different tools serve different jobs — buying one platform that does all three poorly is the most common mistake.',
      },
      {
        label: 'Expert network cost structure',
        description:
          'GLG charges premium per-hour rates. Kavi is significantly cheaper for Indian experts. Pick based on sector focus — enterprise software may need GLG depth; Indian consumer rarely does.',
      },
      {
        label: 'Export and memo fit',
        description:
          'Research output needs to land in your memo or IC doc. Platforms with good citation export (AlphaSense, Perplexity, Statista) save hours of re-formatting over ones that trap data inside dashboards.',
      },
      {
        label: 'India coverage for domestic theses',
        description:
          'Gartner and Statista thin out for Indian consumer or fintech specifics. RedSeer, 1Lattice, and Kavi fill that gap — worth the separate subscription if you invest in India-native categories.',
      },
    ],
    relatedSlugs: ['data', 'ai', 'news', 'crm'],
  },

  // ─── News — daily broadsheet of venture ───────────────────────────────────
  news: {
    seoTitle: 'News Sources for VCs · Daily Reading List 2026',
    seoDescription:
      'The news sites and newsletters Indian VCs actually read each morning. The Ken, The Generalist, Inc42, VCCircle, Morning Context — ranked and explained.',
    heroAngle:
      'The daily broadsheet of venture. Feeds, aggregators, and newsletters investors read before the first coffee.',
    intro: `Every investor has a morning routine, and it usually looks the same: Twitter, two or three premium subscriptions, and a scan of whichever deal-alert newsletter surfaces the freshest rounds. The question for an Indian VC is which sources to pay for — because the best India coverage sits almost entirely behind paywalls, and the public web has steadily thinned out since 2022.

For India-specific news, the paid subscription trio most funds run is The Ken (long-form business analysis with the deepest investigative bench), The Morning Context (the scoop-oriented daily on tech and finance), and Entrackr (funding-round news and regulatory filings faster than the majors). For free daily, VCCircle and YourStory still publish the broadest volume of India deal news; Inc42 layers in sector reports and data-labs briefings; Money Control covers the public-market adjacent.

For global VC narrative and thesis work, The Generalist has become the closest thing to a required subscription; TechCrunch and Forbes remain the headline sources for funded-round announcements and LP-relevant corporate news. Less widely cited but increasingly influential among Indian GPs: Entrepreneur India, LiveMint, and Economic Times for macro and policy context that actually moves diligence.

The working stack: two India paid, one global paid, and three free aggregators. Anything more becomes noise; anything less and you miss stories that change a term sheet the week you close.`,
    buyingCriteria: [
      {
        label: 'India coverage depth vs speed',
        description:
          'The Ken and Morning Context are deep but slow; Entrackr and VCCircle are fast but less analytical. Most funds pay for one of each rather than trying to get both from one source.',
      },
      {
        label: 'Paywall versus public',
        description:
          "The best Indian business reporting is behind paywalls. Budget $500–$1,500 per year per investor for 2–3 subscriptions — it's cheaper than a single missed intro.",
      },
      {
        label: 'Newsletter format fit',
        description:
          'Some investors read via email (Substack, The Generalist, Lenny), others via apps (The Ken). Match the format to how your team already reads — subscriptions consumed in the wrong surface get skipped.',
      },
      {
        label: 'Signal-to-noise on deal alerts',
        description:
          "Entrackr, VCCircle, and Inc42 overlap heavily on funded-round announcements. Pick one primary for deal alerts; duplicate subscriptions just fill inboxes.",
      },
    ],
    relatedSlugs: ['data', 'research', 'ai', 'crm'],
  },

  // ─── AI — the cognitive layer ─────────────────────────────────────────────
  ai: {
    seoTitle: 'AI Tools for VCs · Investor Copilots in 2026',
    seoDescription:
      "The AI stack Indian VCs actually use: Claude, ChatGPT, Perplexity, Gemini. How to pick, how to set up Projects, and where AI breaks during diligence.",
    heroAngle:
      'General-purpose copilots and assistants. The cognitive layer sitting under every other workflow on this page.',
    intro: `AI has stopped being a line item on the VC tech stack and become the substrate under every other tool. In 2026, almost every investor we surveyed opens ChatGPT or Claude within the first five minutes of the workday — to triage inbound decks, draft memo skeletons, summarise diligence calls, or pressure-test a thesis. The interesting question is no longer "should VCs use AI" but "which model for which job, and how to set up Projects so context compounds."

The practical reality: no single assistant wins every job. Claude is the default for long-context reading — data-room documents, founder transcripts, memo critique — and for careful writing. ChatGPT wins on breadth, Custom GPTs, and the largest ecosystem of third-party integrations. Perplexity beats both for sourced sector research with citations you can paste into memos. Gemini matters mostly if your fund lives in Google Workspace and wants Deep Research inline with Gmail. DeepSeek and open-weight models have a growing role for sensitive diligence that cannot leave the firm's infrastructure.

The unlock for most funds isn't picking one model — it's setting up Projects (Claude) or Custom GPTs (ChatGPT) loaded with your fund playbook, portfolio data, and sector theses. Context reuse is the 10x moment. Pair any assistant with a transcription tool (see Transcription) and you replace 30% of associate-level research work with two subscriptions.`,
    buyingCriteria: [
      {
        label: 'Long-context reasoning quality',
        description:
          'Reading a 200-page data room or a full founder transcript needs careful long-context handling. Claude leads here; ChatGPT is close; others lag. Test on your actual document types before standardising.',
      },
      {
        label: 'Workspace integration',
        description:
          'If your fund lives in Google Workspace, Gemini in Gmail saves real friction. If you live in Notion, third-party connectors matter more. Match the AI to where your team already spends 80% of the day.',
      },
      {
        label: 'Project and context management',
        description:
          'Claude Projects and ChatGPT Custom GPTs let you reuse firm context across conversations — fund playbook, portfolio data, diligence checklists. This is the real leverage, not raw model quality.',
      },
      {
        label: 'Data handling and privacy',
        description:
          "Confidential founder decks and LP materials should not train frontier models. Enterprise plans (ChatGPT Business, Claude for Enterprise) disable training and add audit logs. Check before uploading a data room.",
      },
    ],
    relatedSlugs: ['transcription', 'research', 'productivity', 'vibe-coding'],
  },

  // ─── Portfolio Management — post-investment stack ─────────────────────────
  'portfolio-management': {
    seoTitle: 'Portfolio Management for VCs · Top Tools 2026',
    seoDescription:
      'The portfolio-monitoring and LP-reporting tools VCs use in 2026. Taghash, Standard Metrics, Carta, Vestberry — picked for Indian funds of every size.',
    heroAngle:
      'Where a fund watches what it already owns. Metrics, KPIs, and quarterly letters for the companies on the cap table.',
    intro: `Post-investment is where most funds still run on spreadsheets. Quarterly KPI requests go out by email, founders return inconsistently formatted files, an associate stitches it together in Excel, and the partner meeting runs on stale data. The last three years have seen purpose-built portfolio-monitoring platforms finally crack this workflow — automated data collection from founders, standardised metrics across the book, and audit-ready LP reports pulled from the same source of truth.

For Indian funds, the category splits into two shapes. Integrated fund-OS platforms (Taghash, Bunch, Eqvista) bundle dealflow, portfolio, fund accounting, and LP reporting into one system — higher switching cost, but only one contract. Specialist monitoring tools (Standard Metrics, Vestberry) focus narrowly on the portfolio-KPI job and plug into your existing CRM and fund admin. Carta sits in a different category entirely — it's the cap-table and fund-admin system of record that most portfolio companies are already on, which means portfolio investors get a read-only view of ownership and dilution across the whole book for free.

The practical rule: if you're a fund with 20+ portfolio companies and an in-house ops hire, an integrated platform pays for itself within a year. If you're under 20 and your partners still run Excel trackers happily, Carta + a lightweight KPI tool (Standard Metrics) is the faster win. The worst pattern is buying a heavy platform you don't have the data discipline to populate.`,
    buyingCriteria: [
      {
        label: 'Data collection automation',
        description:
          'Does the tool pull KPIs from founders automatically, or does your team still email requests and parse replies? Manual collection is where portfolio data goes to die.',
      },
      {
        label: 'LP-report output quality',
        description:
          'Quarterly letters and capital-call statements need institutional polish. Check the default templates and export formats — CSV-only output means your associate still rebuilds the letter each quarter.',
      },
      {
        label: 'Integration with your stack',
        description:
          'Does it connect to your CRM (Affinity, Attio), fund admin (Carta), and data tools? Isolated portfolio platforms create duplicate-entry pain and are the fastest abandoned purchases.',
      },
      {
        label: 'India regulatory fit',
        description:
          'For SEBI-registered AIF category II/III funds, LP reporting formats, FEMA considerations, and ROC filings matter. Taghash and India-native tools handle this; global platforms often do not.',
      },
    ],
    relatedSlugs: ['crm', 'admin-ops', 'data', 'communication'],
  },

  // ─── Admin & Ops — fund administration ────────────────────────────────────
  'admin-ops': {
    seoTitle: 'Fund Admin & Ops Tools for VCs · India 2026',
    seoDescription:
      'The fund-admin, syndicate, and AIF-ops platforms Indian VCs rely on. AngelList, LetsVenture, Incentive, Carta — picked for SEBI-registered funds and angels.',
    heroAngle:
      'Fund administration, compliance, and the operational scaffolding behind running a venture firm.',
    intro: `Fund admin is the part of the stack nobody brags about and everybody needs. Capital calls, drawdown notices, distribution waterfalls, K-1s or equivalent, SEBI filings for Indian AIFs, Form PAS-6 for private placements — the work is relentless, regulated, and expensive to get wrong. The answer has historically been either an external fund-admin firm (SS&C, Gen II, Apex) for institutional funds, or a spreadsheet plus an accountant for the rest.

The last three years have flipped this for the long tail. Platforms built for syndicates and small AIFs now handle the full fund-formation-to-LP-reporting workflow without a back-office team. AngelList runs the global syndicate playbook and has a fund-admin arm used by solo GPs and micro-funds worldwide. For India specifically, LetsVenture is the dominant platform for syndicates and small AIFs, Incentive Finance handles the compliance and NAV work for SEBI-registered category I/II funds, and Carta — though primarily a cap-table platform — now offers fund administration that slots in naturally for funds whose portfolio is already on it.

The practical decision split is size and structure. Under $10M with a syndicate structure, AngelList or LetsVenture handles almost everything. Between $10M and $200M as a SEBI-registered AIF, a combination of LetsVenture or Incentive for India-specific ops plus Carta for cap-table visibility is the common stack. Above $200M, most funds move to an institutional admin firm — but lean on Carta and a portfolio-monitoring tool on top.`,
    buyingCriteria: [
      {
        label: 'India regulatory fit',
        description:
          'SEBI AIF compliance, FEMA rules, and ROC filings are non-trivial. Global platforms handle them poorly. For India-registered funds, pick India-native ops tools first, then layer global for cap-table and LP workflows.',
      },
      {
        label: 'Fund structure fit',
        description:
          'Syndicate vs AIF vs Delaware vehicle each need different tooling. AngelList for syndicates, LetsVenture for Indian AIFs, Carta for Delaware LPs. Using the wrong platform for your structure creates compliance headaches.',
      },
      {
        label: 'LP reporting and capital calls',
        description:
          'Quarterly statements, capital calls, and distribution notices have to look institutional. Check the default templates and signature workflows before committing — these are what LPs actually see.',
      },
      {
        label: 'Pricing vs AUM stage',
        description:
          'Platform fees typically scale with AUM or LP count. A $5K/year tool at $10M AUM becomes $50K/year at $200M. Confirm the pricing curve before you commit — switching admin mid-fund is painful.',
      },
    ],
    relatedSlugs: ['portfolio-management', 'crm', 'automation', 'data'],
  },
  // ─── Automation — workflow glue ───────────────────────────────────────────
  automation: {
    seoTitle: 'Automation Tools for VCs · Zapier, Make, PhantomBuster',
    seoDescription:
      "The no-code automation platforms VCs use to wire CRMs, inboxes, and data rooms together. Zapier, Make, PhantomBuster — compared for fund workflows in 2026.",
    heroAngle:
      'Workflow glue. No-code engines that wire your CRM, inbox, and data room together without a developer.',
    intro: `Most fund workflows are small gaps stitched by hand. An inbound email with a pitch deck needs to land in the CRM with a Drive folder attached. A new portfolio company hire on LinkedIn should trigger a note on the company's deal record. A weekly scrape of Tracxn or Inc42 should route to the right associate based on sector. None of these are hard problems — they just eat an hour a week until someone automates them.

Three platforms cover almost every VC automation use case. Zapier is the default for simple "when X happens in tool A, do Y in tool B" workflows — high reliability, enormous app library, easy to learn. Make (formerly Integromat) is the power-user alternative: visual flow builder, better at branching logic and multi-step operations, and cheaper at scale. PhantomBuster is the sourcing-specific tool — it scrapes LinkedIn, extracts data from Twitter and public pages, and feeds structured lists into enrichment or CRM flows.

The practical rule for Indian funds: start with Zapier to connect the 3–5 tools you already use (Gmail, CRM, Slack, Drive, calendar). Move to Make when you hit Zapier's step limits or need complex logic. Add PhantomBuster only if an associate is actively sourcing from LinkedIn. Avoid the temptation to automate everything — most funds end up with 20 broken Zaps that nobody remembers building. Ten reliable flows beat fifty half-maintained ones.`,
    buyingCriteria: [
      {
        label: 'App coverage',
        description:
          'Check that the platform has native connectors for every tool in your stack — Affinity, Attio, Notion, Gmail, Slack, Drive. A missing connector means webhooks, which means brittle.',
      },
      {
        label: 'Pricing by step volume',
        description:
          "Zapier charges per 'task' (step run); Make per 'operation'. At high volume, Make is typically 3–5× cheaper, but the learning curve is steeper. Calculate monthly volume before committing.",
      },
      {
        label: 'Reliability and error handling',
        description:
          'Workflows that silently fail are worse than no automation. Check retry logic, error notifications, and logging — cheap platforms often skip these and bite you during a fundraise when things matter.',
      },
      {
        label: 'Who maintains it',
        description:
          "Automation rots. If no one owns the workflows, they break inside six months. Either pick a platform that a non-technical team member can debug (Zapier), or have a dedicated ops hire who can.",
      },
    ],
    relatedSlugs: ['crm', 'productivity', 'data', 'admin-ops'],
  },
  // ─── Communication — where the partnership talks ─────────────────────────
  communication: {
    seoTitle: 'Communication Tools for VCs · Slack, WhatsApp, Discord',
    seoDescription:
      "How Indian VCs actually talk — with founders, with LPs, and with each other. WhatsApp, Slack, Discord, Telegram — picked for fund ops in 2026.",
    heroAngle:
      'Where the partnership talks to itself and the outside world. Chat, video, and the rooms where diligence happens.',
    intro: `The honest reality of Indian VC communication in 2026 is that WhatsApp is the default medium for almost everything — first introductions, founder calls, follow-ups after IC, LP check-ins. It is the lingua franca of Indian business, which means every serious fund has to operate on it whether or not the partnership wants to. The operating question is not "do we use WhatsApp" but "what structure do we wrap around it so conversations do not get lost."

Inside the firm, Slack remains the default partnership workspace — IC channels, sector channels, portfolio-company rooms, automated alerts from CRM and news tools. A few India-first funds run on Discord instead, especially those that treat their portfolio as a community. Telegram sits in a middle space — popular for specific sectors like crypto and consumer, less so for generalist funds.

The practical split: WhatsApp for external (founders, LPs, co-investors), Slack for internal (partnership, portfolio, firm ops). Discord if you run a community motion. Telegram if your sector focus demands it. The tooling question that actually matters is: how do WhatsApp conversations get logged into the CRM? Taghash solves this natively for Indian VCs; Attio and Affinity require workarounds. If your CRM does not capture WhatsApp, you have a memory gap the size of your dealflow — and it compounds as the fund grows.`,
    buyingCriteria: [
      {
        label: 'WhatsApp CRM integration',
        description:
          'For any Indian-focused fund, WhatsApp logging into the CRM is non-negotiable. Check native support (Taghash has it; Attio and Affinity need third-party workarounds) before choosing your CRM.',
      },
      {
        label: 'Partnership workspace fit',
        description:
          'Slack is the default; Discord works if you run a portfolio community. Whichever you pick, treat it as the source of truth for firm decisions — if IC discussion happens in DMs, nothing is searchable.',
      },
      {
        label: 'Voice and video reliability',
        description:
          "First founder calls, LP check-ins, and partner meetings need video that does not fail. Slack Huddles work for internal; Zoom or Google Meet for external. Avoid relying on WhatsApp video for anything institutional.",
      },
      {
        label: 'Compliance and data retention',
        description:
          'LP-facing conversations and regulated-sector diligence (fintech, healthcare) may need audit logs and retention. Enterprise plans on Slack, WhatsApp Business, and Zoom add these; free tiers do not.',
      },
    ],
    relatedSlugs: ['crm', 'mailing', 'productivity', 'transcription'],
  },
  // ─── Mailing — inbox infrastructure ───────────────────────────────────────
  mailing: {
    seoTitle: 'Email Tools for VCs · Superhuman, Shortwave, Notion Mail',
    seoDescription:
      'The email clients Indian VCs use to triage inbound decks, send LP updates, and manage founder follow-ups. Superhuman, Shortwave, Notion Mail — compared.',
    heroAngle:
      'Inbox infrastructure. From founder LP mail to quarterly newsletters, this is where correspondence is sent and filed.',
    intro: `Email is where most of a VC's workday actually happens. Inbound decks from founders, warm intros from co-investors, LP check-ins, calendar invitations, CRM notifications — nearly every surface of the job lands in the inbox first. Which is why the email client question is more important than it looks: an investor who reads email efficiently wins hours per week, and that compounds across hundreds of deals.

The three tools actively competing for the "VC inbox" slot in 2026 are Superhuman, Shortwave, and Notion Mail. Superhuman remains the speed-first default — keyboard-driven, aggressively focused on clearing inbox zero, and deeply loved by investors who treat email triage as a core skill. Shortwave is the AI-first alternative, with powerful search, thread summarisation, and Gemini-based writing help built in from the start. Notion Mail is the newest entrant, designed for teams that already live in Notion and want email threads to sit next to docs, databases, and tasks.

For Indian VCs, there is also a cultural split. Investors who care about inbox speed above all else usually end up on Superhuman. Investors who use AI for drafting and search lean Shortwave. Teams that already run everything in Notion gravitate to Notion Mail. Some combination with Gmail or Outlook underneath is universal — almost no fund fully leaves the underlying Google Workspace or Microsoft stack behind.`,
    buyingCriteria: [
      {
        label: 'Speed and keyboard depth',
        description:
          "If you read 200+ emails a day, keyboard-first clients (Superhuman) save an hour weekly. If you read 50, the speed difference matters less and AI features (Shortwave) win.",
      },
      {
        label: 'AI features fit',
        description:
          "Modern clients use AI for summarisation, writing, and search. Test with your own mailbox — the quality varies wildly between clients and depends on whether you already lean on Claude or ChatGPT externally.",
      },
      {
        label: 'Calendar integration',
        description:
          'Booking and scheduling live alongside email. Check how the client integrates with Cal.com, Calendly, or Google Calendar — weak integration creates scheduling friction that wipes out inbox speed gains.',
      },
      {
        label: 'Pricing per user',
        description:
          'Superhuman is $30/user/month, Shortwave $12–$25, Notion Mail bundled with Notion. For a 10-person fund, that is $3–$4K/year versus free Gmail — worth it if the team actually adopts; wasteful otherwise.',
      },
    ],
    relatedSlugs: ['communication', 'productivity', 'calendar', 'crm'],
  },
  // ─── Calendar — booking and defending time ───────────────────────────────
  calendar: {
    seoTitle: 'Calendar Tools for VCs · Vimcal, Calendly, Cal.com',
    seoDescription:
      "The scheduling and booking tools Indian VCs rely on. Vimcal, Calendly, Cal.com, Notion Calendar — compared for partner meetings and founder calls.",
    heroAngle:
      'Booking, blocking, and defending time. Tools that decide when the partnership meets and when the founder gets ten minutes.',
    intro: `Time is the one asset a VC cannot re-underwrite. Every hour spent on a meeting that should have been an email — or worse, on scheduling logistics for a meeting that never happens — is an hour not spent on diligence, portfolio support, or thesis work. Which is why every serious fund has strong opinions about calendar tooling, even if the partners would rather not admit it.

The landscape has split into two camps. Booking-link tools (Calendly, Cal.com) let founders and co-investors pick a slot without the back-and-forth — essential for high-volume inbound. Calendly remains the global standard; Cal.com is the open-source alternative gaining traction with technical investors who want self-hostable tooling. Then there are calendar clients — Vimcal is the VC-favorite in 2026, purpose-built for heavy meeting schedules with features investors actually want (multi-timezone, natural-language commands, tight Superhuman integration). Notion Calendar lives alongside Notion docs for teams that already run there.

The practical split for Indian funds: everyone uses a booking-link tool for inbound (Calendly or Cal.com — pick one, make it the firm default); partners with heavy schedules use a dedicated calendar client (Vimcal); teams that run on Notion add Notion Calendar on top. The worst pattern is mixing tools inside the partnership — different partners on different booking links means founders get confused about which link is real, and that kills conversion on warm intros.`,
    buyingCriteria: [
      {
        label: 'Firm-wide consistency',
        description:
          "Every partner in the firm should use the same booking-link tool. Mixed setups confuse founders and create double-booking risk. Pick one and standardise — the individual preference is less important than the alignment.",
      },
      {
        label: 'Time-zone handling',
        description:
          'Indian VCs coordinate across IST, PST, and GMT weekly. Clients with weak timezone support (showing IST times to LPs in San Francisco) create mistakes that look unprofessional. Vimcal and Calendly handle this natively; Notion Calendar is weaker here.',
      },
      {
        label: 'Integration with CRM and meeting tools',
        description:
          "Calendar events should auto-log into your CRM and trigger transcription. Verify that your pick connects to Affinity, Attio, or Taghash — orphan calendar invites are lost relationship data.",
      },
      {
        label: 'Booking-link limits',
        description:
          'Calendly free tier caps features; Cal.com free tier is more generous. Paid plans ($15–$30/user/month) are standard for investors. Budget this as firm infrastructure, not a personal subscription.',
      },
    ],
    relatedSlugs: ['mailing', 'productivity', 'communication', 'transcription'],
  },
  // ─── Transcription — meeting recorders ────────────────────────────────────
  transcription: {
    seoTitle: 'Transcription Tools for VCs · Granola, Fathom, Fireflies',
    seoDescription:
      'The AI meeting notetakers Indian VCs use in 2026. Granola, Fathom, Fireflies, Otter — compared for founder calls, IC notes, and diligence interviews.',
    heroAngle:
      'Meeting recorders and note-takers. Every call, pitch, and partner meeting turned into searchable text.',
    intro: `Every founder call, IC discussion, and expert interview a VC takes is now routinely transcribed. The shift from "do you mind if I record this?" to "my notetaker will join" has happened in 18 months, and the practical implication is enormous: associates are no longer taking notes in meetings, memos are being drafted from actual transcripts instead of paraphrased summaries, and the firm's institutional memory is searchable in ways it never was before.

The category has consolidated around four tools. Granola is the fast-moving 2025–2026 favorite — private-by-default, runs locally, doesn't join meetings as a visible bot, and produces clean structured notes. Fathom is the VC-popular alternative: joins Zoom and Meet as a labelled bot, auto-generates highlights, strong CRM integrations. Fireflies is the enterprise-friendly option with deep integration into Slack, CRMs, and search. Otter is the incumbent — broad, mature, weaker on the AI-native summarisation that newer tools lead on.

For Indian funds, the decision usually hinges on two factors. First, founder comfort: bots visibly joining calls still feels awkward for some conversations, which pushes firms toward Granola's local-recording model. Second, CRM wiring: Fathom and Fireflies push transcripts and highlights directly into Affinity, Attio, and other CRMs — which is where the compounding value lives. Without CRM integration, transcripts just sit in a folder nobody searches, and the leverage evaporates inside three months.`,
    buyingCriteria: [
      {
        label: 'Visible bot vs local recording',
        description:
          "Founders react differently to a labelled bot joining a call versus a silent local recording. Granola is private-by-default; Fathom and Fireflies are visible bots. Pick based on the founder conversations you actually have.",
      },
      {
        label: 'CRM integration depth',
        description:
          "Transcripts only compound value when they flow into your CRM and show up on contact records. Check native integrations with Affinity, Attio, or Taghash before committing. CSV export is not integration.",
      },
      {
        label: 'Summary quality',
        description:
          'AI-generated summaries vary wildly between tools and over time. Test on actual founder calls — speed test and accuracy matter more than feature lists. Rebuild-the-summary UX is a telltale: tools with one-click regeneration usually have stronger models underneath.',
      },
      {
        label: 'Data privacy for diligence',
        description:
          'For sensitive diligence (regulated sectors, M&A situations), confirm retention policy, training-data settings, and enterprise controls. Consumer plans typically use meeting content for model training; enterprise plans disable this.',
      },
    ],
    relatedSlugs: ['ai', 'communication', 'crm', 'productivity'],
  },
  // ─── Voice to Text — dictation on the move ───────────────────────────────
  'voice-to-text': {
    seoTitle: 'Voice to Text Tools for VCs · Wispr Flow, Superwhisper',
    seoDescription:
      'The dictation tools Indian VCs use between meetings. Wispr Flow, Superwhisper, Aqua Voice, Willow — compared for founder notes, CRM entries, and quick memos.',
    heroAngle:
      'Dictation for the investor on the move. Turn voice memos between meetings into memos in the CRM.',
    intro: `Dictation used to be a niche — lawyers, doctors, and a handful of writers. It has become quietly essential for VCs. The shift came when a generation of AI-native tools (Wispr Flow, Superwhisper, Aqua Voice, Willow Voice) made voice-to-text so fast and accurate that typing in a CRM field or a Slack thread feels slow by comparison. Partners walking between meetings can now dictate a 200-word founder recap into Affinity in the time it takes to cross the floor.

The category has differentiated on two axes. Latency and accuracy — Wispr Flow and Superwhisper are currently the fastest-and-most-accurate, with near-real-time transcription that works inside any app via a global shortcut. And workflow fit — Aqua Voice and Willow Voice add light AI post-processing (cleaning up ums, restructuring bullet points) that turns raw voice into near-publishable memos. For Indian investors specifically, accent handling has improved dramatically over the last year; Wispr Flow and Superwhisper both handle Indian English well, which was not true for earlier tools.

The practical use cases are narrow but high-leverage: post-meeting founder recaps while the conversation is fresh, quick IC memo drafts before the weekend, dashing off a Slack message while walking. It is not a substitute for structured writing — long memos still work better typed. But for the 30-second-to-3-minute dictation slots investors actually have between meetings, it replaces typing almost entirely once the habit is built.`,
    buyingCriteria: [
      {
        label: 'Accuracy with Indian English',
        description:
          'Earlier dictation tools handled Indian accents poorly. Current-generation tools (Wispr Flow, Superwhisper) have closed this gap — but test with your own voice before committing. A one-week trial with real usage tells you more than feature lists.',
      },
      {
        label: 'Global shortcut support',
        description:
          'The value comes from dictating into any app (Affinity, Slack, Gmail, Notion) without switching context. Check that the tool offers a system-wide keyboard shortcut and works in every text field, not just a dedicated app.',
      },
      {
        label: 'Privacy and local processing',
        description:
          "Voice notes about founders and deals are sensitive. Check whether the tool processes audio locally or sends it to cloud servers; for regulated-sector diligence, local-only tools matter. Some tools offer an enterprise tier with disabled training.",
      },
      {
        label: 'AI cleanup quality',
        description:
          'Raw transcription has ums and repetition. Tools vary in how cleanly they restructure speech into readable text — Aqua and Willow lean heavier into post-processing than Wispr Flow or Superwhisper. Match to whether you want raw transcripts or near-publishable drafts.',
      },
    ],
    relatedSlugs: ['ai', 'transcription', 'productivity', 'crm'],
  },
  // ─── Productivity — docs, wikis, task boards ─────────────────────────────
  productivity: {
    seoTitle: 'Productivity Tools for VCs · Notion, Coda, Google Sheets',
    seoDescription:
      'The docs, wikis, and task boards that run Indian venture firms. Notion, Coda, Google Sheets — compared for IC memos, portfolio tracking, and firm ops.',
    heroAngle:
      'Docs, wikis, and task boards. The second brain where theses, diligence, and portfolio notes all live.',
    intro: `For most Indian VC firms, the productivity stack is where the firm's actual knowledge lives. IC memos, thesis drafts, portfolio KPIs, fund-ops checklists, LP FAQ libraries — all of it has to go somewhere, and that somewhere decides whether institutional memory compounds or evaporates when an associate leaves. The question is not "which productivity tool is best" but "which one will the whole team actually use in six months."

The answer for the majority of venture firms is Notion. It has become the default knowledge platform across most early- and mid-stage Indian VCs — partly because every new hire already knows it, partly because it handles wiki + docs + databases + tasks well enough to replace three separate tools. Coda is the opinionated alternative, preferred by teams that want more powerful databases and formulas; the tradeoff is a slightly steeper learning curve and smaller ecosystem. Google Sheets persists as the data-and-calculation substrate — no fund fully leaves it behind, because financial models, KPI dashboards, and ad-hoc analyses still happen there faster than anywhere else.

The working rule for Indian funds: Notion for knowledge (wiki, memos, databases, tasks), Google Sheets for numbers (models, KPI trackers, simple analyses). Add Coda only if a strong opinionated power-user is driving it and the team will follow. Mixing Notion and Coda across the partnership is almost always a mistake — each firm-wide tool only pays back when adoption is 100%.`,
    buyingCriteria: [
      {
        label: 'Team adoption likelihood',
        description:
          "The best productivity tool is the one your team will actually use consistently. Notion has the lowest friction because most hires already know it; exotic tools create training cost that rarely pays back.",
      },
      {
        label: 'Database vs document balance',
        description:
          'Notion handles databases adequately; Coda handles them far better. If your firm runs complex dealflow trackers, portfolio dashboards, or interlinked records, Coda has the advantage. For simpler knowledge management, Notion wins on ease.',
      },
      {
        label: 'AI integration',
        description:
          "Notion AI is competent but generic; external AI tools (Claude Projects, ChatGPT) often do better for memo drafting. Check whether you want built-in AI or whether you'll run AI outside the productivity platform.",
      },
      {
        label: 'Pricing at firm scale',
        description:
          'Notion and Coda both charge per user per month, typically $8–$20. For a 10-person fund, that is $1–3K/year. Google Sheets is effectively free via Workspace. Budget is rarely the constraint; adoption usually is.',
      },
    ],
    relatedSlugs: ['communication', 'mailing', 'automation', 'crm'],
  },
  // ─── Vibe Coding — AI-native builders ─────────────────────────────────────
  'vibe-coding': {
    seoTitle: 'Vibe Coding Tools for VCs · Lovable, Bolt, Replit',
    seoDescription:
      'The AI-native builders Indian VCs use to prototype landing pages, dashboards, and diligence tools without engineers. Lovable, Bolt, Replit, Emergent.',
    heroAngle:
      'AI-native builders for non-engineers. Prototype a landing page, a dashboard, or a diligence tool before lunch.',
    intro: `Vibe coding is the shorthand for a new class of AI-native tool where you describe what you want in plain English and a working app — landing page, dashboard, form, mini-tool — comes back in minutes. For founders it has become the default way to ship v0.1 of a product. For VCs, the use case is narrower but surprisingly useful: one-off diligence tools, portfolio-company dashboards, data-room signup forms, LP microsites, sector-map landing pages — all the small software-shaped things a fund needs occasionally and never enough to hire an engineer for.

Four tools dominate the category in 2026. Lovable is the fastest-growing — chat-first, strong at shipping polished web apps from a prompt, with tight integrations to Supabase for data. Bolt (by StackBlitz) is the power-user pick — browser-based full-stack development that generates real code you can edit and ship. Replit is the veteran, now AI-assisted throughout and the broadest platform of the four. Emergent is the newest entrant, aimed at production-quality apps with opinionated architecture.

For Indian VCs, the practical use case is lightweight software for tasks that otherwise eat an associate's week: building a quick scoring form for a thesis, throwing together a landing page for a portfolio company's launch, spinning up a private dashboard to track a specific sector. Treat these as disposable — built in an afternoon, used for a quarter, replaced when the problem evolves. The tools are not a substitute for real engineering; they are a substitute for doing it by hand in a spreadsheet.`,
    buyingCriteria: [
      {
        label: 'Output quality',
        description:
          "The gap between 'impressive demo' and 'actually usable app' is real. Test each tool on a prompt from your actual workflow before committing — polished landing pages are easy; working multi-step tools are harder. Iteration speed matters more than the first output.",
      },
      {
        label: 'Export and ownership',
        description:
          'Some tools lock code behind their hosting; others export clean code you can take elsewhere. For anything past a throwaway prototype, pick a tool that lets you move the output — platform risk is real.',
      },
      {
        label: 'Database and auth integration',
        description:
          'Real tools need data storage and login. Lovable integrates with Supabase; Bolt handles it natively; Replit has its own stack. Check whether your tool outputs plug into the backends you already know.',
      },
      {
        label: 'Iteration speed',
        description:
          'The value comes from fast iteration cycles — prompt, see, refine. Tools with slow build-and-redeploy loops kill the creative flow. Test specifically how fast you can go from "this is wrong" to "fixed".',
      },
    ],
    relatedSlugs: ['ai', 'productivity', 'automation', 'browser'],
  },
  // ─── Browser — investor-grade browsers ────────────────────────────────────
  browser: {
    seoTitle: 'Browsers for VCs · Arc, Comet, Atlas, Chrome in 2026',
    seoDescription:
      'The browsers Indian VCs use to run dealflow, diligence, and research. Arc, Comet, Atlas, Chrome, Brave — compared for tabs, AI, and investor workflows.',
    heroAngle:
      'The window to the work. Investor-grade browsers with tabs, workspaces, and AI built into the address bar.',
    intro: `The browser is where a VC actually spends most of the workday. CRM, Gmail, Notion, Drive, portfolio dashboards, news, Twitter, an open tab graveyard of founder decks and competitor sites — all of it lives in one window that gets 40+ tabs deep by mid-morning. Which is why the browser category, ignored for a decade while Chrome dominated, has finally become interesting again. AI has given browsers a new job: not just render pages, but understand them.

Three distinct camps have emerged. Arc (by The Browser Company) is the design-forward reimagination of what a browser can be — workspaces for different contexts, sidebar tabs, built-in shortcuts. Loved by design-minded investors, less loved by everyone who wants things to just work like Chrome. Comet (by Perplexity) is the AI-first browser — Perplexity's answer engine is built into the address bar, so any page becomes a queryable document. Atlas (by OpenAI) occupies the same space from the ChatGPT side, with agentic task execution across sites. Brave is the privacy-first alternative that blocks trackers by default. Chrome remains the universal fallback — boring, reliable, and what every shared-screen demo assumes.

For Indian VCs, the practical split is personal preference at the partner level, Chrome at the firm level. Most investors use a primary browser they have strong feelings about (Arc fans are evangelical, as are Comet users); almost everyone still keeps Chrome installed for shared demos, specific enterprise integrations, and edge cases. Pick what makes your own workflow faster — this is one of the few categories where "what everyone uses" matters less than what feels right to you personally.`,
    buyingCriteria: [
      {
        label: 'AI integration depth',
        description:
          "Comet and Atlas bake AI into the address bar and sidebar — fundamentally different from pasting URLs into ChatGPT. If you query pages constantly, an AI-first browser saves real time. If not, Chrome plus an extension is enough.",
      },
      {
        label: 'Tab and workspace management',
        description:
          "Investors run 40+ tabs by 10am. Arc's workspaces and sidebar tabs actually help; Chrome's tab bar does not. Test with a real workday, not a demo — tab overload is where browser fatigue actually lives.",
      },
      {
        label: 'Enterprise and shared-screen reliability',
        description:
          "Some enterprise tools assume Chrome (Zoom webinars, some CRMs, certain LP portals). Keep Chrome installed as a fallback regardless of primary browser. Atlas and Comet also have edge cases — test on your actual stack.",
      },
      {
        label: 'Privacy posture',
        description:
          "For regulated-sector diligence, Brave's tracker blocking matters. For general investor work, most tracker blocking is handled by CRM and ad-blocker extensions. Privacy-first as a primary browser is a niche pick, not a default.",
      },
    ],
    relatedSlugs: ['ai', 'productivity', 'research', 'news'],
  },
  // Other Tools is a miscellany bucket (Carta, Canva, Zoom, Webflow, Substack,
  // etc.) that doesn't share a coherent theme. "Other tools for VCs" is not a
  // real search query, so there's no pSEO target. Leaving this empty — the
  // existing tool grid is the right surface.
  'other-tools': {},
}

/** Lookup helper — returns empty object if slug has no entry. */
export function getCategoryContent(slug: string): CategoryContent {
  return CATEGORY_CONTENT[slug] ?? {}
}
