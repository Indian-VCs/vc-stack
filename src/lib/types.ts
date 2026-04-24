export type PricingModel = 'FREE' | 'FREEMIUM' | 'PAID' | 'ENTERPRISE'
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type UserRole = 'USER' | 'ADMIN'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  imageUrl?: string | null
  _count?: { tools: number }
  subCategories?: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  categoryId: string
  _count?: { tools: number }
}

export interface Tag {
  id: string
  name: string
  slug: string
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
  screenshotUrl?: string | null
  pricingModel: PricingModel
  isFeatured: boolean
  categoryId: string
  category?: Category
  /** Slugs of additional categories the tool appears under (market map multi-placement). Primary category is always `category`. */
  extraCategorySlugs?: string[]
  subCategoryId?: string | null
  subCategory?: SubCategory | null
  tags?: Tag[]
  reviews?: Review[]
  _count?: { reviews: number }
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Review {
  id: string
  rating: number
  content: string
  toolId: string
  userId: string
  user?: { name: string | null; email: string }
  isApproved: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Submission {
  id: string
  toolName: string
  websiteUrl: string
  description: string
  submitterId: string
  submitter?: { name: string | null; email: string }
  status: SubmissionStatus
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: string
  email: string
  name?: string | null
  role: UserRole
  createdAt: Date | string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type SortOrder = 'featured' | 'alpha' | 'reviews'

export interface SearchFilters {
  query?: string
  category?: string
  pricing?: PricingModel | ''
  tags?: string[]
  page?: number
  pageSize?: number
  /** Ordering for tool results. Defaults to 'featured'. */
  sort?: SortOrder
}
