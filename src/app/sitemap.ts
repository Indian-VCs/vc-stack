import type { MetadataRoute } from 'next'
import { getCategories, getAllTools } from '@/lib/data'
import { publicUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tools] = await Promise.all([getCategories(), getAllTools()])
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: publicUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: publicUrl('/all-categories'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: publicUrl('/market-map'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: publicUrl('/methodology'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: publicUrl('/submit-product'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: publicUrl(`/category/${c.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: publicUrl(`/product/${t.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}
