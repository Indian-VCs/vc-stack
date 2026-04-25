const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

export function normalizeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const raw = value.trim()
  if (!raw) return null

  try {
    const url = new URL(raw)
    if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname) return null
    return url.href
  } catch {
    return null
  }
}

export function isHttpUrl(value: unknown): boolean {
  return normalizeHttpUrl(value) !== null
}

export function externalHref(value: unknown): string | undefined {
  return normalizeHttpUrl(value) ?? undefined
}

export function displayExternalUrl(value: unknown): string {
  const normalized = normalizeHttpUrl(value)
  if (!normalized) return 'Invalid URL'

  const url = new URL(normalized)
  const host = url.hostname.replace(/^www\./, '')
  const path = `${url.pathname}${url.search}${url.hash}`.replace(/\/$/, '')
  return `${host}${path === '/' ? '' : path}`
}

export function domainForHttpUrl(value: unknown): string {
  const normalized = normalizeHttpUrl(value)
  if (!normalized) return ''
  return new URL(normalized).hostname.replace(/^www\./, '')
}
