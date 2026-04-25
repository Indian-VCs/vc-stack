import { z } from 'zod'

export const CategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(80)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'lowercase letters, digits, hyphens'),
  description: z.string().trim().max(1000).optional().default(''),
  icon: z.string().trim().max(8).optional().default(''),
  imageUrl: z.string().trim().max(500).optional().default(''),
  sortOrder: z.union([z.string().regex(/^\d*$/), z.literal('')]).optional().default(''),
})

export type CategoryActionState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

export function parseCategoryForm(formData: FormData) {
  return CategorySchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') ?? '',
    icon: formData.get('icon') ?? '',
    imageUrl: formData.get('imageUrl') ?? '',
    sortOrder: (formData.get('sortOrder') as string) ?? '',
  })
}

export function parseSortOrder(raw: string): number {
  if (!raw) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}
