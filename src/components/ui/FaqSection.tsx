import Script from 'next/script'

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is VC Stack?',
    a: 'The definitive visual market map of the tools Indian venture capital firms actually use — 119 tools across 17 categories, researched per-tool from each company\'s own website. Browse by category, search instantly with ⌘K, or start with the market map for a single-screen overview.',
  },
  {
    q: 'Who built this?',
    a: 'Curated by Indian VCs, built by DealQuick Labs Private Limited. Free to use, not a sponsored directory. Tools are included because venture teams actually run on them, not because they paid to be listed.',
  },
  {
    q: 'How is this different from vcstack.io?',
    a: 'vcstack.io is the original global catalogue. VC Stack is India-first: the content, tone, and examples centre on how Indian funds — from solo GPs to institutional firms — actually assemble their stack today. Tools like Taghash, AngelList India, LetsVenture, Inc42, The Ken, Private Circle, and Tracxn appear alongside the global defaults because they are the global defaults here.',
  },
  {
    q: 'Can I submit a tool?',
    a: 'Yes. A submissions page is queued for v2. In the meantime, email hello@indianvcs.com with the tool, the website, and one line on how venture teams use it.',
  },
  {
    q: 'How often is the catalog updated?',
    a: 'The core catalogue refreshes when the stack meaningfully moves. Expect a quarterly refresh of descriptions, with new tools added continuously between. The underlying data lives in a single versioned file, so every change is traceable on GitHub.',
  },
  {
    q: 'Is it free?',
    a: 'Free to browse. No paywalls, no logins, no email gate. You are not the product.',
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
      <Script
        id="home-faq-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
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
          Six things people ask before they start browsing.
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
                lineHeight: 1.6,
                marginTop: 12,
                maxWidth: 720,
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
