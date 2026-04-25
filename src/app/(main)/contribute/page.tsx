import type { Metadata } from 'next'
import Link from 'next/link'
import { publicUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Two ways to add to the VC Stack — submit a tool the catalog is missing, or share the stack your firm actually runs on.',
  alternates: { canonical: publicUrl('/contribute') },
}

interface PathCard {
  href: string
  kicker: string
  title: string
  blurb: string
  cta: string
}

const PATHS: PathCard[] = [
  {
    href: '/submit-product',
    kicker: 'For everyone',
    title: 'Submit a tool',
    blurb:
      'Found a tool the catalog is missing? File it with the desk and editors review new entries within 48 hours.',
    cta: 'File a submission →',
  },
  {
    href: '/contribute/stack',
    kicker: 'For VC firms',
    title: "Share your firm's stack",
    blurb:
      'Tell us which tools your firm actually runs on — pick from the catalog, add a line on how you use each one. The best submissions become published firm-profile pages.',
    cta: 'Share your stack →',
  },
]

export default function ContributePage() {
  return (
    <div className="page" style={{ padding: '24px 0 64px', maxWidth: 880 }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">·</span>
        <span style={{ color: 'var(--ink)' }}>Contribute</span>
      </div>

      <header
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          padding: '24px 0',
          marginBottom: 32,
          textAlign: 'center',
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
          Submissions
        </div>
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 900,
            fontSize: 'var(--fs-name)',
            color: 'var(--ink)',
            lineHeight: 1.05,
          }}
        >
          Contribute to the VC Stack
        </h1>
        <p
          style={{
            fontFamily: 'var(--body)',
            fontSize: '1.05rem',
            color: 'var(--ink-light)',
            marginTop: 14,
            fontStyle: 'italic',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Two ways in. Pick the one that fits.
        </p>
      </header>

      <div className="contrib-grid">
        {PATHS.map((p) => (
          <Link key={p.href} href={p.href} className="contrib-card">
            <div className="contrib-kicker">{p.kicker}</div>
            <h2 className="contrib-title">{p.title}</h2>
            <p className="contrib-blurb">{p.blurb}</p>
            <span className="contrib-cta">{p.cta}</span>
          </Link>
        ))}
      </div>

      <p
        style={{
          marginTop: 28,
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--ink-muted)',
        }}
      >
        Editors&apos; discretion applies · Reviewed within 48 hours
      </p>

      <style>{`
        .contrib-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .contrib-card {
          display: flex;
          flex-direction: column;
          padding: 28px 24px 32px;
          border: 1px solid var(--rule);
          margin-left: -1px;
          margin-top: -1px;
          background: var(--paper);
          color: var(--ink);
          text-decoration: none;
          min-height: 220px;
          transition: background var(--dur-fast), border-color var(--dur-fast);
        }
        .contrib-card:hover {
          background: var(--paper-alt, var(--paper));
          border-color: var(--ink);
          z-index: 1;
          position: relative;
        }
        .contrib-card:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: -2px;
          z-index: 2;
          position: relative;
        }
        .contrib-kicker {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--red);
          margin-bottom: 10px;
        }
        .contrib-title {
          font-family: var(--serif);
          font-weight: 900;
          font-size: 1.6rem;
          line-height: 1.1;
          color: var(--ink);
          margin: 0 0 12px;
          letter-spacing: -0.005em;
        }
        .contrib-blurb {
          font-family: var(--body);
          font-size: 1rem;
          line-height: 1.55;
          color: var(--ink-light);
          margin: 0 0 18px;
          flex: 1;
        }
        .contrib-cta {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--ink);
        }
        @media (max-width: 720px) {
          .contrib-grid { grid-template-columns: 1fr; }
          .contrib-card { min-height: 0; }
        }
      `}</style>
    </div>
  )
}
