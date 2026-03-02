"use client";

import { useEffect, useRef } from "react";
import { IndianVCsLogo } from "./logo";

/* ── Tool data ── */
interface Tool {
  n: string;
  c: string;
  d: string;
  u?: string; // custom image URL (overrides Google Favicons)
  bg?: string; // custom background color for the logo
}

const D: Tool[] = [
  // CRM (12) — added Notion, updated EverTrace domain
  {n:"Affinity",c:"CRM",d:"affinity.co"},{n:"Airtable",c:"CRM",d:"airtable.com"},{n:"Asana",c:"CRM",d:"asana.com"},{n:"Attio",c:"CRM",d:"attio.com"},{n:"Clay",c:"CRM",d:"clay.com"},{n:"EverTrace",c:"CRM",d:"evertrace.ai"},{n:"Folk",c:"CRM",d:"folk.app"},{n:"HubSpot",c:"CRM",d:"hubspot.com"},{n:"Notion",c:"CRM",d:"notion.so"},{n:"Pipedrive",c:"CRM",d:"pipedrive.com"},{n:"Streak",c:"CRM",d:"streak.com"},{n:"Taghash",c:"CRM",d:"taghash.io"},
  // Admin/Ops (4) — renamed from Fund Ops, added Incentive Finance, updated domains
  {n:"AngelList",c:"Admin/Ops",d:"angellistindia.com"},{n:"Incentive Finance",c:"Admin/Ops",d:"incentiv.finance"},{n:"Infynite Club",c:"Admin/Ops",d:"infinyte.club"},{n:"LetsVenture",c:"Admin/Ops",d:"letsventure.com"},
  // Captable (3) — moved Incentive Finance to Admin/Ops, added Carta
  {n:"Carta",c:"Captable",d:"carta.com"},{n:"Equity List",c:"Captable",d:"equitylist.com"},{n:"Qapita",c:"Captable",d:"qapita.com"},
  // Data (13) — removed PE Front Office, updated Harmonic/Private Circle domains
  {n:"CB Insights",c:"Data",d:"cbinsights.com"},{n:"Crunchbase",c:"Data",d:"crunchbase.com"},{n:"Harmonic",c:"Data",d:"harmonic.ai"},{n:"Inc42 Data Labs",c:"Data",d:"inc42.com"},{n:"LinkedIn Sales Nav",c:"Data",d:"linkedin.com"},{n:"PitchBook",c:"Data",d:"pitchbook.com"},{n:"Preqin",c:"Data",d:"preqin.com"},{n:"Private Circle",c:"Data",d:"privatecircle.co"},{n:"Product Hunt",c:"Data",d:"producthunt.com"},{n:"Sanchi Connect",c:"Data",d:"sanchiconnect.com"},{n:"Tracxn",c:"Data",d:"tracxn.com"},{n:"Twitter",c:"Data",d:"x.com"},{n:"Venture Intelligence",c:"Data",d:"",u:"https://www.ventureintelligence.info/static/images/icon.png"},
  // Finance (3)
  {n:"Darwin Box",c:"Finance",d:"darwinbox.com"},{n:"Keka",c:"Finance",d:"keka.com"},{n:"Zoho",c:"Finance",d:"zoho.com"},
  // Productivity (4) — renamed from Project Mgmt, added Airtable
  {n:"Airtable",c:"Productivity",d:"airtable.com"},{n:"Coda",c:"Productivity",d:"coda.io"},{n:"Google Sheets",c:"Productivity",d:"google.com"},{n:"Notion",c:"Productivity",d:"notion.so"},
  // Research (15) — removed Tegus/Constellation/Forrester/Frost&Sullivan/Latka, added Ahrefs/SEMRush, updated Kavi domain
  {n:"1Lattice",c:"Research",d:"1lattice.com"},{n:"Ahrefs",c:"Research",d:"ahrefs.com",u:"https://assets-3b70.kxcdn.com/images/mediakit/logo_blue@2x.png?v=2"},{n:"AlphaSense",c:"Research",d:"alpha-sense.com"},{n:"Bain",c:"Research",d:"bain.com"},{n:"Clearbit",c:"Research",d:"clearbit.com"},{n:"Data AI",c:"Research",d:"data.ai"},{n:"G2",c:"Research",d:"g2.com"},{n:"GLG",c:"Research",d:"glginsights.com"},{n:"Gartner",c:"Research",d:"gartner.com"},{n:"Kavi Research",c:"Research",d:"joinkavi.com"},{n:"Owler",c:"Research",d:"owler.com"},{n:"RedSeer",c:"Research",d:"redseer.com"},{n:"SEMRush",c:"Research",d:"semrush.com"},{n:"Similarweb",c:"Research",d:"similarweb.com"},{n:"Statista",c:"Research",d:"statista.com"},
  // Communication (4) — added Telegram
  {n:"Discord",c:"Communication",d:"discord.com"},{n:"Slack",c:"Communication",d:"slack.com"},{n:"Telegram",c:"Communication",d:"telegram.org"},{n:"WhatsApp",c:"Communication",d:"whatsapp.com"},
  // Vibe Coding (5)
  {n:"Bolt",c:"Vibe Coding",d:"bolt.new"},{n:"Emergent",c:"Vibe Coding",d:"emergent.sh"},{n:"Lovable",c:"Vibe Coding",d:"lovable.dev"},{n:"Replit",c:"Vibe Coding",d:"replit.com"},{n:"v0",c:"Vibe Coding",d:"v0.dev"},
  // News (14) — renamed ARC Internet→Arc, removed Fortune/Gander, updated Ken domain
  {n:"Arc",c:"News",d:"thearcweb.com",bg:"#000"},{n:"Economic Times",c:"News",d:"economictimes.indiatimes.com"},{n:"Entrepreneur India",c:"News",d:"entrepreneur.com"},{n:"Forbes",c:"News",d:"forbes.com"},{n:"Inc42",c:"News",d:"inc42.com"},{n:"Ken",c:"News",d:"the-ken.com"},{n:"Live Mint",c:"News",d:"livemint.com"},{n:"Money Control",c:"News",d:"moneycontrol.com"},{n:"The Morning Context",c:"News",d:"themorningcontext.com"},{n:"TechCrunch",c:"News",d:"techcrunch.com"},{n:"The Generalist",c:"News",d:"generalist.com"},{n:"VCCircle",c:"News",d:"vccircle.com"},{n:"YourStory",c:"News",d:"yourstory.com"},{n:"entrackr",c:"News",d:"entrackr.com"},
  // AI (7)
  {n:"ChatGPT",c:"AI",d:"openai.com"},{n:"Claude",c:"AI",d:"claude.ai"},{n:"Gemini",c:"AI",d:"gemini.google.com"},{n:"Manus",c:"AI",d:"manus.ai"},{n:"MiniMax",c:"AI",d:"minimax.io"},{n:"Perplexity",c:"AI",d:"perplexity.ai"},{n:"Qwen",c:"AI",d:"qwen.ai"},
  // Voice to Text (4) — removed VoiceInk
  {n:"Aqua Voice",c:"Voice to Text",d:"aquavoice.com"},{n:"Superwhisper",c:"Voice to Text",d:"superwhisper.ai"},{n:"Willow Voice",c:"Voice to Text",d:"willowvoice.com"},{n:"Wispr Flow",c:"Voice to Text",d:"wisprflow.com"},
  // Other Tools (23) — removed Cabal/Bright Data/GitRow/MMT/ValueLabs/Tako
  {n:"Axiom",c:"Other Tools",d:"axiom.co"},{n:"Bardeen",c:"Other Tools",d:"bardeen.ai"},{n:"Canva",c:"Other Tools",d:"canva.com"},{n:"Chronicle HQ",c:"Other Tools",d:"chroniclehq.com"},{n:"Circle",c:"Other Tools",d:"circle.so"},{n:"Coresignal",c:"Other Tools",d:"coresignal.com"},{n:"DocSend",c:"Other Tools",d:"docsend.com"},{n:"Exa",c:"Other Tools",d:"exa.ai"},{n:"Gamma",c:"Other Tools",d:"gamma.app"},{n:"Getro",c:"Other Tools",d:"getro.com"},{n:"Gumloop",c:"Other Tools",d:"gumloop.com"},{n:"Icypeas",c:"Other Tools",d:"icypeas.com"},{n:"Luma",c:"Other Tools",d:"lu.ma"},{n:"Mailchimp",c:"Other Tools",d:"mailchimp.com"},{n:"Medium",c:"Other Tools",d:"medium.com"},{n:"Raycast",c:"Other Tools",d:"raycast.com"},{n:"Substack",c:"Other Tools",d:"substack.com"},{n:"Tally",c:"Other Tools",d:"tally.so"},{n:"Trello",c:"Other Tools",d:"trello.com"},{n:"Typeform",c:"Other Tools",d:"typeform.com"},{n:"Webflow",c:"Other Tools",d:"webflow.com"},{n:"Wizikey",c:"Other Tools",d:"wizikey.com"},{n:"Zoom",c:"Other Tools",d:"zoom.us"},
  // Portfolio Mgmt (3) — updated Standard Metrics domain
  {n:"Carta",c:"Portfolio Mgmt",d:"carta.com"},{n:"Standard Metrics",c:"Portfolio Mgmt",d:"standardmetrics.io"},{n:"Vestberry",c:"Portfolio Mgmt",d:"vestberry.com"},
  // Automation (4)
  {n:"Make",c:"Automation",d:"make.com"},{n:"Phantom Buster",c:"Automation",d:"phantombuster.com"},{n:"Zapier",c:"Automation",d:"zapier.com"},{n:"n8n",c:"Automation",d:"n8n.io"},
  // Mailing (4)
  {n:"Notion Mail",c:"Mailing",d:"notion.so"},{n:"Shortwave",c:"Mailing",d:"shortwave.com"},{n:"Simplehuman",c:"Mailing",d:"simplehuman.email"},{n:"Superhuman",c:"Mailing",d:"superhuman.com"},
  // Calendar (4)
  {n:"Cal.com",c:"Calendar",d:"cal.com"},{n:"Calendly",c:"Calendar",d:"calendly.com"},{n:"Notion Calendar",c:"Calendar",d:"notion.so"},{n:"Vimcal",c:"Calendar",d:"vimcal.com"},
  // Browser (6) — updated Atlas/Comet/Chrome domains
  {n:"Arc",c:"Browser",d:"arc.net"},{n:"Atlas",c:"Browser",d:"chatgpt.com"},{n:"Brave",c:"Browser",d:"brave.com"},{n:"Comet",c:"Browser",d:"perplexity.ai"},{n:"Dia",c:"Browser",d:"diabrowser.com"},{n:"Google Chrome",c:"Browser",d:"chrome.google.com"},
  // Transcription (6) — updated Circleback/Fathom domains
  {n:"Circleback",c:"Transcription",d:"circleback.ai"},{n:"Fathom",c:"Transcription",d:"fathom.ai"},{n:"Fireflies",c:"Transcription",d:"fireflies.ai"},{n:"Granola",c:"Transcription",d:"granola.so"},{n:"Notion",c:"Transcription",d:"notion.so"},{n:"Otter",c:"Transcription",d:"otter.ai"},
];

/* ── Column layout ── */
const COLS = [
  ["CRM", "Admin/Ops", "Captable", "Voice to Text", "Mailing"],
  ["Data", "Finance", "Productivity", "Calendar"],
  ["Research", "Communication", "Vibe Coding", "Automation"],
  ["News", "AI", "Browser"],
  ["Other Tools", "Portfolio Mgmt", "Transcription"],
];

/* ── Fallback gradients for missing logos ── */
const GRAD_PAIRS = [
  ["#D21905","#AB342B"],["#301008","#5a2a1e"],["#1a1a2e","#16213e"],
  ["#0f3460","#533483"],["#2d6a4f","#40916c"],["#6930c3","#5390d9"],
  ["#e85d04","#dc2f02"],["#7b2cbf","#c77dff"],["#3a0ca3","#4895ef"],
  ["#495057","#810100"],
];

function gradient(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  const [a, b] = GRAD_PAIRS[Math.abs(h) % GRAD_PAIRS.length];
  return `linear-gradient(135deg,${a},${b})`;
}

function initials(name: string) {
  const w = name.trim().split(/\s+/);
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase();
}

/* ── Render (DOM-based for performance with 147 tools) ── */
function renderLandscape(el: HTMLDivElement) {
  el.innerHTML = "";
  const grouped: Record<string, Tool[]> = {};
  D.forEach((t) => {
    if (!grouped[t.c]) grouped[t.c] = [];
    grouped[t.c].push(t);
  });

  COLS.forEach((catList) => {
    const col = document.createElement("div");
    col.className = "col";
    catList.forEach((cat) => {
      const tools = grouped[cat] || [];
      if (!tools.length) return;
      tools.sort((a, b) => a.n.localeCompare(b.n));

      const card = document.createElement("div");
      card.className = "card";
      const head = document.createElement("div");
      head.className = "card-head";
      const nm = document.createElement("span");
      nm.className = "name";
      nm.textContent = cat;
      head.appendChild(nm);
      card.appendChild(head);

      const wrap = document.createElement("div");
      wrap.className = "tools";
      tools.forEach((t) => {
        const pill = document.createElement("div");
        pill.className = "t";
        pill.title = t.n + (t.d ? " — " + t.d : "");

        if (t.u || t.d) {
          const img = document.createElement("img");
          img.src = t.u || `https://www.google.com/s2/favicons?domain=${t.d}&sz=128`;
          img.alt = "";
          img.loading = "lazy";
          if (t.bg) img.style.background = t.bg;
          img.onerror = function () {
            const fb = document.createElement("div");
            fb.className = "t-fb";
            fb.textContent = initials(t.n);
            fb.style.background = gradient(t.n);
            (this as HTMLElement).replaceWith(fb);
          };
          pill.appendChild(img);
        } else {
          const fb = document.createElement("div");
          fb.className = "t-fb";
          fb.textContent = initials(t.n);
          fb.style.background = gradient(t.n);
          pill.appendChild(fb);
        }

        const span = document.createElement("span");
        span.textContent = t.n;
        pill.appendChild(span);
        wrap.appendChild(pill);
      });
      card.appendChild(wrap);
      col.appendChild(card);
    });
    el.appendChild(col);
  });
}

export default function Home() {
  const landscapeRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (landscapeRef.current) {
      renderLandscape(landscapeRef.current);
    }

    // Scale poster to fit viewport. Poster is one fixed 1920×1080
    // unit — it only scales, never reflows.
    //
    // All viewports: scale to fit entirely in viewport (like an image).
    // On mobile the poster appears small — users pinch-to-zoom to
    // read details (viewport meta allows up to 5× zoom).
    function fitPoster() {
      if (!posterRef.current) return;
      const page = posterRef.current.parentElement!;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Fit poster inside viewport, then shrink 20% for breathing room
      const scale = Math.min(vw / 1920, vh / 1080, 1) * 0.96;

      const w = Math.ceil(1920 * scale);
      const h = Math.ceil(1080 * scale);
      posterRef.current.style.transform = `scale(${scale})`;

      // Page fills viewport; poster is centered inside via padding.
      // overflow:hidden hides the poster's 1920px layout box.
      page.style.width = `${vw}px`;
      page.style.height = `${vh}px`;
      page.style.overflow = "hidden";

      // Center in viewport with padding
      page.style.paddingLeft = `${Math.max(0, (vw - w) / 2)}px`;
      page.style.paddingTop = `${Math.max(0, (vh - h) / 2)}px`;
    }

    fitPoster();
    window.addEventListener("resize", fitPoster);
    return () => window.removeEventListener("resize", fitPoster);
  }, []);

  return (
    <div className="poster-page">
      <div className="poster" ref={posterRef}>
        <header className="header">
          <h1>
            <a
              href="https://indianvcs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-link"
              title="Indian VCs"
            >
              <IndianVCsLogo />
            </a>
            {" "}Tech Stack 2026
          </h1>
        </header>
        <div className="landscape" ref={landscapeRef} />
        <div className="disclaimer">This market map is for informational purposes only and reflects publicly available data + editorial curation &bull; Not exhaustive &bull; No ranking, recommendation, or endorsement is implied &bull; All trademarks/logos are the property of their respective owners</div>
        <footer className="poster-footer">
          <span>Discover tools &amp; workflows used by the top 1% VCs</span>
          <span className="footer-sep">&rarr;</span>
          <a href="https://hub.indianvcs.com" target="_blank" rel="noopener noreferrer" className="footer-link">hub.indianvcs.com</a>
        </footer>
      </div>
    </div>
  );
}
