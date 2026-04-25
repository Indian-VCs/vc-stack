import Link from 'next/link'
import IndianVCsLogo from '@/components/ui/IndianVCsLogo'

const SOCIAL: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/indianvcs',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/IndianVCs',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.27L22.86 21.75h-6.68l-5.23-6.84-5.99 6.84H1.65l7.74-8.85L1.14 2.25h6.84l4.73 6.26 5.53-6.26zm-1.16 17.52h1.83L7.03 4.14H5.07l12 15.63z"/>
      </svg>
    ),
  },
]

const LEGAL: { label: string; href: string }[] = [
  { label: 'Privacy', href: 'https://indianvcs.com/privacy-policy' },
  { label: 'Terms', href: 'https://indianvcs.com/terms-of-service' },
  { label: 'Cookies', href: 'https://indianvcs.com/cookies-policy' },
  { label: 'Disclaimer', href: 'https://indianvcs.com/disclaimer' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page site-footer__row">
        <a
          href="https://www.indianvcs.com"
          aria-label="Indian VCs — back to indianvcs.com"
          className="site-footer__brand"
        >
          <IndianVCsLogo height={18} />
        </a>

        <nav aria-label="Footer" className="site-footer__links">
          <Link href="/contribute" className="ftr-link">Contribute</Link>
          {LEGAL.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ftr-link"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__socials">
          <a
            href="mailto:contact@indianvcs.com"
            aria-label="Email contact@indianvcs.com"
            className="ftr-social"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="ftr-social"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--paper);
          color: var(--ink);
          border-top: 1px solid var(--rule);
          margin-top: 48px;
        }
        .site-footer__row {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .site-footer__brand {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          line-height: 1;
        }
        .site-footer__links {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }
        .site-footer__socials {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ftr-link {
          /* WCAG 2.5.5 AAA — 44px hit area without altering visual weight. */
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 8px 0;
          color: var(--ink-muted);
          text-decoration: none;
          transition: color 160ms ease;
        }
        .ftr-link:hover { color: var(--ink); }

        .ftr-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--ink-muted);
          text-decoration: none;
          border-radius: 4px;
          transition: color 160ms ease, background 160ms ease;
        }
        .ftr-social:hover {
          color: var(--ink);
          background: var(--rule);
        }

        @media (max-width: 900px) {
          .site-footer__row { gap: 14px; padding: 14px 24px; }
          .site-footer__links { gap: 14px; }
        }

        @media (max-width: 640px) {
          .site-footer__row {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 14px;
            padding: 20px 24px 14px;
          }
          .site-footer__links {
            justify-content: center;
            gap: 12px 16px;
          }
          .site-footer__socials { gap: 4px; }
          .ftr-social { width: 44px; height: 44px; }
        }

        @media (max-width: 380px) {
          .site-footer__links { letter-spacing: 0.10em; gap: 10px 14px; }
        }
      `}</style>
    </footer>
  )
}
