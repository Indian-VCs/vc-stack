import Link from 'next/link'
import Script from 'next/script'

type Faq = {
  q: string
  /** Plain-text answer used for FAQPage JSON-LD schema. */
  aPlain: string
  /** Optional rich JSX used for visual rendering — defaults to aPlain. */
  aJsx?: React.ReactNode
}

const FAQS: Faq[] = [
  {
    q: 'What tools do top VC firms use?',
    aPlain:
      'Working venture stacks span about a dozen categories — CRM and dealflow (Affinity, Attio, Notion, Taghash), data and signal-tracking (Tracxn, Crunchbase, Evertrace, Harmonic), AI and research (Claude, ChatGPT, Perplexity), workspace and comms (Notion, Slack, Google Workspace), meetings and transcription (Notion, Granola, Fireflies), portfolio management (Carta, Rundit, AngelList), and the news beat (Inc42, The Ken). The mix shifts sharply with stage: seed funds run lean and informal — half the conversations live on WhatsApp and the CRM is whatever fits — while growth firms run process-led setups with enterprise CRMs, dedicated data layers, and structured LP comms.',
  },
  {
    q: 'What does a starter stack for a new fund look like?',
    aPlain:
      'Most funds under five people get away with five tools. A CRM for dealflow (Affinity, Attio, Notion, or Taghash). A data provider for diligence (Tracxn or Crunchbase). A shared workspace for memos, dashboards, and the firm wiki (Notion or Google Workspace). A meeting and transcription layer (Notion or Granola). And a serious email client so founder threads do not slip (Superhuman or Notion Mail). Everything else — AI copilots, signal-tracking, news feeds, portfolio platforms, fund admin — layers on as the team grows and the stack stops fitting in one head.',
  },
  {
    q: 'What are the AI tools VCs are using?',
    aPlain:
      'AI now sits as a layer across the stack, not a separate beat. Claude leads for long-context reasoning — memo drafting, data-room synthesis, and Skills that package firm SOPs (memo formats, diligence checklists, deck triage) into reusable agents. ChatGPT covers custom GPTs loaded with firm playbooks. Perplexity and Exa handle quick research with citations. Granola and Fireflies turn calls into structured notes that flow into the CRM. Evertrace and Harmonic run the signal-tracking layer — surfacing stealth founders from LinkedIn, GitHub, and registry data weeks before the usual databases catch up. Most firms run two or three of these daily — see the AI and Research categories.',
    aJsx: (
      <>
        AI now sits as a layer across the stack, not a separate beat. Claude
        leads for long-context reasoning — memo drafting, data-room synthesis,
        and Skills that package firm SOPs (memo formats, diligence checklists,
        deck triage) into reusable agents. ChatGPT covers custom GPTs loaded
        with firm playbooks. Perplexity and Exa handle quick research with
        citations. Granola and Fireflies turn calls into structured notes that
        flow into the CRM. Evertrace and Harmonic run the signal-tracking
        layer — surfacing stealth founders from LinkedIn, GitHub, and registry
        data weeks before the usual databases catch up. Most firms run two or
        three of these daily — see the{' '}
        <Link href="/category/ai" className="faq-link">AI</Link>
        {' '}and{' '}
        <Link href="/category/research" className="faq-link">Research</Link>
        {' '}categories.
      </>
    ),
  },
  {
    q: 'How are tools chosen and how often is the list updated?',
    aPlain:
      'Inclusion is editorial, not algorithmic — every tool listed is one that VC firms in our network meaningfully use, tested in production by the team, and benchmarked against alternatives in the same category. The catalog is reviewed on a rolling basis with quarterly editorial sweeps; the "Last reviewed" stamp at the bottom of each category page reflects the most recent pass. For the full picture — research methods, testing process, disclosures — see the methodology.',
    aJsx: (
      <>
        Inclusion is editorial, not algorithmic — every tool listed is one
        that VC firms in our network meaningfully use, tested in production by
        the team, and benchmarked against alternatives in the same category.
        The catalog is reviewed on a rolling basis with quarterly editorial
        sweeps; the &ldquo;Last reviewed&rdquo; stamp at the bottom of each
        category page reflects the most recent pass. For the full picture —
        research methods, testing process, disclosures — see the{' '}
        <Link href="/methodology" className="faq-link">methodology</Link>.
      </>
    ),
  },
  {
    q: "How do I suggest a tool that isn't listed?",
    aPlain:
      'Email support@indianvcs.com with the tool name, the website, and one line on how venture teams use it — or use the Submit a tool form. Include your role (GP, analyst, ops) and the categories where you would place it. Tools that two or more funds in our network already run almost always make it in; pure vendor pitches and "we just launched" submissions generally do not.',
    aJsx: (
      <>
        Email{' '}
        <a href="mailto:support@indianvcs.com" className="faq-link">
          support@indianvcs.com
        </a>{' '}
        with the tool name, the website, and one line on how venture teams use
        it — or use the{' '}
        <Link href="/submit-product" className="faq-link">Submit a tool</Link>
        {' '}form. Include your role (GP, analyst, ops) and the categories
        where you would place it. Tools that two or more funds in our network
        already run almost always make it in; pure vendor pitches and
        &ldquo;we just launched&rdquo; submissions generally do not.
      </>
    ),
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
        text: f.aPlain,
      },
    })),
  }

  return (
    <section className="page" style={{ paddingTop: 12, paddingBottom: 56, borderTop: '1px solid var(--rule)' }}>
      <Script id="home-faq-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(jsonLd)}
      </Script>

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
              <span style={{ flex: 1, minWidth: 0 }}>{f.q}</span>
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
              {f.aJsx ?? f.aPlain}
            </p>
          </details>
        ))}
      </div>

      <style>{`
        .faq-grid details summary::-webkit-details-marker { display: none; }
        .faq-grid details[open] summary { color: var(--red); }
        .faq-link {
          color: var(--red);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .faq-link:hover { color: var(--red-dark); }
      `}</style>
    </section>
  )
}
