/**
 * Mobile-only homepage Market Map preview.
 *
 * Renders the same 5-column desktop landscape layout as the full
 * MarketMapPoster — same category cards, same tool pills with logos —
 * but in a fixed-width 1100px inner that's scaled down via a container-
 * query transform to fit the phone screen. Static, no IntersectionObserver,
 * no scroll-linked transform, no JS. Single tap target → /market-map.
 */
import Link from 'next/link'
import type { Category, Tool } from '@/lib/types'

interface Props {
  tools: Tool[]
  categories: Category[]
}

const LEFT_COLS: string[][] = [
  ['ai', 'mailing', 'calendar', 'admin-ops', 'productivity'],
  ['crm', 'research', 'browser'],
  ['data', 'communication', 'portfolio-management', 'vibe-coding'],
]
const RIGHT_TOP_COLS: string[][] = [
  ['transcription', 'voice-to-text'],
  ['news'],
]
const RIGHT_BOTTOM_STACK: string[] = ['automation', 'other-tools']

const WIDE_PILL_CATS: Record<string, number> = {
  'automation': 3,
  'other-tools': 3,
}

const FALLBACK_SHADES = [
  '#1a1410', '#2f271f', '#3a322a', '#524a3c',
  '#5a4731', '#6b5a3f', '#a41204', '#d21905',
]

function fallbackShade(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return FALLBACK_SHADES[Math.abs(h) % FALLBACK_SHADES.length]
}

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length === 1
    ? w[0].substring(0, 2).toUpperCase()
    : (w[0][0] + w[1][0]).toUpperCase()
}

function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function ToolPill({ t }: { t: Tool }) {
  const domain = domainOf(t.websiteUrl)
  const src = t.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '')
  return (
    <span className="mmp-t">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="mmp-t-fb" style={{ background: fallbackShade(t.name) }}>
          {initials(t.name)}
        </span>
      )}
      <span>{t.name}</span>
    </span>
  )
}

function CatCard({
  name,
  tools,
  pillCols = 2,
}: {
  name: string
  tools: Tool[]
  pillCols?: number
}) {
  return (
    <div className="mmp-card">
      <div className="mmp-card-head">
        <span className="mmp-card-name">{name}</span>
      </div>
      <div
        className="mmp-tools"
        style={{ ['--mmp-pill-cols' as string]: pillCols }}
      >
        {tools.map((t) => <ToolPill key={t.id} t={t} />)}
      </div>
    </div>
  )
}

export default function MarketMapPosterMini({ tools, categories }: Props) {
  const bySlug: Record<string, Tool[]> = {}
  const slugToName: Record<string, string> = {}
  for (const c of categories) slugToName[c.slug] = c.name
  for (const t of tools) {
    const all = [t.category?.slug, ...(t.extraCategorySlugs ?? [])].filter(Boolean) as string[]
    for (const slug of all) {
      if (!bySlug[slug]) bySlug[slug] = []
      bySlug[slug].push(t)
    }
  }
  Object.values(bySlug).forEach((list) =>
    list.sort((a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
    ),
  )

  const totalAppearances = Object.values(bySlug).reduce((n, l) => n + l.length, 0)
  const totalCats = Object.keys(bySlug).length

  const renderCard = (slug: string) => {
    const list = bySlug[slug]
    if (!list || list.length === 0) return null
    return (
      <CatCard
        key={slug}
        name={slugToName[slug] || slug}
        tools={list}
        pillCols={WIDE_PILL_CATS[slug] ?? 2}
      />
    )
  }

  return (
    <Link href="/market-map" className="mmp-link" aria-label="Open the full market map">
      <div className="mmp-frame">
        <div className="mmp-inner">
          <div className="mmp-counter">
            {totalAppearances} tools · {totalCats} categories
          </div>
          <div className="mmp-grid">
            {LEFT_COLS.map((catList, idx) => (
              <div key={idx} className="mmp-col">
                {catList.map((slug) => renderCard(slug))}
              </div>
            ))}
            <div className="mmp-right">
              <div className="mmp-right-top">
                {RIGHT_TOP_COLS.map((catList, idx) => (
                  <div key={idx} className="mmp-col">
                    {catList.map((slug) => renderCard(slug))}
                  </div>
                ))}
              </div>
              {RIGHT_BOTTOM_STACK.map((slug) => renderCard(slug))}
            </div>
          </div>
        </div>
        <div className="mmp-fade" aria-hidden="true" />
        <div className="mmp-cta">Open the map →</div>
      </div>

      <style>{`
        .mmp-link {
          display: block;
          text-decoration: none;
          color: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .mmp-frame {
          position: relative;
          background: #fbe2d6;
          border: 1px solid var(--ink);
          overflow: hidden;
          /* Container query unit context for the scale calc below. */
          container-type: inline-size;
          /* Visible portion of the 1100px-wide inner. Tuned so the
             tallest left column shows about 4 of its 5 cards before
             the gradient fade begins masking the bottom edge. */
          aspect-ratio: 1100 / 760;
        }
        .mmp-inner {
          position: absolute;
          inset: 0;
          width: 1100px;
          padding: 14px;
          transform-origin: top left;
          /* Scale the 1100px-wide inner to whatever the container width is.
             Modern CSS calc resolves length/length to a unitless number. */
          transform: scale(calc(100cqw / 1100px));
          pointer-events: none;
        }
        .mmp-fade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 90px;
          background: linear-gradient(
            to bottom,
            rgba(251, 226, 214, 0) 0%,
            rgba(251, 226, 214, 0.92) 70%,
            rgba(251, 226, 214, 1) 100%
          );
          pointer-events: none;
        }
        .mmp-cta {
          position: absolute;
          right: 12px;
          bottom: 12px;
          font-family: var(--mono);
          font-size: var(--fs-tag);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          padding: 9px 14px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .mmp-link:active .mmp-frame { background: #f7d6c5; }

        /* Inner layout — mirrors the desktop MarketMapPoster grid block.
           All sizing is at the natural 1100px scale; the outer transform
           shrinks everything proportionally. */
        .mmp-counter {
          display: flex;
          justify-content: flex-end;
          padding: 0 0 10px;
          font-family: var(--mono);
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .mmp-grid {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .mmp-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .mmp-right {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .mmp-right-top {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .mmp-card {
          background: var(--paper);
          border: 1px solid var(--ink);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mmp-card-head {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          padding: 4px 10px;
        }
        .mmp-card-name {
          font-family: var(--mono);
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
        }
        .mmp-tools {
          display: grid;
          grid-template-columns: repeat(var(--mmp-pill-cols, 2), minmax(0, 1fr));
          gap: 4px 6px;
          padding: 7px 8px 9px;
          background: var(--paper-alt);
        }
        .mmp-t {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--rule);
          border-radius: 4px;
          padding: 4px 6px;
          background: var(--paper);
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
          color: inherit;
        }
        .mmp-t img,
        .mmp-t-fb {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          object-fit: contain;
          flex-shrink: 0;
          background: var(--surface-logo);
        }
        .mmp-t-fb {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: var(--paper);
          text-transform: uppercase;
        }
        .mmp-t span {
          font-family: var(--body);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </Link>
  )
}
