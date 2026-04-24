'use server'

import { z } from 'zod'
import { STATIC_CATEGORIES } from '@/lib/data'

const CATEGORY_IDS = new Set(STATIC_CATEGORIES.map((category) => category.id))

// ── Zod schemas ───────────────────────────────────────────────────────────────

const submitToolSchema = z.object({
  toolName: z.string().trim().min(2, 'Tool name must be at least 2 characters').max(100),
  websiteUrl: z.string().trim().url('Please enter a valid URL'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(1000),
  submitterEmail: z.string().trim().email('Please enter a valid email'),
  categoryId: z.string().trim().min(1, 'Please select a category')
    .refine((id) => CATEGORY_IDS.has(id), 'Please select a valid category'),
})

export type SubmitToolState = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof z.infer<typeof submitToolSchema>, string[]>>
}

// ── Actions ───────────────────────────────────────────────────────────────────
//
// No database — submissions are validated server-side and acknowledged.
// A proper moderation workflow (email queue + review dashboard) is deferred
// to v2. Until then, users are pointed at hello@indianvcs.com for follow-up.

export async function submitTool(
  _prev: SubmitToolState,
  formData: FormData
): Promise<SubmitToolState> {
  const raw = {
    toolName: formData.get('toolName'),
    websiteUrl: formData.get('websiteUrl'),
    description: formData.get('description'),
    submitterEmail: formData.get('submitterEmail'),
    categoryId: formData.get('categoryId'),
  }

  const parsed = submitToolSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as SubmitToolState['errors'],
    }
  }

  return {
    success: true,
    message:
      'Thanks — the submission was received. We review suggestions manually; email hello@indianvcs.com if you want confirmation.',
  }
}
