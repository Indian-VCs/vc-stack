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
      className="btn btn--primary"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
      }}
    >
      Subscribe on Substack
      <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>↗</span>
    </a>
  )
}
