const FAQS: { q: string; a: string }[] = [
  {
    q: 'Which tools should a new fund start with?',
    a: 'Most funds under five people get away with five tools: a CRM for dealflow (Affinity, Attio, or Taghash), a data provider for diligence (Tracxn or Crunchbase), a shared workspace (Notion or Google Workspace), a meeting + transcription layer (Granola or Fireflies), and a portfolio tracker once you have more than ten positions (Carta, Rundit, or AngelList). Everything else — AI copilots, news feeds, fund admin — layers on as the team grows and the stack stops fitting in one head.',
  },
  {
    q: 'How are the tools chosen?',
    a: 'Every entry is researched from the tool\'s own website and cross-checked against what Indian VCs actually report using in 2026. Nothing is paid placement — there are no sponsored slots, affiliate links, or "featured for a fee" tiers. If a tool appears, it\'s because venture teams here are meaningfully running on it, not because a vendor wrote a cheque. The criteria tilt toward tools used daily by investment teams, ops, or portfolio, rather than one-off experiments.',
  },
  {
    q: 'What makes this India-first?',
    a: 'The global VC catalogues optimise for Silicon Valley workflows, which miss half the stack an Indian fund runs. This list weights the tools that actually matter here: Taghash and LetsVenture for cap-table and syndicate mechanics, Inc42 and The Ken for the news beat, AngelList India for SPVs, Tracxn and Private Circle for local dealflow data, plus the regional admin and compliance layer no global directory covers. Global defaults (Affinity, Notion, Slack, ChatGPT) still sit alongside — because they\'re the global defaults here too.',
  },
  {
    q: 'How often is the list updated?',
    a: 'The catalog is reviewed quarterly for description freshness and new additions happen continuously between. The stack meaningfully shifts once or twice a year — a new AI research tool breaks into daily use, a portfolio platform wins mindshare, a category consolidates — and those shifts land here as they happen. The underlying data lives in a single versioned file on GitHub, so every change is traceable and dated.',
  },
  {
    q: 'How do I suggest a tool that isn\'t listed?',
    a: 'Email hello@indianvcs.com with the tool name, the website, and one line on how Indian venture teams use it. Include your role (GP, analyst, ops) — that context helps decide which category it fits. Tools that are genuinely in use at two or more Indian funds almost always make it in; vendor pitches and "we just launched" submissions generally do not.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes — free to browse, no logins, no email gate, no paywall. The Dispatch (our weekly newsletter) is also free. The project is run by DealQuick Labs as a public good for the Indian VC community, not a lead-gen funnel, so nothing you do on this site is tracked beyond standard anonymous analytics.',
  },
]

export default function FaqSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  return (
    <section className="page" style={{ padding: '12px 24px 56px', borderTop: '1px solid var(--rule)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: 24,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-hero)',
            color: 'var(--ink)',
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Frequently Asked
        </h2>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: 'var(--fs-body)',
            color: 'var(--ink-muted)',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          The questions we hear most from funds looking at this list.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 0,
          borderTop: '1px solid var(--rule)',
        }}
        className="faq-grid"
      >
        {FAQS.map((f, i) => (
          <details
            key={i}
            style={{
              borderBottom: '1px solid var(--rule)',
              padding: '18px 2px',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontFamily: 'var(--serif)',
                fontSize: 'var(--fs-card)',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.35,
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 16,
              }}
            >
              <span>{f.q}</span>
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--fs-tag)',
                  color: 'var(--ink-muted)',
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </summary>
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: 'var(--fs-body)',
                color: 'var(--ink-light)',
                lineHeight: 1.65,
                marginTop: 12,
                maxWidth: 900,
              }}
            >
              {f.a}
            </p>
          </details>
        ))}
      </div>

      <style>{`
        .faq-grid details summary::-webkit-details-marker { display: none; }
        .faq-grid details[open] summary { color: var(--red); }
      `}</style>
    </section>
  )
}
