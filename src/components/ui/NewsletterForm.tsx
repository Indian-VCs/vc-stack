'use client'

export default function NewsletterForm() {
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || ''
  const isLive = Boolean(substackUrl.trim())

  if (!isLive) {
    return (
      <p
        style={{
          fontFamily: 'var(--body)',
          fontSize: 'var(--fs-body)',
          color: 'var(--ink)',
          marginTop: 12,
          textWrap: 'pretty',
        }}
        role="status"
      >
        <strong>Launching soon.</strong> Weekly dispatch starting in the next few weeks.
      </p>
    )
  }

  return (
    <a
      href={substackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn--primary nf-subscribe"
    >
      Subscribe on Substack
      <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>↗</span>
      <style jsx>{`
        .nf-subscribe {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .nf-subscribe:active { transform: scale(0.96); }
      `}</style>
    </a>
  )
}
