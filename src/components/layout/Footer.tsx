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

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--paper)',
        color: 'var(--ink)',
        borderTop: '1px solid var(--rule)',
        marginTop: 48,
      }}
    >
      <div
        className="page"
        style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <a
          href="https://www.indianvcs.com"
          aria-label="Indian VCs — back to indianvcs.com"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            lineHeight: 1,
          }}
        >
          <IndianVCsLogo height={18} />
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
          }}
        >
          <Link href="/submit-product" className="ftr-link">Submit a Tool</Link>
          <Link href="/privacy-policy" className="ftr-link">Privacy</Link>
          <Link href="/terms" className="ftr-link">Terms</Link>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
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
        .ftr-link {
          color: var(--ink-muted);
          text-decoration: none;
          transition: color 160ms ease;
        }
        .ftr-link:hover { color: var(--ink); }

        .ftr-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          color: var(--ink-muted);
          text-decoration: none;
          transition: color 160ms ease;
        }
        .ftr-social:hover { color: var(--ink); }
      `}</style>
    </footer>
  )
}
