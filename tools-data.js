const ALL_TOOLS = [
  // --- AI ---
  { name: "ChatGPT", cat: "AI", domain: "openai.com" },
  { name: "Claude", cat: "AI", domain: "claude.ai" },
  { name: "Gemini", cat: "AI", domain: "gemini.com" },
  { name: "Manus", cat: "AI", domain: "manus.ai" },
  { name: "Mini Max", cat: "AI", domain: "minimax.com" },
  { name: "Perplexity", cat: "AI", domain: "perplexity.ai" },
  { name: "Qwen", cat: "AI", domain: "qwen.ai" },

  // --- Automation ---
  { name: "Make", cat: "Automation", domain: "make.com" },
  { name: "Phantom Buster", cat: "Automation", domain: "phantombuster.com" },
  { name: "Zapier", cat: "Automation", domain: "zapier.com" },
  { name: "n8n", cat: "Automation", domain: "n8n.io" },

  // --- Browser ---
  { name: "Arc Browser", cat: "Browser", domain: "arc.net" },
  { name: "Atlas", cat: "Browser", domain: "atlas.com" },
  { name: "Brave", cat: "Browser", domain: "brave.com" },
  { name: "Comet", cat: "Browser", domain: "cometbrowser.com" },
  { name: "Dia", cat: "Browser", domain: "dia.com" },
  { name: "Google Chrome", cat: "Browser", domain: "google.com" },

  // --- CRM ---
  { name: "Affinity", cat: "CRM", domain: "affinity.co" },
  { name: "Airtable", cat: "CRM", domain: "airtable.com" },
  { name: "Asana", cat: "CRM", domain: "asana.com" },
  { name: "Attio", cat: "CRM", domain: "attio.com" },
  { name: "Clay", cat: "CRM", domain: "clay.com" },
  { name: "EverTrace", cat: "CRM", domain: "evertrace.com" },
  { name: "Folk", cat: "CRM", domain: "folk.app" },
  { name: "HubSpot", cat: "CRM", domain: "hubspot.com" },
  { name: "Pipedrive", cat: "CRM", domain: "pipedrive.com" },
  { name: "Streak", cat: "CRM", domain: "streak.com" },
  { name: "Taghash", cat: "CRM", domain: "taghash.io" },
  { name: "The Investor Net", cat: "CRM", domain: "investor.net" },

  // --- Calendar ---
  { name: "Cal.com", cat: "Calendar", domain: "cal.com" },
  { name: "Vimcal", cat: "Calendar", domain: "vimcal.com" },

  // --- Captable ---
  { name: "Equity List", cat: "Captable", domain: "equitylist.com" },
  { name: "Incentive Finance", cat: "Captable", domain: "incentivefinance.com" },
  { name: "Qapita", cat: "Captable", domain: "qapita.com" },

  // --- Communication ---
  { name: "Discord", cat: "Communication", domain: "discord.com" },
  { name: "Slack", cat: "Communication", domain: "slack.com" },
  { name: "Whatsapp", cat: "Communication", domain: "whatsapp.com" },

  // --- Data ---
  { name: "CB Insights", cat: "Data", domain: "cbinsights.com" },
  { name: "Crunchbase", cat: "Data", domain: "crunchbase.com" },
  { name: "Harmonic", cat: "Data", domain: "harmonic.com" },
  { name: "Inc42 Data Labs", cat: "Data", domain: "inc42.com" },
  { name: "Linkedin Sales Navigator", cat: "Data", domain: "linkedin.com" },
  { name: "PE Front Office", cat: "Data", domain: "pefrontoffice.com" },
  { name: "PitchBook", cat: "Data", domain: "pitchbook.com" },
  { name: "Preqin", cat: "Data", domain: "preqin.com" },
  { name: "Private Circle", cat: "Data", domain: "privatecircle.com" },
  { name: "Product Hunt", cat: "Data", domain: "producthunt.com" },
  { name: "Sanchi Connect", cat: "Data", domain: "sanchiconnect.com" },
  { name: "Tracxn", cat: "Data", domain: "tracxn.com" },
  { name: "Twitter", cat: "Data", domain: "x.com" },
  { name: "Venture Intelligence", cat: "Data", domain: "ventureintelligence.com" },

  // --- Finance ---
  { name: "Darwin Box", cat: "Finance", domain: "darwinbox.com" },
  { name: "Keka Payroll", cat: "Finance", domain: "kekapayroll.com" },
  { name: "Zoho Reimburshments", cat: "Finance", domain: "zoho.com" },

  // --- Fund Ops ---
  { name: "AngelList", cat: "Fund Ops", domain: "angel.co" },
  { name: "Infynite Club", cat: "Fund Ops", domain: "infyniteclub.com" },
  { name: "LetsVenture", cat: "Fund Ops", domain: "letsventure.com" },

  // --- Mailing ---
  { name: "Notion Mail", cat: "Mailing", domain: "notion.so" },
  { name: "Simplehuman", cat: "Mailing", domain: "simplehuman.email" },
  { name: "Superhuman", cat: "Mailing", domain: "superhuman.com" },

  // --- News ---
  { name: "ARC Internet", cat: "News", domain: "arcinternet.com" },
  { name: "Economic Times", cat: "News", domain: "economictimes.indiatimes.com" },
  { name: "Entrepeneur India", cat: "News", domain: "entrepreneur.com" },
  { name: "Forbes", cat: "News", domain: "forbes.com" },
  { name: "Fortune", cat: "News", domain: "fortune.com" },
  { name: "Gander", cat: "News", domain: "gander.com" },
  { name: "Ken", cat: "News", domain: "ken.com" },
  { name: "Money Control", cat: "News", domain: "moneycontrol.com" },
  { name: "TMC", cat: "News", domain: "tmc.com" },
  { name: "TechCrunch Extra Crunch", cat: "News", domain: "techcrunch.com" },
  { name: "The Generalist", cat: "News", domain: "generalist.com" },
  { name: "VCCircle", cat: "News", domain: "vccircle.com" },
  { name: "YourStory", cat: "News", domain: "yourstory.com" },
  { name: "entrackr", cat: "News", domain: "entrackr.com" },

  // --- Portfolio Management ---
  { name: "Carta", cat: "Portfolio Management", domain: "carta.com" },
  { name: "Standard Metrics", cat: "Portfolio Management", domain: "standardmetrics.com" },
  { name: "Vestberry", cat: "Portfolio Management", domain: "vestberry.com" },

  // --- Project Management ---
  { name: "Coda", cat: "Project Management", domain: "coda.io" },
  { name: "Google Sheets", cat: "Project Management", domain: "google.com" },

  // --- Research ---
  { name: "1Lattice", cat: "Research", domain: "1lattice.com" },
  { name: "AlphaSense", cat: "Research", domain: "alpha-sense.com" },
  { name: "Bain Reports", cat: "Research", domain: "bain.com" },
  { name: "Clearbit", cat: "Research", domain: "clearbit.com" },
  { name: "Constellation Research", cat: "Research", domain: "constellationr.com" },
  { name: "Data AI (App Annie)", cat: "Research", domain: "appannie.com" },
  { name: "Forrester", cat: "Research", domain: "go.forrester.com" },
  { name: "Frost & Sullivan", cat: "Research", domain: "frost.com" },
  { name: "G2", cat: "Research", domain: "g2.com" },
  { name: "GLG", cat: "Research", domain: "glginsights.com" },
  { name: "Gartner", cat: "Research", domain: "gartner.com" },
  { name: "Kavi Research", cat: "Research", domain: "kaviresearch.com" },
  { name: "Latka", cat: "Research", domain: "latka.co" },
  { name: "Owler", cat: "Research", domain: "owler.com" },
  { name: "RedSeer", cat: "Research", domain: "redseer.com" },
  { name: "Similarweb", cat: "Research", domain: "similarweb.com" },
  { name: "Statista", cat: "Research", domain: "statista.com" },
  { name: "Tegus", cat: "Research", domain: "tegus.co" },

  // --- Tools ---
  { name: "Axiom", cat: "Tools", domain: "axiom.co" },
  { name: "Bardeen", cat: "Tools", domain: "bardeen.ai" },
  { name: "Bright Data", cat: "Tools", domain: "brightdata.com" },
  { name: "Cabal", cat: "Tools", domain: "getcabal.com" },
  { name: "Calendly", cat: "Tools", domain: "calendly.com" },
  { name: "Canva", cat: "Tools", domain: "canva.com" },
  { name: "Chronicle HQ", cat: "Tools", domain: "chroniclehq.com" },
  { name: "Coresignal", cat: "Tools", domain: "coresignal.com" },
  { name: "Docusend", cat: "Tools", domain: "docsend.com" },
  { name: "Gamma", cat: "Tools", domain: "gamma.app" },
  { name: "Getro", cat: "Tools", domain: "getro.com" },
  { name: "GitRow", cat: "Tools", domain: "gitrow.com" },
  { name: "Gumloop", cat: "Tools", domain: "gumloop.com" },
  { name: "Icypeas", cat: "Tools", domain: "icypeas.com" },
  { name: "Luma", cat: "Tools", domain: "luma.com" },
  { name: "MMT", cat: "Tools", domain: "mmt.tools" },
  { name: "Mailchimp", cat: "Tools", domain: "mailchimp.com" },
  { name: "Medium", cat: "Tools", domain: "medium.com" },
  { name: "Notion Calendar", cat: "Tools", domain: "notion.so" },
  { name: "Raycast", cat: "Tools", domain: "raycast.com" },
  { name: "Shortwave", cat: "Tools", domain: "shortwave.com" },
  { name: "Substack", cat: "Tools", domain: "substack.com" },
  { name: "Tako", cat: "Tools", domain: "tako.com" },
  { name: "Tally Forms", cat: "Tools", domain: "tallyforms.com" },
  { name: "Trello", cat: "Tools", domain: "trello.com" },
  { name: "Typeform", cat: "Tools", domain: "typeform.com" },
  { name: "ValueLabs", cat: "Tools", domain: "valuelabs.com" },
  { name: "Webflow", cat: "Tools", domain: "webflow.com" },
  { name: "Wizikey", cat: "Tools", domain: "wizikey.com" },
  { name: "Zoom", cat: "Tools", domain: "zoom.us" },

  // --- Transcription ---
  { name: "Circleback", cat: "Transcription", domain: "circleback.com" },
  { name: "Fathom", cat: "Transcription", domain: "fathom.video" },
  { name: "Fireflies", cat: "Transcription", domain: "fireflies.ai" },
  { name: "Granola", cat: "Transcription", domain: "granola.com" },
  { name: "Otter", cat: "Transcription", domain: "otter.ai" },

  // --- Vibe Coding ---
  { name: "Bolt", cat: "Vibe Coding", domain: "bolt.com" },
  { name: "Lovable", cat: "Vibe Coding", domain: "lovable.com" },
  { name: "Replit", cat: "Vibe Coding", domain: "replit.com" },
  { name: "v0", cat: "Vibe Coding", domain: "vibecoding.com" },

  // --- Voice to Text ---
  { name: "Aqua Voice", cat: "Voice to Text", domain: "aquavoice.com" },
  { name: "Superwhisper", cat: "Voice to Text", domain: "superwhisper.ai" },
  { name: "VoiceInk", cat: "Voice to Text", domain: "voiceink.com" },
  { name: "Willow Voice", cat: "Voice to Text", domain: "willowvoice.com" },
  { name: "Wispr Flow", cat: "Voice to Text", domain: "wisprflow.com" },
];

// Total unique tools: 141
// Count per category:
//   AI: 7
//   Automation: 4
//   Browser: 6
//   CRM: 12
//   Calendar: 2
//   Captable: 3
//   Communication: 3
//   Data: 14
//   Finance: 3
//   Fund Ops: 3
//   Mailing: 3
//   News: 14
//   Portfolio Management: 3
//   Project Management: 2
//   Research: 18
//   Tools: 30
//   Transcription: 5
//   Vibe Coding: 4
//   Voice to Text: 5
