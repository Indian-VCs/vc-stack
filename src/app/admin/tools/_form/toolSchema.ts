import { z } from 'zod'

const PRICING = ['FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE'] as const

export const ToolSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'lowercase letters, digits, hyphens'),
  description: z.string().trim().min(1, 'Description is required').max(5000),
  shortDesc: z.string().trim().max(200).optional().default(''),
  useCases: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .default(''), // textarea, one bullet per line
  keyFeatures: z
    .string()
    .trim()
    .max(1500)
    .optional()
    .default(''), // textarea, one bullet per line — 2–3 expected
  websiteUrl: z.string().trim().url('Must be a valid URL').max(500),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default('')
    .refine((v) => !v || /^https?:\/\//i.test(v), {
      message: 'Must be a valid http(s) URL',
    }),
  categoryId: z.string().trim().min(1, 'Section is required'),
  extraCategorySlugs: z.string().trim().max(500).optional().default(''), // comma-separated
  pricingModel: z.enum(PRICING).default('FREEMIUM'),
  isFeatured: z.boolean().default(false),
  featuredOrder: z
    .union([z.string().regex(/^\d*$/), z.literal('')])
    .optional()
    .default(''),
})

export type ToolFormShape = z.infer<typeof ToolSchema>

export type ToolActionState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export function parseToolForm(formData: FormData) {
  return ToolSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    shortDesc: formData.get('shortDesc') ?? '',
    useCases: formData.get('useCases') ?? '',
    keyFeatures: formData.get('keyFeatures') ?? '',
    websiteUrl: formData.get('websiteUrl'),
    logoUrl: formData.get('logoUrl') ?? '',
    categoryId: formData.get('categoryId'),
    extraCategorySlugs: formData.get('extraCategorySlugs') ?? '',
    pricingModel: formData.get('pricingModel') ?? 'FREEMIUM',
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    featuredOrder: (formData.get('featuredOrder') as string) ?? '',
  })
}

export function parseUseCases(raw: string): string[] | null {
  const lines = raw
    .split('\n')
    .map((l) => l.replace(/^[\s*•\-–]+/, '').trim())
    .filter(Boolean)
  return lines.length === 0 ? null : lines
}

export const parseKeyFeatures = parseUseCases

export function parseExtraSlugs(raw: string): string[] | null {
  const slugs = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return slugs.length === 0 ? null : slugs
}

export function parseFeaturedOrder(raw: string): number | null {
  if (!raw) return null
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}
