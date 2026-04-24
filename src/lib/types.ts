export type PricingModel = 'FREE' | 'FREEMIUM' | 'PAID' | 'ENTERPRISE'

export interface BuyingCriterion {
  label: string
  description: string
}

export interface CategoryPreviewTool {
  name: string
  logoUrl?: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  imageUrl?: string | null
  _count?: { tools: number }

  /** pSEO content — see docs/pseo-strategy.md */
  intro?: string | null
  buyingCriteria?: BuyingCriterion[] | null
  relatedSlugs?: string[] | null
  seoTitle?: string | null
  seoDescription?: string | null
  heroAngle?: string | null
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string | null
  /** Short VC-oriented use-case bullets rendered on the tool detail page. */
  useCases?: string[]
  websiteUrl: string
  logoUrl?: string | null
  pricingModel: PricingModel
  isFeatured: boolean
  categoryId: string
  category?: Category
  /** Slugs of additional categories the tool appears under (market map multi-placement). Primary category is always `category`. */
  extraCategorySlugs?: string[]
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchFilters {
  query?: string
  category?: string
  pricing?: PricingModel | ''
  page?: number
  pageSize?: number
}
