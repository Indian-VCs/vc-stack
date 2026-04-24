import { renderSiteOgImage } from '@/lib/og-images'

export const revalidate = 3600

export function GET() {
  return renderSiteOgImage()
}
