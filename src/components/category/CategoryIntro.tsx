interface Props {
  intro?: string | null
}

export default function CategoryIntro({ intro }: Props) {
  if (!intro) return null

  const paragraphs = intro.trim().split(/\n\n+/)

  return (
    <section
      style={{
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
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
          color: 'var(--ink-muted)',
          marginBottom: 14,
        }}
      >
        The Brief
      </div>
      <div
        style={{
          fontFamily: 'var(--body)',
          fontSize: '1.05rem',
          lineHeight: 1.65,
          color: 'var(--ink)',
          maxWidth: 760,
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: i === paragraphs.length - 1 ? 0 : 14 }}>
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}
