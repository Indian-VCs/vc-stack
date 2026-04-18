'use client'

export default function HeroNewsletterCard() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || ''
  const isLive = Boolean(substackUrl.trim())

  return (
    <div className="hnc">
      {/* Row 1 — header */}
      <div className="hnc-header">
        <span className="hnc-header-label">The Dispatch</span>
        <span className="hnc-header-meta">Weekly · Free</span>
      </div>

      {/* Row 2 — body */}
      <div className="hnc-body">
        <h3 className="hnc-title">
          A weekly reading list for the Indian venture desk.
        </h3>
        <p className="hnc-sub">
          Opinionated takes on the tools Indian VCs actually use — delivered Monday mornings.
        </p>

        {isLive ? (
          <a
            href={substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hnc-cta"
          >
            Subscribe on Substack
            <span aria-hidden="true" className="hnc-arrow">↗</span>
          </a>
        ) : (
          <div className="hnc-pending" role="status">
            <strong>Launching soon.</strong> Weekly dispatch starting in the next few weeks.
          </div>
        )}

        <p className="hnc-trust">
          Written for Indian VCs. Unsubscribe anytime.
        </p>
      </div>

      <style jsx>{`
        .hnc {
          display: flex;
          flex-direction: column;
          background: var(--paper);
          border: 1px solid var(--ink);
          overflow: hidden;
          min-width: 0;
          color: var(--ink);
          height: 340px;
        }
        @media (max-width: 859px) {
          .hnc { height: auto; min-height: 300px; }
        }

        /* ROW 1 — header */
        .hnc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: var(--ink);
          color: var(--paper);
          border-bottom: 1px solid var(--ink);
          flex: 0 0 auto;
        }
        .hnc-header-label {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .hnc-header-meta {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.7;
        }

        /* ROW 2 — body */
        .hnc-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 22px 20px;
          flex: 1;
          min-height: 0;
        }
        .hnc-title {
          font-family: var(--serif);
          font-weight: 900;
          font-size: clamp(1.3rem, 1.9vw, 1.55rem);
          color: var(--ink);
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .hnc-sub {
          font-family: var(--body);
          font-size: 0.95rem;
          color: var(--ink-light);
          line-height: 1.5;
          margin: 0;
        }

        .hnc-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          align-self: flex-start;
          font-family: var(--mono);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--paper);
          background: var(--ink);
          border: 1px solid var(--ink);
          padding: 12px 18px;
          font-weight: 600;
          text-decoration: none;
          transition: background 180ms ease, border-color 180ms ease;
        }
        .hnc-cta:hover {
          background: var(--red);
          border-color: var(--red);
        }
        .hnc-arrow {
          font-size: 0.95rem;
          transition: transform 180ms ease;
        }
        .hnc-cta:hover .hnc-arrow {
          transform: translate(2px, -2px);
        }

        .hnc-pending {
          font-family: var(--body);
          font-size: 0.95rem;
          color: var(--ink);
          line-height: 1.5;
          padding: 10px 12px;
          border: 1px solid var(--rule);
          background: var(--paper-alt);
          margin-top: 2px;
        }

        .hnc-trust {
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin: auto 0 0;
        }
      `}</style>
    </div>
  )
}
