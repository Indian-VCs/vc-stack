import Link from 'next/link'

export default function NotFoundContent() {
  return (
    <div
      className="page"
      style={{
        padding: '64px 24px 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 'var(--fs-tag)',
          textTransform: 'uppercase',
          letterSpacing: '0.28em',
          color: 'var(--red)',
          marginBottom: 20,
        }}
      >
        404 · Page Not Found
      </div>

      <h1
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 900,
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          color: 'var(--ink)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 18px',
          maxWidth: 720,
          textWrap: 'balance',
        }}
      >
        This edition has gone to press without the page you requested.
      </h1>

      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: 'var(--ink-light)',
          lineHeight: 1.5,
          maxWidth: 560,
          margin: '0 0 32px',
        }}
      >
        The link may be misspelled, the tool may have moved, or the section may
        never have run. Try the archive or browse back to the front page.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link href="/" className="btn btn--primary">
          Back to Home
        </Link>
        <Link href="/all-categories" className="btn">
          Browse Categories
        </Link>
        <Link href="/search" className="btn btn--ghost">
          Search the Archive
        </Link>
      </div>

      <div className="nf-note">
        Editor’s Note · if you followed a broken link from elsewhere, let us
        know at the{' '}
        <Link href="/submit-product" className="nf-note-link">
          submissions desk
        </Link>
        .
      </div>

      <style>{`
        .nf-note {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          width: 100%;
          max-width: 560px;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--ink-muted);
          line-height: 1.6;
        }
        .nf-note-link {
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--rule);
          transition: border-color var(--dur-fast), color var(--dur-fast);
        }
        .nf-note-link:hover {
          color: var(--red);
          border-color: var(--red);
        }
        .nf-note-link:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
