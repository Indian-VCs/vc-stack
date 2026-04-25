export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    return request.headers.get('host') === originUrl.host
  } catch {
    return false
  }
}
