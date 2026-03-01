"use client";

import { useEffect, useRef } from "react";
import { IndianVCsLogo } from "./logo";
import { DevLinkProvider } from "../../devlink/DevLinkProvider";
import { GlobalStyles } from "../../devlink/GlobalStyles";
import { Navbar } from "../../devlink/Navbar";
import { ContactSection } from "../../devlink/ContactSection";
import { Footer } from "../../devlink/Footer";

/* ── Tool data ── */
interface Tool {
  n: string;
  c: string;
  d: string;
}

const D: Tool[] = [
  // CRM (11)
  {n:"Affinity",c:"CRM",d:"affinity.co"},{n:"Airtable",c:"CRM",d:"airtable.com"},{n:"Asana",c:"CRM",d:"asana.com"},{n:"Attio",c:"CRM",d:"attio.com"},{n:"Clay",c:"CRM",d:"clay.com"},{n:"EverTrace",c:"CRM",d:"evertrace.com"},{n:"Folk",c:"CRM",d:"folk.app"},{n:"HubSpot",c:"CRM",d:"hubspot.com"},{n:"Pipedrive",c:"CRM",d:"pipedrive.com"},{n:"Streak",c:"CRM",d:"streak.com"},{n:"Taghash",c:"CRM",d:"taghash.io"},
  // Fund Ops (3)
  {n:"AngelList",c:"Fund Ops",d:"angel.co"},{n:"Infynite Club",c:"Fund Ops",d:"infyniteclub.com"},{n:"LetsVenture",c:"Fund Ops",d:"letsventure.com"},
  // Captable (3)
  {n:"Equity List",c:"Captable",d:"equitylist.com"},{n:"Incentive Finance",c:"Captable",d:"incentivefinance.com"},{n:"Qapita",c:"Captable",d:"qapita.com"},
  // Data (14)
  {n:"CB Insights",c:"Data",d:"cbinsights.com"},{n:"Crunchbase",c:"Data",d:"crunchbase.com"},{n:"Harmonic",c:"Data",d:"harmonic.com"},{n:"Inc42 Data Labs",c:"Data",d:"inc42.com"},{n:"LinkedIn Sales Nav",c:"Data",d:"linkedin.com"},{n:"PE Front Office",c:"Data",d:"pefrontoffice.com"},{n:"PitchBook",c:"Data",d:"pitchbook.com"},{n:"Preqin",c:"Data",d:"preqin.com"},{n:"Private Circle",c:"Data",d:"privatecircle.com"},{n:"Product Hunt",c:"Data",d:"producthunt.com"},{n:"Sanchi Connect",c:"Data",d:"sanchiconnect.com"},{n:"Tracxn",c:"Data",d:"tracxn.com"},{n:"Twitter",c:"Data",d:"x.com"},{n:"Venture Intelligence",c:"Data",d:"ventureintelligence.com"},
  // Finance (3)
  {n:"Darwin Box",c:"Finance",d:"darwinbox.com"},{n:"Keka",c:"Finance",d:"keka.com"},{n:"Zoho",c:"Finance",d:"zoho.com"},
  // Project Mgmt (3)
  {n:"Coda",c:"Project Mgmt",d:"coda.io"},{n:"Google Sheets",c:"Project Mgmt",d:"google.com"},{n:"Notion",c:"Project Mgmt",d:"notion.so"},
  // Research (18)
  {n:"1Lattice",c:"Research",d:"1lattice.com"},{n:"AlphaSense",c:"Research",d:"alpha-sense.com"},{n:"Bain",c:"Research",d:"bain.com"},{n:"Clearbit",c:"Research",d:"clearbit.com"},{n:"Constellation",c:"Research",d:"constellationr.com"},{n:"Data AI",c:"Research",d:"data.ai"},{n:"Forrester",c:"Research",d:"forrester.com"},{n:"Frost & Sullivan",c:"Research",d:"frost.com"},{n:"G2",c:"Research",d:"g2.com"},{n:"GLG",c:"Research",d:"glginsights.com"},{n:"Gartner",c:"Research",d:"gartner.com"},{n:"Kavi Research",c:"Research",d:"kaviresearch.com"},{n:"Latka",c:"Research",d:"latka.co"},{n:"Owler",c:"Research",d:"owler.com"},{n:"RedSeer",c:"Research",d:"redseer.com"},{n:"Similarweb",c:"Research",d:"similarweb.com"},{n:"Statista",c:"Research",d:"statista.com"},{n:"Tegus",c:"Research",d:"tegus.co"},
  // Communication (3)
  {n:"Discord",c:"Communication",d:"discord.com"},{n:"Slack",c:"Communication",d:"slack.com"},{n:"WhatsApp",c:"Communication",d:"whatsapp.com"},
  // Vibe Coding (5)
  {n:"Bolt",c:"Vibe Coding",d:"bolt.new"},{n:"Emergent",c:"Vibe Coding",d:"emergent.sh"},{n:"Lovable",c:"Vibe Coding",d:"lovable.dev"},{n:"Replit",c:"Vibe Coding",d:"replit.com"},{n:"v0",c:"Vibe Coding",d:"v0.dev"},
  // News (16)
  {n:"ARC Internet",c:"News",d:"thearcweb.com"},{n:"Economic Times",c:"News",d:"economictimes.indiatimes.com"},{n:"Entrepreneur India",c:"News",d:"entrepreneur.com"},{n:"Forbes",c:"News",d:"forbes.com"},{n:"Fortune",c:"News",d:"fortune.com"},{n:"Gander",c:"News",d:"gandertime.com"},{n:"Inc42",c:"News",d:"inc42.com"},{n:"Ken",c:"News",d:"ken.com"},{n:"Live Mint",c:"News",d:"livemint.com"},{n:"Money Control",c:"News",d:"moneycontrol.com"},{n:"TMC",c:"News",d:"tmc.com"},{n:"TechCrunch",c:"News",d:"techcrunch.com"},{n:"The Generalist",c:"News",d:"generalist.com"},{n:"VCCircle",c:"News",d:"vccircle.com"},{n:"YourStory",c:"News",d:"yourstory.com"},{n:"entrackr",c:"News",d:"entrackr.com"},
  // AI (7)
  {n:"ChatGPT",c:"AI",d:"openai.com"},{n:"Claude",c:"AI",d:"claude.ai"},{n:"Gemini",c:"AI",d:"gemini.google.com"},{n:"Manus",c:"AI",d:"manus.ai"},{n:"MiniMax",c:"AI",d:"minimax.com"},{n:"Perplexity",c:"AI",d:"perplexity.ai"},{n:"Qwen",c:"AI",d:"qwen.ai"},
  // Voice to Text (5)
  {n:"Aqua Voice",c:"Voice to Text",d:"aquavoice.com"},{n:"Superwhisper",c:"Voice to Text",d:"superwhisper.ai"},{n:"VoiceInk",c:"Voice to Text",d:"tryvoiceink.com"},{n:"Willow Voice",c:"Voice to Text",d:"willowvoice.com"},{n:"Wispr Flow",c:"Voice to Text",d:"wisprflow.com"},
  // Other Tools (29)
  {n:"Axiom",c:"Other Tools",d:"axiom.co"},{n:"Bardeen",c:"Other Tools",d:"bardeen.ai"},{n:"Bright Data",c:"Other Tools",d:"brightdata.com"},{n:"Cabal",c:"Other Tools",d:"getcabal.com"},{n:"Canva",c:"Other Tools",d:"canva.com"},{n:"Chronicle HQ",c:"Other Tools",d:"chroniclehq.com"},{n:"Circle",c:"Other Tools",d:"circle.so"},{n:"Coresignal",c:"Other Tools",d:"coresignal.com"},{n:"DocSend",c:"Other Tools",d:"docsend.com"},{n:"Exa",c:"Other Tools",d:"exa.ai"},{n:"Gamma",c:"Other Tools",d:"gamma.app"},{n:"Getro",c:"Other Tools",d:"getro.com"},{n:"GitRow",c:"Other Tools",d:"gitrow.com"},{n:"Gumloop",c:"Other Tools",d:"gumloop.com"},{n:"Icypeas",c:"Other Tools",d:"icypeas.com"},{n:"Luma",c:"Other Tools",d:"lu.ma"},{n:"MMT",c:"Other Tools",d:"mmt.tools"},{n:"Mailchimp",c:"Other Tools",d:"mailchimp.com"},{n:"Medium",c:"Other Tools",d:"medium.com"},{n:"Raycast",c:"Other Tools",d:"raycast.com"},{n:"Substack",c:"Other Tools",d:"substack.com"},{n:"Tako",c:"Other Tools",d:"tako.com"},{n:"Tally",c:"Other Tools",d:"tally.so"},{n:"Trello",c:"Other Tools",d:"trello.com"},{n:"Typeform",c:"Other Tools",d:"typeform.com"},{n:"ValueLabs",c:"Other Tools",d:"valuelabs.com"},{n:"Webflow",c:"Other Tools",d:"webflow.com"},{n:"Wizikey",c:"Other Tools",d:"wizikey.com"},{n:"Zoom",c:"Other Tools",d:"zoom.us"},
  // Portfolio Mgmt (3)
  {n:"Carta",c:"Portfolio Mgmt",d:"carta.com"},{n:"Standard Metrics",c:"Portfolio Mgmt",d:"standardmetrics.com"},{n:"Vestberry",c:"Portfolio Mgmt",d:"vestberry.com"},
  // Automation (4)
  {n:"Make",c:"Automation",d:"make.com"},{n:"Phantom Buster",c:"Automation",d:"phantombuster.com"},{n:"Zapier",c:"Automation",d:"zapier.com"},{n:"n8n",c:"Automation",d:"n8n.io"},
  // Mailing (4)
  {n:"Notion Mail",c:"Mailing",d:"notion.so"},{n:"Shortwave",c:"Mailing",d:"shortwave.com"},{n:"Simplehuman",c:"Mailing",d:"simplehuman.email"},{n:"Superhuman",c:"Mailing",d:"superhuman.com"},
  // Calendar (4)
  {n:"Cal.com",c:"Calendar",d:"cal.com"},{n:"Calendly",c:"Calendar",d:"calendly.com"},{n:"Notion Calendar",c:"Calendar",d:"notion.so"},{n:"Vimcal",c:"Calendar",d:"vimcal.com"},
  // Browser (6)
  {n:"Arc",c:"Browser",d:"arc.net"},{n:"Atlas",c:"Browser",d:"atlas.com"},{n:"Brave",c:"Browser",d:"brave.com"},{n:"Comet",c:"Browser",d:"cometbrowser.com"},{n:"Dia",c:"Browser",d:"diabrowser.com"},{n:"Google Chrome",c:"Browser",d:"google.com"},
  // Transcription (6)
  {n:"Circleback",c:"Transcription",d:"circleback.com"},{n:"Fathom",c:"Transcription",d:"fathom.video"},{n:"Fireflies",c:"Transcription",d:"fireflies.ai"},{n:"Granola",c:"Transcription",d:"granola.so"},{n:"Notion",c:"Transcription",d:"notion.so"},{n:"Otter",c:"Transcription",d:"otter.ai"},
];

/* ── Column layout ── */
const COLS = [
  ["CRM", "Fund Ops", "Captable", "Voice to Text"],
  ["Data", "Finance", "Project Mgmt"],
  ["Research", "Communication", "Vibe Coding"],
  ["News", "AI"],
  ["Other Tools", "Portfolio Mgmt"],
  ["Automation", "Mailing", "Calendar", "Browser", "Transcription"],
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

        if (t.d) {
          const img = document.createElement("img");
          img.src = `https://www.google.com/s2/favicons?domain=${t.d}&sz=128`;
          img.alt = "";
          img.loading = "lazy";
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

  useEffect(() => {
    if (landscapeRef.current) {
      renderLandscape(landscapeRef.current);
    }
  }, []);

  return (
    <DevLinkProvider>
      <GlobalStyles />
      <Navbar />
      <div className="page-content">
        <div className="poster-wrap">
        <div className="poster">
          <header className="header">
            <div className="hdr-row">
              <h1>VC Stack</h1>
              <span className="sep">&middot;</span>
              <span className="curated">curated by</span>
              <a
                href="https://hub.indianvcs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="logo-link"
                title="Indian VCs"
              >
                <IndianVCsLogo />
              </a>
            </div>
          </header>
          <div className="landscape" ref={landscapeRef} />
          <div className="poster-footer" />
        </div>
        </div>
      </div>
      <ContactSection />
      <Footer title="Shaping India's venture future" />
    </DevLinkProvider>
  );
}
