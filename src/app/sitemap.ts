import type { MetadataRoute } from 'next'
import { getCategories, getAllTools } from '@/lib/data'

const BASE = 'https://indianvcs.com/vc-stack'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tools] = await Promise.all([getCategories(), getAllTools()])
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/all-categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/market-map`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/submit-product`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE}/product/${t.slug}`,
    lastModified: t.updatedAt ? new Date(t.updatedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}
