import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/admin/*', '/api/*'],
      },
    ],
    sitemap: 'https://indianvcs.com/vc-stack/sitemap.xml',
    host: 'https://indianvcs.com',
  }
}
