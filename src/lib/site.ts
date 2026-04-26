export const SITE_ORIGIN = 'https://www.indianvcs.com'
const BASE_PATH = '/vc-stack'
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
export const DEFAULT_OG_IMAGE_ALT = 'Indian VCs — VC Stack 2026'

/** Editorial review stamp shown on category pages and used as the per-tool
 * updatedAt fallback when the static catalog is the data source.
 *
 * Bump these together when the catalog gets a content sweep:
 *   - LAST_REVIEWED_EPOCH drives the per-tool "Last reviewed" date on detail
 *     pages whenever a tool has no D1 updatedAt.
 *   - LAST_REVIEWED is the human-readable form shown on category pages and
 *     in the methodology page footer. */
export const LAST_REVIEWED_EPOCH = Date.UTC(2026, 3, 26) // 2026-04-26
export const LAST_REVIEWED = 'April 2026'

/** Render an epoch ms timestamp as "April 26, 2026". */
export function formatReviewedDate(epoch: number): string {
  return new Date(epoch).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function publicUrl(path = '/'): string {
  if (path === '' || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function toolUrl(slug: string): string {
  return publicUrl(`/product/${slug}`)
}

export function categoryUrl(slug: string): string {
  return publicUrl(`/category/${slug}`)
}

export function ogImageUrl(path = '/og-image'): string {
  return publicUrl(path)
}
