'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** rootMargin for the IntersectionObserver. Defaults to a slight upward bias
   *  so the reveal fires just before the grid enters the viewport. */
  rootMargin?: string
}

/**
 * Wraps a grid/list and fades children in with a staggered cascade once
 * the container enters the viewport. Single IntersectionObserver per use
 * — children stagger via CSS (.reveal-stagger rules in globals.css).
 *
 * Drop-in replacement for a plain wrapper: pass existing grid classNames
 * through and they'll compose with the reveal styles.
 */
export default function RevealStagger({
  children,
  className = '',
  style,
  rootMargin = '0px 0px -10%',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // `primed` hides children with opacity:0 so the reveal-in animation has
  // somewhere to animate from. We set it on mount (client-only), so SSR
  // renders fully visible — no "invisible grid" if JS fails or the
  // observer never fires.
  const [primed, setPrimed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No observer support or reduced motion — render visible, never prime.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }
    // Prime the hidden state for the animation entry.
    setPrimed(true)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin, threshold: 0.1 },
    )
    io.observe(el)
    // Safety net: reveal unconditionally after 1500ms so no grid ever
    // stays hidden because the observer didn't fire.
    const fallback = window.setTimeout(() => setVisible(true), 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [rootMargin])

  const stateClass = [primed ? 'is-primed' : '', visible ? 'is-in' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className={`reveal-stagger ${stateClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
