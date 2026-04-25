'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

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

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reveal = () => el.classList.add('is-in')

    // No observer support, reduced motion, or narrow viewport — render
    // visible immediately, never prime. On mobile the stagger reads as
    // jank rather than polish, and skipping it shaves both JS work and
    // the perceived "empty section" flash on first paint.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 640px)').matches
    ) {
      reveal()
      return
    }
    // Prime the hidden state for the animation entry.
    el.classList.add('is-primed')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal()
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
    const fallback = window.setTimeout(reveal, 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [rootMargin])

  return (
    <div
      ref={ref}
      className={`reveal-stagger ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
