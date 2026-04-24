import { describe, it, expect } from 'vitest'
import {
  STATIC_TOOLS,
  STATIC_CATEGORIES,
  categorySlugsForTool,
  getCategoryPreviewTools,
  searchTools,
} from './data'
import { TOTAL_UNIQUE_TOOLS, TOTAL_TOOL_APPEARANCES, TOTAL_CATEGORIES } from './stats'
import { categoryUrl, ogImageUrl, publicUrl, toolUrl } from './site'

describe('categorySlugsForTool', () => {
  it('returns just the primary slug for single-category tools', () => {
    const singleCat = STATIC_TOOLS.find(
      (t) => !t.extraCategorySlugs || t.extraCategorySlugs.length === 0,
    )!
    expect(singleCat).toBeDefined()
    expect(categorySlugsForTool(singleCat)).toEqual([singleCat.category!.slug])
  })

  it('returns primary + extras for multi-category tools (Notion)', () => {
    const notion = STATIC_TOOLS.find((t) => t.name === 'Notion')!
    expect(notion).toBeDefined()
    const slugs = categorySlugsForTool(notion)
    expect(slugs).toContain('crm')
    expect(slugs).toContain('productivity')
    expect(slugs).toContain('transcription')
    expect(slugs).toHaveLength(3)
  })
})

describe('canonical catalog invariants', () => {
  it('has exactly the expected number of unique tools matching appearances', () => {
    // Total appearances = unique tools + extra placements
    const appearances = STATIC_TOOLS.reduce(
      (acc, t) => acc + categorySlugsForTool(t).length,
      0,
    )
    // If these ever drift, check tools-data.ts and the MarketMapPoster together.
    expect(TOTAL_UNIQUE_TOOLS).toBe(STATIC_TOOLS.length)
    expect(TOTAL_TOOL_APPEARANCES).toBe(appearances)
    expect(TOTAL_CATEGORIES).toBe(STATIC_CATEGORIES.length)
  })

  it('every tool has a category that exists in STATIC_CATEGORIES', () => {
    const slugs = new Set(STATIC_CATEGORIES.map((c) => c.slug))
    for (const t of STATIC_TOOLS) {
      expect(t.category, `tool ${t.name} has no category`).toBeDefined()
      expect(slugs.has(t.category!.slug), `${t.name} → ${t.category!.slug}`).toBe(true)
      for (const extra of t.extraCategorySlugs ?? []) {
        expect(slugs.has(extra), `${t.name} extra → ${extra}`).toBe(true)
      }
    }
  })

  it('has unique slugs across the canonical catalog', () => {
    const slugs = STATIC_TOOLS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('populates every category _count.tools with its real appearance count', () => {
    for (const cat of STATIC_CATEGORIES) {
      const actual = STATIC_TOOLS.filter((t) =>
        categorySlugsForTool(t).includes(cat.slug),
      ).length
      expect(cat._count?.tools, `category ${cat.slug}`).toBe(actual)
    }
  })
})

describe('catalog fetch helpers', () => {
  it('paginates search results instead of returning the whole corpus', async () => {
    const firstPage = await searchTools({ page: 1, pageSize: 10 })
    const secondPage = await searchTools({ page: 2, pageSize: 10 })

    expect(firstPage.total).toBe(STATIC_TOOLS.length)
    expect(firstPage.totalPages).toBeGreaterThan(1)
    expect(firstPage.data).toHaveLength(10)
    expect(secondPage.page).toBe(2)
    expect(secondPage.data).toHaveLength(10)
    expect(secondPage.data[0].slug).not.toBe(firstPage.data[0].slug)
  })

  it('uses extra category placements in category preview chips', async () => {
    const previews = await getCategoryPreviewTools()

    expect(previews.productivity.map((tool) => tool.name)).toContain('Airtable')
    expect(previews.transcription.map((tool) => tool.name)).toContain('Notion')
  })
})

describe('public URL helpers', () => {
  it('keeps canonical and OG URLs under the /vc-stack mount path', () => {
    expect(publicUrl('/')).toBe('https://www.indianvcs.com/vc-stack/')
    expect(categoryUrl('productivity')).toBe('https://www.indianvcs.com/vc-stack/category/productivity')
    expect(toolUrl('notion')).toBe('https://www.indianvcs.com/vc-stack/product/notion')
    expect(ogImageUrl('/product/notion/og-image')).toBe(
      'https://www.indianvcs.com/vc-stack/product/notion/og-image',
    )
  })
})
