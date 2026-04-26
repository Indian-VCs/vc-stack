import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { LAST_REVIEWED, publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Methodology — How VC Stack is researched and curated',
  description:
    'How tools are picked, tested, and written about for the Indian VCs catalog. Built from years of operator experience, surveys across funds, in-person events, hands-on benchmarking, and ongoing community feedback.',
  alternates: { canonical: publicUrl('/methodology') },
  openGraph: {
    title: 'Methodology — How VC Stack is researched and curated',
    description:
      'How tools are picked, tested, and written about for the Indian VCs catalog.',
    url: publicUrl('/methodology'),
    siteName: 'Indian VCs',
    type: 'article',
    locale: 'en_IN',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${publicUrl('/methodology')}#page`,
  url: publicUrl('/methodology'),
  name: 'Methodology — How VC Stack is researched and curated',
  description:
    'How tools are picked, tested, and written about for the Indian VCs catalog.',
  isPartOf: { '@id': 'https://www.indianvcs.com/#website' },
  publisher: { '@id': 'https://www.indianvcs.com/#organization' },
  dateModified: '2026-04-26',
}

export default function MethodologyPage() {
  return (
    <div className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <Script
        id="methodology-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>

      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Methodology</span>
      </div>

      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '24px 0',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            color: 'var(--red)',
            marginBottom: 10,
          }}
        >
          Editorial Standards
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'clamp(1.7rem, 6vw, 2.6rem)',
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          Methodology
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.1rem',
            color: 'var(--ink-light)',
            marginTop: 14,
            maxWidth: 760,
            lineHeight: 1.6,
          }}
        >
          How VC Stack is researched, tested, and curated. Every tool in the
          catalog is the product of operator experience, structured surveys
          across Indian VC firms, hands-on benchmarking, and continuous feedback
          from the people who use these tools every day.
        </p>
      </header>

      <article
        style={{
          maxWidth: 780,
          fontFamily: 'var(--body)',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          color: 'var(--ink)',
        }}
      >
        <Section title="Where the knowledge comes from">
          <p>
            Indian VCs is built and curated by people who have spent years
            inside venture firms — analysts, principals, operators who later
            became investors, founders who joined funds. The team that runs
            this catalog works in VC. The community that shapes it is venture
            capital. The shortlist of tools you see on each page is not a
            scrape of the internet; it is the working stack of people who do
            this for a living.
          </p>
          <p>
            That base is widened through surveys conducted across Indian VC
            firms, structured one-on-one conversations with investment teams,
            and notes shared at in-person events and roundtables hosted under
            the Indian VCs banner. Funds compare their stacks. Operators
            share what broke and what stuck. The catalog is the long-running
            record of those conversations, written down once so the next firm
            does not have to repeat them.
          </p>
        </Section>

        <Section title="How tools are tested">
          <p>
            Every tool listed has been used, watched in production, or
            stress-tested against the workflow it claims to handle. The
            editorial team runs internal benchmarks where multiple tools are
            asked to perform the same task — a CRM lookup, a deck redaction,
            a data pull, a meeting transcription — and the outputs are scored
            against each other. The benchmarks are run repeatedly as products
            ship updates, so the rankings reflect today, not the version of
            the tool that existed two years ago.
          </p>
          <p>
            Where a tool is borderline, the team works directly with the
            company building it — flagging gaps, suggesting features, and
            comparing notes with other VC firms using the same product.
            Several tools in the catalog have shipped changes that came out
            of those conversations. That working relationship is also why
            some tools have been removed: a product that used to fit the
            workflow no longer does, and the catalog reflects that.
          </p>
        </Section>

        <Section title="How entries are written">
          <p>
            Each tool description follows a consistent editorial standard.
            Around eighty percent of the copy explains what the tool actually
            is in plain language a non-VC reader can follow. The remaining
            twenty percent — usually the closing sentence — explains how
            Indian VC firms specifically use it: for partner discussion, for
            warm-intro tracking, for diligence Q&amp;A, for portfolio comms.
          </p>
          <p>
            Descriptions are kept tight (forty to seventy words), use cases
            are kept verb-first, and the voice stays calm. Marketing
            vocabulary — the kind of words that try to make a tool sound
            bigger than it is — is excluded by the editorial style guide.
            What remains is something closer to a beat reporter&apos;s notes
            than a vendor pitch.
          </p>
        </Section>

        <Section title="How the catalog stays current">
          <p>
            Tools change. Pricing changes. Companies get acquired, pivot,
            or quietly stop being good. The catalog is reviewed on a rolling
            basis — every category receives an editorial sweep at least once
            a quarter, and the &quot;Last reviewed&quot; stamp at the bottom
            of each category page is updated when that pass happens.
            Submissions from the community feed into the next sweep through
            the{' '}
            <Link
              href="/submit-product"
              style={{ color: 'var(--red)', textDecoration: 'underline' }}
            >
              Submit a tool
            </Link>{' '}
            and{' '}
            <Link
              href="/contribute/stack"
              style={{ color: 'var(--red)', textDecoration: 'underline' }}
            >
              Share your stack
            </Link>{' '}
            forms.
          </p>
          <p>
            Categories are also re-shaped over time. A beat that began as a
            single category sometimes splits when the underlying landscape
            grows — the way &quot;AI&quot; and &quot;Vibe Coding&quot; now
            sit next to each other rather than inside each other. That
            structural change is editorial, not algorithmic, and it is
            documented on the relevant category pages.
          </p>
        </Section>

        <Section title="Disclosures">
          <p>
            Some tools in the catalog have commercial relationships with
            Indian VCs — paid placements, sponsored slots, or affiliate
            arrangements. Outbound links to tool websites may, in some
            cases, be affiliate links.
          </p>
          <p>
            Editorial inclusion in the catalog is independent of those
            relationships. A tool does not appear in VC Stack because
            someone paid; it appears because Indian VC firms actually use
            it, and the editorial team has tested it. A commercial
            relationship may affect visibility — featured slots, hero
            rotations, the order tools surface in — not whether a tool is
            included or how it is described.
          </p>
          <p>
            The catalog is also not a feature-comparison spreadsheet. There
            are good public sources for that. What the catalog adds is
            opinion — tilted toward what works for Indian funds, written by
            people who have run those workflows themselves.
          </p>
          <p>
            VC Stack is published in the spirit of an open, shared
            resource — best-effort knowledge from the team and the wider
            Indian VCs community, written down so others do not have to
            start from scratch. It is not investment, legal, tax, or
            procurement advice. The catalog reflects opinions and may carry
            biases — editorial, regional, or otherwise. Decisions about
            which tools to buy, deploy, or rely on remain yours; Indian VCs
            and DealQuick Labs Private Limited accept no liability for
            outcomes that follow from those decisions.
          </p>
        </Section>

        <Section title="Who maintains it">
          <p>
            VC Stack is owned and edited by{' '}
            <a
              href="https://www.indianvcs.com"
              style={{ color: 'var(--red)', textDecoration: 'underline' }}
            >
              Indian VCs
            </a>{' '}
            (DealQuick Labs Private Limited). Editorial inputs come from the
            Indian VCs community of investors, the team&apos;s own VC
            experience, and ongoing dialogue with portfolio operators and
            tool builders. Corrections, additions, and disagreements are
            welcome — the email is{' '}
            <a
              href="mailto:support@indianvcs.com"
              style={{ color: 'var(--red)', textDecoration: 'underline' }}
            >
              support@indianvcs.com
            </a>
            .
          </p>
        </Section>
      </article>

      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: '1px solid var(--rule)',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--ink-muted)',
        }}
      >
        Last reviewed · {LAST_REVIEWED}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 700,
          fontSize: '1.4rem',
          color: 'var(--ink)',
          marginBottom: 14,
          letterSpacing: '-0.005em',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'grid', gap: 14 }}>{children}</div>
    </section>
  )
}
