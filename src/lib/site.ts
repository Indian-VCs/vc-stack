export const SITE_ORIGIN = 'https://www.indianvcs.com'
const BASE_PATH = '/vc-stack'
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
export const DEFAULT_OG_IMAGE_ALT = 'Indian VCs — VC Stack 2026'

/** Editorial review stamp shown on category pages and surfaced as a freshness signal in metadata.
 * Bump this whenever the catalog gets a content sweep. */
export const LAST_REVIEWED = 'April 2026'

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
