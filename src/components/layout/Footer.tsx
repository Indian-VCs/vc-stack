import Link from 'next/link'

type FooterLink = { label: string; href: string; external?: boolean }

const COLS: Record<string, FooterLink[]> = {
  'The Paper': [
    { label: 'Home',           href: '/' },
    { label: 'All Categories', href: '/all-categories' },
    { label: 'Market Map',     href: '/market-map' },
    { label: 'VC HUB',           href: 'https://hub.indianvcs.com/', external: true },
    { label: 'Newsletter',     href: 'https://hub.indianvcs.com/newsletter', external: true },
  ],
  Masthead: [
    { label: 'About',   href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy-policy' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--paper)',
        borderTop: '3px double var(--ink)',
        marginTop: 64,
      }}
    >
      <div className="page" style={{ padding: '48px 24px 24px' }}>
        {/* Brand mini-masthead */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 900,
              fontSize: '2rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              lineHeight: 1,
            }}
          >
            IndianVCs
          </div>
          <p
            style={{
              fontFamily: 'var(--body)',
              fontSize: 'var(--fs-body)',
              color: 'var(--ink-muted)',
              marginTop: 12,
              fontStyle: 'italic',
            }}
          >
            The venture capital tool stack, in print.
          </p>
        </div>

        {/* Link columns */}
        <div
          className="grid grid-cols-2 gap-8"
          style={{
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
            padding: '32px 0',
          }}
        >
          {Object.entries(COLS).map(([section, links]) => (
            <div key={section}>
              <div className="section-header" style={{ marginBottom: 12, paddingBottom: 4 }}>
                {section}
              </div>
              <ul style={{ listStyle: 'none' }}>
                {links.map((link) => {
                  const style = {
                    fontFamily: 'var(--body)',
                    fontSize: 'var(--fs-body)',
                    color: 'var(--ink-light)',
                    textDecoration: 'none',
                  } as const
                  return (
                    <li key={link.label} style={{ padding: '4px 0' }}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" style={style}>
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link href={link.href} style={style}>{link.label}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontFamily: 'var(--mono)',
            fontSize: 'var(--fs-tag)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--ink-muted)',
          }}
        >
          <span>© {year} IndianVCs</span>
          <span>Printed in India · Est. 2026</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
