'use server'

import { z } from 'zod'

// ── Zod schemas ───────────────────────────────────────────────────────────────

const submitToolSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters').max(100),
  websiteUrl: z.string().url('Please enter a valid URL'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  submitterEmail: z.string().email('Please enter a valid email'),
  categoryId: z.string().min(1, 'Please select a category'),
})

const reviewSchema = z.object({
  toolSlug: z.string().min(1, 'Tool is required'),
  rating: z.coerce.number().int().min(1).max(5),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  reviewerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  reviewerEmail: z.string().email('Please enter a valid email'),
})

export type SubmitToolState = {
  success: boolean
  message: string
  fileNo?: string
  errors?: Partial<Record<keyof z.infer<typeof submitToolSchema>, string[]>>
}

export type SubmitReviewState = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof z.infer<typeof reviewSchema>, string[]>>
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

export async function submitReview(
  _prev: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const raw = {
    toolSlug: formData.get('toolSlug'),
    rating: formData.get('rating'),
    content: formData.get('content'),
    reviewerName: formData.get('reviewerName'),
    reviewerEmail: formData.get('reviewerEmail'),
  }

  const parsed = reviewSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as SubmitReviewState['errors'],
    }
  }

  return {
    success: true,
    message: 'Thanks — your review was received and will be approved shortly.',
  }
}
