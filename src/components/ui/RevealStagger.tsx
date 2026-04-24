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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // SSR / older browsers — render visible immediately, no flash
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    // Respect reduced motion — skip the observer entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
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
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div
      ref={ref}
      className={`reveal-stagger ${visible ? 'is-in' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
