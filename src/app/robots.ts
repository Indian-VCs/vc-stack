import type { MetadataRoute } from 'next'
import { SITE_ORIGIN, publicUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/admin/*', '/api/*'],
      },
    ],
    sitemap: publicUrl('/sitemap.xml'),
    host: SITE_ORIGIN,
  }
}
