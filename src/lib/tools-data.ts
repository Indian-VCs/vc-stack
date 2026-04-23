/**
 * IndianVCs Tech Stack 2026 — the 138 tools that power India's top venture desks.
 * Mirrors the broadsheet poster at vcstack.io.
 *
 * Categories (19):
 *   cat-1  CRM                cat-8  Finance           cat-15 Voice to Text
 *   cat-2  Data               cat-9  Admin/Ops         cat-16 Productivity
 *   cat-3  Research           cat-10 Automation        cat-17 Vibe Coding
 *   cat-4  News               cat-11 Communication     cat-18 Browser
 *   cat-5  AI                 cat-12 Mailing           cat-19 Other Tools
 *   cat-6  Portfolio Mgmt     cat-13 Calendar
 *   cat-7  Captable           cat-14 Transcription
 */

import type { Tool, Category, PricingModel } from './types'

let _catResolver: (id: string) => Category

export function setCategoryResolver(fn: (id: string) => Category) {
  _catResolver = fn
}

const G = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const LOGO_OVERRIDES: Record<string, string> = {
  'venture-intelligence': 'https://www.ventureintelligence.info/static/images/icon.png',
  'ahrefs': 'https://assets-3b70.kxcdn.com/images/mediakit/logo_blue@2x.png?v=2',
}

function t(
  id: string,
  name: string,
  slug: string,
  shortDesc: string,
  description: string,
  websiteUrl: string,
  pricingModel: PricingModel,
  categoryId: string,
  isFeatured = false,
  extraCategorySlugs?: string[],
): Tool {
  let resolvedLogo: string | null = LOGO_OVERRIDES[slug] ?? null
  if (!resolvedLogo && websiteUrl) {
    try {
      const domain = new URL(websiteUrl).hostname.replace(/^www\./, '')
      resolvedLogo = G(domain)
    } catch { /* malformed — skip */ }
  }
  return {
    id, name, slug, shortDesc, description, websiteUrl,
    logoUrl: resolvedLogo,
    screenshotUrl: null,
    pricingModel, isFeatured, categoryId, category: _catResolver(categoryId),
    extraCategorySlugs: extraCategorySlugs?.length ? extraCategorySlugs : undefined,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function buildAllTools(): Tool[] {
  return [
    // ═══════════════════════════════════════════════════════════════════════
    // CRM (cat-1) — 12 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-1', 'Affinity', 'affinity', 'Relationship intelligence CRM for private capital.', 'Affinity is a relationship-intelligence CRM purpose-built for venture capital, private equity, and investment banking — it automatically captures the network graph from email and calendar so deal teams never lose track of a warm intro.', 'https://affinity.co', 'PAID', 'cat-1'),
    t('t-2', 'Airtable', 'airtable', 'Flexible database that many firms bend into a CRM.', 'Airtable is a spreadsheet-database hybrid — many early-stage funds use it as a lightweight dealflow CRM before graduating to purpose-built systems.', 'https://airtable.com', 'FREEMIUM', 'cat-1', false, ['productivity']),
    t('t-3', 'Asana', 'asana', 'Project and work management for investment teams.', 'Asana is a work-management platform that VC operations teams use to coordinate diligence, portfolio reviews, and cross-functional projects.', 'https://asana.com', 'FREEMIUM', 'cat-1'),
    t('t-4', 'Attio', 'attio', 'The modern, flexible CRM built on a real data model.', 'Attio is a new-generation CRM built on a flexible data model — increasingly the default choice for funds that outgrow Notion but find Affinity overkill.', 'https://attio.com', 'PAID', 'cat-1', true),
    t('t-5', 'Clay', 'clay', 'Enrichment-first GTM data and CRM orchestrator.', 'Clay is a data-enrichment and outbound platform — investor teams use it to hydrate dealflow lists with signals, funding history, and founder context.', 'https://clay.com', 'PAID', 'cat-1'),
    t('t-6', 'EverTrace', 'evertrace', 'Relationship intelligence for the networks investors rely on.', 'EverTrace maps who-knows-whom across your firm so warm intros never go cold. Relationship intelligence purpose-built for venture desks, surfacing first-degree paths to every founder, LP, and operator in your collective network.', 'https://evertrace.ai', 'PAID', 'cat-2', true),
    t('t-7', 'Folk', 'folk', 'A lightweight, human-shaped CRM.', 'Folk is a minimalist CRM designed for founders, operators, and small funds — built around the idea that your contacts should feel like people, not rows.', 'https://folk.app', 'FREEMIUM', 'cat-1'),
    t('t-8', 'HubSpot', 'hubspot', 'All-in-one CRM and marketing platform.', 'HubSpot is the default SMB CRM — a few platform-heavy funds run their LP and portfolio outreach on it.', 'https://hubspot.com', 'FREEMIUM', 'cat-1'),
    t('t-9', 'Notion', 'notion', 'Workspace that doubles as a CRM in early-stage funds.', 'Notion\u2019s flexible databases make it the most common home-grown CRM for small and solo-GP funds in India. Partner memos, meeting notes, portfolio pages, and LP updates all live in the same workspace \u2014 the second brain for the whole fund.', 'https://notion.so', 'FREEMIUM', 'cat-1', false, ['productivity', 'transcription']),
    t('t-10', 'Pipedrive', 'pipedrive', 'Sales-pipeline CRM, pragmatic and fast.', 'Pipedrive is a sales-pipeline-first CRM — some platform ops teams use it for portfolio-hiring and BD outreach.', 'https://pipedrive.com', 'PAID', 'cat-1'),
    t('t-11', 'Streak', 'streak', 'CRM that lives entirely inside Gmail.', 'Streak plugs a CRM directly into Gmail — popular with solo GPs and small teams who live in their inbox.', 'https://streak.com', 'FREEMIUM', 'cat-1'),
    t('t-12', 'Taghash', 'taghash', 'The CRM built in India, for Indian VCs.', 'Taghash is a dealflow and portfolio CRM built for Indian venture firms, with LP reporting and India-specific data sources baked in.', 'https://taghash.io', 'PAID', 'cat-1', true),

    // ═══════════════════════════════════════════════════════════════════════
    // DATA (cat-2) — 13 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-13', 'CB Insights', 'cb-insights', 'AI-driven intelligence on the private markets.', 'CB Insights is a private-markets intelligence platform covering startups, venture deals, M&A, and emerging-tech trends.', 'https://cbinsights.com', 'ENTERPRISE', 'cat-2', true),
    t('t-14', 'Crunchbase', 'crunchbase', 'The original startup-funding database.', 'Crunchbase is the go-to database for company, funding, and investor data — the default starting point for any deal search.', 'https://crunchbase.com', 'FREEMIUM', 'cat-2'),
    t('t-15', 'Harmonic', 'harmonic', 'Real-time company intelligence for early dealflow.', 'Harmonic surfaces early signals on the 30M+ private companies it tracks — VCs use it to find breakout companies before the round leaks.', 'https://harmonic.ai', 'PAID', 'cat-2', true),
    t('t-16', 'Inc42 Data Labs', 'inc42-data-labs', 'India-specific startup and funding data.', 'Inc42 Data Labs is an Indian startup intelligence product with funding trackers, sector reports, and founder-level data.', 'https://inc42.com', 'PAID', 'cat-2'),
    t('t-17', 'LinkedIn Sales Nav', 'linkedin-sales-nav', 'The professional graph, indexed for outreach.', 'Sales Navigator layers search, filters, and lead lists on top of LinkedIn — the primary sourcing surface for BD and talent teams.', 'https://linkedin.com', 'PAID', 'cat-2'),
    t('t-18', 'PitchBook', 'pitchbook', 'The reference database for venture and private equity.', 'PitchBook is the institutional-grade data platform for private capital — funds, deals, exits, and LP activity, all indexed.', 'https://pitchbook.com', 'ENTERPRISE', 'cat-2', true),
    t('t-19', 'Preqin', 'preqin', 'Alternative-asset intelligence for LPs and GPs.', 'Preqin is the leading data source on alternative assets — PE, VC, hedge funds, real estate — used widely by LPs and fund-of-funds.', 'https://preqin.com', 'ENTERPRISE', 'cat-2'),
    t('t-20', 'Private Circle', 'private-circle', 'Unlisted-company intelligence for India.', 'Private Circle tracks unlisted Indian companies, promoters, and group structures — indispensable for India-focused diligence.', 'https://privatecircle.co', 'PAID', 'cat-2'),
    t('t-21', 'Product Hunt', 'product-hunt', 'A daily feed of newly launched products.', 'Product Hunt is a daily launch board — many sourcing analysts scan it every morning for breakout consumer and prosumer products.', 'https://producthunt.com', 'FREE', 'cat-2'),
    t('t-22', 'Sanchi Connect', 'sanchi-connect', 'India\u2019s deeptech ecosystem platform.', 'Sanchi Connect is an Indian deeptech ecosystem platform connecting founders, investors, and research institutions.', 'https://sanchiconnect.com', 'FREEMIUM', 'cat-2'),
    t('t-23', 'Tracxn', 'tracxn', 'Sector-wide startup tracking.', 'Tracxn is an India-founded startup intelligence platform covering thousands of sectors and emerging-tech themes.', 'https://tracxn.com', 'PAID', 'cat-2'),
    t('t-24', 'Twitter', 'twitter', 'Where the VC discourse — and much of the dealflow — lives.', 'X (Twitter) is still the fastest surface for founder and investor signal — launches, memes, and round leaks all appear here first.', 'https://x.com', 'FREE', 'cat-2'),
    t('t-25', 'Venture Intelligence', 'venture-intelligence', 'The most-cited source for Indian PE/VC deal data.', 'Venture Intelligence tracks Indian PE/VC deals, M&A, and fundraising activity — the reference for most Indian fund reports.', 'https://ventureintelligence.info', 'PAID', 'cat-2'),

    // ═══════════════════════════════════════════════════════════════════════
    // RESEARCH (cat-3) — 15 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-26', '1Lattice', '1lattice', 'Primary research and market intelligence.', '1Lattice (formerly PGA Labs) runs primary research, expert interviews, and market-sizing studies for investors and corporates.', 'https://1lattice.com', 'ENTERPRISE', 'cat-3'),
    t('t-27', 'Ahrefs', 'ahrefs', 'SEO and web-traffic intelligence.', 'Ahrefs is an SEO and web-analytics platform used for competitive diligence on D2C, marketplace, and content businesses.', 'https://ahrefs.com', 'PAID', 'cat-3'),
    t('t-28', 'AlphaSense', 'alphasense', 'AI search across earnings, filings, and expert calls.', 'AlphaSense is an AI-powered search engine across public filings, broker research, and expert-call transcripts.', 'https://alpha-sense.com', 'ENTERPRISE', 'cat-3'),
    t('t-29', 'Bain', 'bain', 'Consulting reports that shape the market map.', 'Bain & Company publishes industry and private-capital reports that investors routinely cite in memos and LP decks.', 'https://bain.com', 'ENTERPRISE', 'cat-3'),
    t('t-30', 'Clearbit', 'clearbit', 'Company and contact enrichment.', 'Clearbit (now part of HubSpot) enriches company and contact records — used heavily by platform and BD teams.', 'https://clearbit.com', 'PAID', 'cat-3'),
    t('t-31', 'Data AI', 'data-ai', 'App-store and mobile intelligence.', 'Data.ai (formerly App Annie) tracks app-store rankings, downloads, and revenue — the reference for mobile-app diligence.', 'https://data.ai', 'PAID', 'cat-3'),
    t('t-32', 'G2', 'g2', 'Category research via real software reviews.', 'G2 aggregates software reviews and category rankings — useful for B2B SaaS diligence and competitive mapping.', 'https://g2.com', 'FREEMIUM', 'cat-3'),
    t('t-33', 'GLG', 'glg', 'The world\u2019s largest expert network.', 'GLG (Gerson Lehrman Group) is the largest expert network — investors use it to talk to industry operators on deep-dive calls.', 'https://glginsights.com', 'ENTERPRISE', 'cat-3'),
    t('t-34', 'Gartner', 'gartner', 'IT research and Magic Quadrants.', 'Gartner is the IT research and advisory firm behind the Magic Quadrant — a go-to for enterprise-software diligence.', 'https://gartner.com', 'ENTERPRISE', 'cat-3'),
    t('t-35', 'Kavi Research', 'kavi-research', 'On-demand primary research for investors.', 'Kavi is a primary research and expert network platform tailored for Indian investors.', 'https://joinkavi.com', 'PAID', 'cat-3'),
    t('t-36', 'Owler', 'owler', 'Crowd-sourced competitive intelligence.', 'Owler provides company news, funding, and competitive-landscape data through a crowd-sourced model.', 'https://owler.com', 'FREEMIUM', 'cat-3'),
    t('t-37', 'RedSeer', 'redseer', 'India\u2019s internet-sector consulting desk.', 'RedSeer is an Indian consulting firm specialising in internet, consumer-tech, and digital-economy market sizing.', 'https://redseer.com', 'ENTERPRISE', 'cat-3'),
    t('t-38', 'SEMRush', 'semrush', 'SEO and digital marketing intelligence.', 'SEMRush is an all-in-one digital marketing suite used for SEO, PPC, and competitive-digital diligence.', 'https://semrush.com', 'PAID', 'cat-3'),
    t('t-39', 'Similarweb', 'similarweb', 'Web-traffic and engagement intelligence.', 'Similarweb estimates web traffic, engagement, and audience overlap — a daily tool for consumer-internet diligence.', 'https://similarweb.com', 'PAID', 'cat-3'),
    t('t-40', 'Statista', 'statista', 'The portable statistics library.', 'Statista aggregates market statistics across industries — a quick-reference tool for memo charts and TAM slides.', 'https://statista.com', 'PAID', 'cat-3'),

    // ═══════════════════════════════════════════════════════════════════════
    // NEWS (cat-4) — 14 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-41', 'Arc', 'arc-news', 'A new-format newsletter publishing platform.', 'Arc is a publishing platform for long-form, creator-driven business writing — increasingly in the daily read of Indian investors.', 'https://thearcweb.com', 'FREEMIUM', 'cat-4'),
    t('t-42', 'Economic Times', 'economic-times', 'India\u2019s business daily of record.', 'The Economic Times is India\u2019s largest English-language business daily — the default breakfast read for most GPs.', 'https://economictimes.indiatimes.com', 'FREEMIUM', 'cat-4'),
    t('t-43', 'Entrepreneur India', 'entrepreneur-india', 'Business and founder stories, India edition.', 'Entrepreneur India covers founders, funding, and startup culture with an India lens.', 'https://entrepreneur.com', 'FREE', 'cat-4'),
    t('t-44', 'Forbes', 'forbes', 'Global business and finance reporting.', 'Forbes covers global business, finance, and the people who move markets — including its India edition.', 'https://forbes.com', 'FREEMIUM', 'cat-4'),
    t('t-45', 'Inc42', 'inc42', 'India\u2019s startup and tech news publication.', 'Inc42 is one of India\u2019s leading startup media houses — daily funding news, deep dives, and ecosystem reports.', 'https://inc42.com', 'FREE', 'cat-4', true),
    t('t-46', 'Ken', 'the-ken', 'Subscription business journalism, India-first.', 'The Ken is a subscription publication known for rigorous, single-story business journalism out of India.', 'https://the-ken.com', 'PAID', 'cat-4'),
    t('t-47', 'Live Mint', 'livemint', 'Financial daily with strong tech coverage.', 'Mint is an Indian financial daily with strong startup, markets, and policy coverage.', 'https://livemint.com', 'FREEMIUM', 'cat-4'),
    t('t-48', 'Money Control', 'money-control', 'Markets and business news for Indian investors.', 'Moneycontrol is India\u2019s largest markets and personal-finance news portal — a core source for macro and public-market context.', 'https://moneycontrol.com', 'FREE', 'cat-4'),
    t('t-49', 'The Morning Context', 'morning-context', 'Subscription tech journalism out of India.', 'The Morning Context publishes subscription-only tech, business, and chaos journalism — often the first to break big stories.', 'https://themorningcontext.com', 'PAID', 'cat-4'),
    t('t-50', 'TechCrunch', 'techcrunch', 'The global startup news outlet.', 'TechCrunch is the global reference for startup and VC news — funding, launches, and ecosystem reporting.', 'https://techcrunch.com', 'FREE', 'cat-4'),
    t('t-51', 'The Generalist', 'the-generalist', 'Deep-dive newsletter on tech and markets.', 'The Generalist is a long-form newsletter on technology, finance, and ideas — a favourite among research-heavy investors.', 'https://generalist.com', 'FREEMIUM', 'cat-4'),
    t('t-52', 'VCCircle', 'vccircle', 'Indian deal and VC news tracker.', 'VCCircle is a news platform focused on Indian PE/VC deals, fundraising, and M&A.', 'https://vccircle.com', 'PAID', 'cat-4'),
    t('t-53', 'YourStory', 'yourstory', 'Founder stories from the Indian ecosystem.', 'YourStory has covered Indian founders and startups since the ecosystem\u2019s early days — a deep archive of founder profiles.', 'https://yourstory.com', 'FREE', 'cat-4'),
    t('t-54', 'Entrackr', 'entrackr', 'Indian startup funding news tracker.', 'Entrackr is an Indian startup news and funding tracker — known for scoops on early- and growth-stage rounds.', 'https://entrackr.com', 'FREE', 'cat-4'),

    // ═══════════════════════════════════════════════════════════════════════
    // AI (cat-5) — 7 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-55', 'ChatGPT', 'chatgpt', 'OpenAI\u2019s general-purpose reasoning assistant.', 'ChatGPT is OpenAI\u2019s conversational assistant — the most widely-used AI co-pilot in the investor\u2019s daily workflow.', 'https://openai.com', 'FREEMIUM', 'cat-5', true),
    t('t-56', 'Claude', 'claude', 'Anthropic\u2019s assistant, favoured for long-form reasoning.', 'Claude is Anthropic\u2019s conversational assistant, favoured by investors for long-document analysis, memo drafting, and careful reasoning. The 1M-token context window makes it a default for diligence, memo review, and turning raw investor calls into clean writeups.', 'https://claude.ai', 'FREEMIUM', 'cat-5', true),
    t('t-57', 'Gemini', 'gemini', 'Google\u2019s AI assistant, wired into Workspace.', 'Gemini is Google\u2019s AI model family, now embedded across Gmail, Docs, and Sheets — the default for Workspace-native firms.', 'https://gemini.google.com', 'FREEMIUM', 'cat-5'),
    t('t-58', 'Manus', 'manus', 'Autonomous agent for research and execution.', 'Manus is an autonomous agent that plans and executes multi-step research and work tasks in the background.', 'https://manus.ai', 'PAID', 'cat-5'),
    t('t-59', 'MiniMax', 'minimax', 'Multimodal AI assistant from China\u2019s MiniMax Group.', 'MiniMax is a Chinese AI-model family with strong multimodal (text, voice, video) capabilities.', 'https://minimax.io', 'FREEMIUM', 'cat-5'),
    t('t-60', 'Perplexity', 'perplexity', 'AI search with real citations.', 'Perplexity is an answer engine that cites its sources — investors use it as a faster, citation-backed alternative to Google.', 'https://perplexity.ai', 'FREEMIUM', 'cat-5', true),
    t('t-61', 'Qwen', 'qwen', 'Alibaba\u2019s open-weight model family.', 'Qwen is Alibaba\u2019s open-weight LLM family — increasingly used in Indian and Asian AI stacks.', 'https://qwen.ai', 'FREE', 'cat-5'),

    // ═══════════════════════════════════════════════════════════════════════
    // PORTFOLIO MANAGEMENT (cat-6) — 2 primary tools (Carta is multi-category → see Captable)
    // ═══════════════════════════════════════════════════════════════════════
    t('t-63', 'Standard Metrics', 'standard-metrics', 'Portfolio data collection and reporting.', 'Standard Metrics (formerly Quaestor) automates financial data collection from portfolio companies for GP and LP reporting.', 'https://standardmetrics.io', 'PAID', 'cat-6'),
    t('t-64', 'Vestberry', 'vestberry', 'VC portfolio monitoring and analytics.', 'Vestberry is a portfolio-monitoring platform for VC and PE firms — dashboards, benchmarks, and LP reporting.', 'https://vestberry.com', 'PAID', 'cat-6'),

    // ═══════════════════════════════════════════════════════════════════════
    // CAPTABLE (cat-7) — 3 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-65', 'Carta', 'carta', 'Cap-table management, the US-market standard.', 'Carta is the US-market standard for cap-table management, 409A valuations, and equity plan administration. Also acts as the portfolio-management spine for many funds — tracking fair-market-value, rounds, and exits across the book.', 'https://carta.com', 'ENTERPRISE', 'cat-7', true, ['portfolio-management']),
    t('t-66', 'Equity List', 'equity-list', 'Cap-table and ESOP management.', 'Equity List provides cap-table and ESOP management tooling — increasingly used by Indian and cross-border startups.', 'https://equitylist.com', 'PAID', 'cat-7'),
    t('t-67', 'Qapita', 'qapita', 'India\u2019s cap-table and ESOP leader.', 'Qapita is the dominant cap-table and ESOP-management platform across Indian startups.', 'https://qapita.com', 'PAID', 'cat-7', true),

    // ═══════════════════════════════════════════════════════════════════════
    // FINANCE (cat-8) — 3 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-68', 'Darwin Box', 'darwinbox', 'HRMS platform popular with mid-sized Indian firms.', 'Darwinbox is a full-stack HR platform with payroll, performance, and talent management — widely adopted by Indian firms.', 'https://darwinbox.com', 'ENTERPRISE', 'cat-8'),
    t('t-69', 'Keka', 'keka', 'HR, payroll, and performance, India-first.', 'Keka is an Indian HRMS covering payroll, attendance, performance, and hiring — popular with small and mid-sized firms.', 'https://keka.com', 'PAID', 'cat-8'),
    t('t-70', 'Zoho', 'zoho', 'The sprawling SaaS suite — accounts, HR, everything.', 'Zoho is a full suite of business software — Books, Payroll, People, Expense — the back-office workhorse for many funds.', 'https://zoho.com', 'FREEMIUM', 'cat-8'),

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN/OPS (cat-9) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-71', 'AngelList', 'angellist', 'Syndicate and SPV infrastructure for Indian angels.', 'AngelList India is the dominant syndicate and SPV platform for Indian angel investors and micro-VCs.', 'https://angellistindia.com', 'PAID', 'cat-9', true),
    t('t-72', 'Incentive Finance', 'incentive-finance', 'Carry and incentive management for fund managers.', 'Incentive Finance helps GPs structure, track, and administer carry and incentive plans.', 'https://incentiv.finance', 'PAID', 'cat-9'),
    t('t-73', 'Infynite Club', 'infinyte-club', 'Syndicate and angel community platform, India.', 'Infinyte Club is a syndicate and angel-investor community platform with a focus on Indian deals.', 'https://infinyte.club', 'PAID', 'cat-9'),
    t('t-74', 'LetsVenture', 'letsventure', 'India\u2019s early-stage fundraising and syndicate platform.', 'LetsVenture powers startup fundraising, syndicates, and AngelList-style SPVs for the Indian market.', 'https://letsventure.com', 'PAID', 'cat-9'),

    // ═══════════════════════════════════════════════════════════════════════
    // AUTOMATION (cat-10) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-75', 'Make', 'make', 'Visual workflow automation (formerly Integromat).', 'Make is a visual automation builder — investor ops teams use it to connect CRM, email, and spreadsheets into workflows.', 'https://make.com', 'FREEMIUM', 'cat-10'),
    t('t-76', 'Phantom Buster', 'phantombuster', 'Browser automation for lead-gen and scraping.', 'PhantomBuster runs browser automations on LinkedIn, Twitter, and other sites — widely used for sourcing and enrichment.', 'https://phantombuster.com', 'PAID', 'cat-10'),
    t('t-77', 'Zapier', 'zapier', 'The original no-code integration platform.', 'Zapier connects thousands of SaaS apps with simple trigger-action flows — still the default no-code glue.', 'https://zapier.com', 'FREEMIUM', 'cat-10'),
    t('t-78', 'n8n', 'n8n', 'Open-source workflow automation for teams that self-host.', 'n8n is an open-source, self-hostable alternative to Zapier — favoured by technical teams who want control.', 'https://n8n.io', 'FREEMIUM', 'cat-10'),

    // ═══════════════════════════════════════════════════════════════════════
    // COMMUNICATION (cat-11) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-79', 'Discord', 'discord', 'Community chat for founders, LPs, and investor groups.', 'Discord is increasingly the venue for founder communities, investor groups, and demo days.', 'https://discord.com', 'FREEMIUM', 'cat-11'),
    t('t-80', 'Slack', 'slack', 'The default for fund internal messaging.', 'Slack is the default internal messaging platform for most funds — channels, shared channels with portfolio, and integrations.', 'https://slack.com', 'FREEMIUM', 'cat-11', true),
    t('t-81', 'Telegram', 'telegram', 'Channels and groups for crypto- and founder-facing work.', 'Telegram hosts many of the large founder, operator, and investor groups — particularly in crypto and deeptech circles.', 'https://telegram.org', 'FREE', 'cat-11'),
    t('t-82', 'WhatsApp', 'whatsapp', 'The default business messenger in India.', 'WhatsApp is where much of Indian business actually happens — every GP runs dealflow, LP, and portfolio chats here.', 'https://whatsapp.com', 'FREE', 'cat-11', true),

    // ═══════════════════════════════════════════════════════════════════════
    // MAILING (cat-12) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-83', 'Notion Mail', 'notion-mail', 'Notion\u2019s take on the email client.', 'Notion Mail is Notion\u2019s new email client, designed around workspace primitives — labels, views, and blocks.', 'https://notion.so', 'FREEMIUM', 'cat-12'),
    t('t-84', 'Shortwave', 'shortwave', 'AI-native Gmail client.', 'Shortwave rebuilds Gmail around AI — smart summaries, triage, and a conversational search interface.', 'https://shortwave.com', 'FREEMIUM', 'cat-12'),
    t('t-85', 'Simplehuman', 'simplehuman-mail', 'A minimalist Gmail layer for fast triage.', 'Simplehuman (email) is a minimalist Gmail assistant focused on fast triage and zero-inbox workflows.', 'https://simplehuman.email', 'PAID', 'cat-12'),
    t('t-86', 'Superhuman', 'superhuman', 'The keyboard-first email client loved by GPs.', 'The keyboard-first, blazing-fast Gmail client that treats email as a power-user tool. Inbox zero feels easy; split inboxes, snippets, and AI-drafted replies are table-stakes for investors drowning in founder intros and LP threads.', 'https://superhuman.com', 'PAID', 'cat-12', true),

    // ═══════════════════════════════════════════════════════════════════════
    // CALENDAR (cat-13) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-87', 'Cal.com', 'cal-com', 'Open-source scheduling infrastructure.', 'Cal.com is the open-source Calendly alternative — self-hostable, extensible, and popular among technical teams.', 'https://cal.com', 'FREEMIUM', 'cat-13'),
    t('t-88', 'Calendly', 'calendly', 'The scheduling link standard.', 'Calendly is the ubiquitous scheduling link — the verb as much as the tool for booking investor calls.', 'https://calendly.com', 'FREEMIUM', 'cat-13', true),
    t('t-89', 'Notion Calendar', 'notion-calendar', 'Calendar tied into Notion\u2019s workspace.', 'Notion Calendar (formerly Cron) is a fast keyboard-first calendar, now tied into Notion\u2019s workspace.', 'https://notion.so', 'FREEMIUM', 'cat-13'),
    t('t-90', 'Vimcal', 'vimcal', 'Keyboard-first calendar for busy investors.', 'Vimcal is a keyboard-first, investor-favourite calendar — optimised for people in back-to-back meetings.', 'https://vimcal.com', 'PAID', 'cat-13'),

    // ═══════════════════════════════════════════════════════════════════════
    // TRANSCRIPTION (cat-14) — 5 primary tools (Notion is multi-category → see CRM)
    // ═══════════════════════════════════════════════════════════════════════
    t('t-91', 'Circleback', 'circleback', 'AI notetaker with sharp summaries.', 'Circleback is an AI meeting notetaker known for clean summaries and follow-up generation across Zoom, Meet, and Teams.', 'https://circleback.ai', 'PAID', 'cat-14'),
    t('t-92', 'Fathom', 'fathom', 'AI notetaker across Zoom, Meet, Teams.', 'Fathom is a free-tier AI notetaker that joins meetings, transcribes, and produces structured summaries.', 'https://fathom.ai', 'FREEMIUM', 'cat-14', true),
    t('t-93', 'Fireflies', 'fireflies', 'AI voice assistant for meetings.', 'Fireflies records, transcribes, and analyses meetings — with CRM sync and searchable conversation intelligence.', 'https://fireflies.ai', 'FREEMIUM', 'cat-14'),
    t('t-94', 'Granola', 'granola', 'AI notetaker that works with any meeting app.', 'Granola is a popular AI notetaker among VCs — captures audio locally and turns raw notes into clean meeting memos.', 'https://granola.so', 'PAID', 'cat-14', true),
    t('t-96', 'Otter', 'otter', 'Real-time meeting transcription.', 'Otter provides real-time transcription, meeting summaries, and searchable conversation archives.', 'https://otter.ai', 'FREEMIUM', 'cat-14'),

    // ═══════════════════════════════════════════════════════════════════════
    // VOICE TO TEXT (cat-15) — 4 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-97', 'Aqua Voice', 'aqua-voice', 'Fast, context-aware dictation.', 'Aqua Voice is a dictation tool built for fast, context-aware voice-to-text across the OS.', 'https://aquavoice.com', 'PAID', 'cat-15'),
    t('t-98', 'Superwhisper', 'superwhisper', 'Mac dictation built on Whisper.', 'Superwhisper is a macOS dictation tool built on top of OpenAI\u2019s Whisper model.', 'https://superwhisper.ai', 'PAID', 'cat-15'),
    t('t-99', 'Willow Voice', 'willow-voice', 'Voice-first writing assistant.', 'Willow Voice is a voice-first writing tool that turns spoken thought into polished text.', 'https://willowvoice.com', 'PAID', 'cat-15'),
    t('t-100', 'Wispr Flow', 'wispr-flow', 'Voice-to-text that thinks alongside you.', 'Wispr Flow is a dictation app built for the modern AI workflow \u2014 voice flows into structured text with context. Investors dictate memos between meetings, capture thoughts while walking, and never lose an insight to a typing bottleneck again.', 'https://wisprflow.com', 'PAID', 'cat-15', true),

    // ═══════════════════════════════════════════════════════════════════════
    // PRODUCTIVITY (cat-16) — 2 primary tools (Airtable & Notion multi-category → see CRM)
    // ═══════════════════════════════════════════════════════════════════════
    t('t-102', 'Coda', 'coda', 'Collaborative doc-database for internal tools.', 'Coda blends docs, databases, and automations into one surface — used by ops-heavy funds for internal tooling.', 'https://coda.io', 'FREEMIUM', 'cat-16'),
    t('t-103', 'Google Sheets', 'google-sheets', 'The default modelling tool.', 'Google Sheets is the default spreadsheet for collaborative modelling, LP tracking, and quick analyses.', 'https://google.com', 'FREE', 'cat-16', true),

    // ═══════════════════════════════════════════════════════════════════════
    // VIBE CODING (cat-17) — 5 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-105', 'Bolt', 'bolt', 'Browser-based AI app builder from StackBlitz.', 'Bolt generates and runs full-stack web apps from a prompt — a favourite for rapid prototyping.', 'https://bolt.new', 'FREEMIUM', 'cat-17'),
    t('t-106', 'Emergent', 'emergent', 'AI platform for generating full applications.', 'Emergent is an AI coding platform that generates complete applications from natural-language specs.', 'https://emergent.sh', 'PAID', 'cat-17'),
    t('t-107', 'Lovable', 'lovable', 'AI web-app builder driven by natural language.', 'Lovable lets anyone build and iterate on full web apps by describing what they want in plain English.', 'https://lovable.dev', 'FREEMIUM', 'cat-17', true),
    t('t-108', 'Replit', 'replit', 'Browser IDE with an AI agent built in.', 'Replit is a browser-based IDE with an AI agent that can scaffold and deploy full projects.', 'https://replit.com', 'FREEMIUM', 'cat-17'),
    t('t-109', 'v0', 'v0', 'Vercel\u2019s generative UI tool.', 'v0 by Vercel generates React UI and full apps from a prompt — the de facto tool for AI-assisted frontend work.', 'https://v0.dev', 'FREEMIUM', 'cat-17', true),

    // ═══════════════════════════════════════════════════════════════════════
    // BROWSER (cat-18) — 6 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-110', 'Arc', 'arc-browser', 'The opinionated browser by The Browser Company.', 'Arc is an opinionated, design-forward browser — spaces, split views, and a radically different tab model.', 'https://arc.net', 'FREE', 'cat-18'),
    t('t-111', 'Atlas', 'atlas-browser', 'OpenAI\u2019s ChatGPT-powered browser.', 'Atlas is OpenAI\u2019s AI-native browser that puts ChatGPT at the centre of the browsing experience.', 'https://chatgpt.com', 'FREE', 'cat-18'),
    t('t-112', 'Brave', 'brave', 'Privacy-first browser with built-in ad-blocking.', 'Brave is a privacy-first browser with native ad-blocking, crypto wallet, and optional paid-search integrations.', 'https://brave.com', 'FREE', 'cat-18'),
    t('t-113', 'Comet', 'comet', 'Perplexity\u2019s AI-native browser.', 'Comet is Perplexity\u2019s AI-native browser — agents and search baked into the URL bar.', 'https://perplexity.ai', 'FREEMIUM', 'cat-18'),
    t('t-114', 'Dia', 'dia-browser', 'AI-native browser from The Browser Company.', 'Dia is The Browser Company\u2019s AI-first successor to Arc — the browser as an AI assistant.', 'https://diabrowser.com', 'FREE', 'cat-18'),
    t('t-115', 'Google Chrome', 'google-chrome', 'The dominant browser and its extension platform.', 'Chrome is still the default — the extension ecosystem alone keeps most investors anchored to it.', 'https://chrome.google.com', 'FREE', 'cat-18'),

    // ═══════════════════════════════════════════════════════════════════════
    // OTHER TOOLS (cat-19) — 23 tools
    // ═══════════════════════════════════════════════════════════════════════
    t('t-116', 'Axiom', 'axiom', 'Logging and observability for modern apps.', 'Axiom is an observability platform — investors diligencing infrastructure and developer-tool companies encounter it often.', 'https://axiom.co', 'FREEMIUM', 'cat-19'),
    t('t-117', 'Bardeen', 'bardeen', 'Browser automation agent.', 'Bardeen runs browser-based automations — used by sourcing and BD teams to script repetitive web work.', 'https://bardeen.ai', 'FREEMIUM', 'cat-19'),
    t('t-118', 'Canva', 'canva', 'Design platform for slides and collateral.', 'Canva is the default non-designer design tool — decks, social posts, and portfolio collateral.', 'https://canva.com', 'FREEMIUM', 'cat-19'),
    t('t-119', 'Chronicle HQ', 'chronicle-hq', 'Storytelling-focused presentation software.', 'Chronicle HQ is a next-generation presentation tool built around narrative storytelling and clean design.', 'https://chroniclehq.com', 'PAID', 'cat-19'),
    t('t-120', 'Circle', 'circle', 'Community platform for cohorts and creators.', 'Circle powers paid communities, cohorts, and portfolio founder groups.', 'https://circle.so', 'PAID', 'cat-19'),
    t('t-121', 'Coresignal', 'coresignal', 'B2B professional and firmographic data.', 'Coresignal provides B2B data feeds — professional profiles, firmographics, and job posting signals for sourcing.', 'https://coresignal.com', 'ENTERPRISE', 'cat-19'),
    t('t-122', 'DocSend', 'docsend', 'Document sharing with viewer analytics.', 'DocSend is the standard for sending pitch decks and memos with granular viewer analytics.', 'https://docsend.com', 'PAID', 'cat-19', true),
    t('t-123', 'Exa', 'exa', 'Neural search API for AI applications.', 'Exa is a neural-search API designed for AI agents and research tools — a developer primitive for real-time retrieval.', 'https://exa.ai', 'PAID', 'cat-19'),
    t('t-124', 'Gamma', 'gamma', 'AI-powered presentation and document builder.', 'Gamma generates beautiful decks and docs from a prompt — increasingly used for investor memos and portfolio updates.', 'https://gamma.app', 'FREEMIUM', 'cat-19'),
    t('t-125', 'Getro', 'getro', 'Talent network software for portfolio hiring.', 'Getro powers the talent-network and job-board software that VCs run for their portfolio companies.', 'https://getro.com', 'PAID', 'cat-19'),
    t('t-126', 'Gumloop', 'gumloop', 'Workflow automation for AI-native pipelines.', 'Gumloop is a workflow-automation platform built for AI-native pipelines — nodes, prompts, and integrations.', 'https://gumloop.com', 'FREEMIUM', 'cat-19'),
    t('t-127', 'Icypeas', 'icypeas', 'Email finder and professional contact lookup.', 'Icypeas is an email-finder and contact-enrichment tool used for outbound research and cold outreach.', 'https://icypeas.com', 'FREEMIUM', 'cat-19'),
    t('t-128', 'Luma', 'luma', 'Event scheduling for invite-only gatherings.', 'Luma runs event pages, RSVPs, and invites — the default for investor dinners, salons, and summit lineups.', 'https://lu.ma', 'FREEMIUM', 'cat-19'),
    t('t-129', 'Mailchimp', 'mailchimp', 'Email marketing platform.', 'Mailchimp is a long-running email-marketing platform — still the default for LP newsletters at many small funds.', 'https://mailchimp.com', 'FREEMIUM', 'cat-19'),
    t('t-130', 'Medium', 'medium', 'Long-form publishing platform.', 'Medium remains a go-to for investor and founder essays — the blogging layer that isn\u2019t Substack.', 'https://medium.com', 'FREEMIUM', 'cat-19'),
    t('t-131', 'Raycast', 'raycast', 'Mac productivity launcher with AI features.', 'Raycast is a macOS launcher with extensions and AI features — the keyboard command-centre for many power users.', 'https://raycast.com', 'FREEMIUM', 'cat-19'),
    t('t-132', 'Substack', 'substack', 'Newsletter publishing and subscriptions.', 'Substack is the publishing and subscription layer for most serious investor newsletters.', 'https://substack.com', 'FREEMIUM', 'cat-19', true),
    t('t-133', 'Tally', 'tally', 'Form builder that stays out of your way.', 'Tally is a minimalist form builder — popular for applications, deal submissions, and community intake.', 'https://tally.so', 'FREEMIUM', 'cat-19'),
    t('t-134', 'Trello', 'trello', 'Kanban-style project tracker.', 'Trello is the classic Kanban tracker — still in the toolkit for light project and dealflow management.', 'https://trello.com', 'FREEMIUM', 'cat-19'),
    t('t-135', 'Typeform', 'typeform', 'Conversational form builder.', 'Typeform is the conversational form builder — surveys, applications, and founder intake.', 'https://typeform.com', 'FREEMIUM', 'cat-19'),
    t('t-136', 'Webflow', 'webflow', 'Visual website builder for VC microsites.', 'Webflow is the visual website builder behind most Indian VC microsites, portfolio pages, and fund landing sites.', 'https://webflow.com', 'FREEMIUM', 'cat-19'),
    t('t-137', 'Wizikey', 'wizikey', 'PR and media monitoring, India-focused.', 'Wizikey is a PR and media-monitoring platform widely used by Indian fund-platform teams for portfolio comms.', 'https://wizikey.com', 'PAID', 'cat-19'),
    t('t-138', 'Zoom', 'zoom', 'Video conferencing — the default for pitch calls.', 'Zoom is still the default video-call platform for founder pitches, partner meetings, and LP updates.', 'https://zoom.us', 'FREEMIUM', 'cat-19', true),
  ]
}
