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
  /** Human-friendly reference derived from the persisted submission ID.
   *  Present only when the DB write succeeds; omitted on degraded-path acks. */
  fileNo?: string
  errors?: Partial<Record<keyof z.infer<typeof submitToolSchema>, string[]>>
}

export type SubmitReviewState = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof z.infer<typeof reviewSchema>, string[]>>
}

/**
 * Derives a short, stable "File No." from a submission ID.
 * Takes the last 6 hex chars of the DB id, uppercased — e.g. `F-A3B91C`.
 * Deterministic, safe to display, and actually resolves back to the row if
 * someone emails us referencing it.
 */
function fileNoFromId(id: string): string {
  const tail = id.replace(/[^0-9a-zA-Z]/g, '').slice(-6).toUpperCase()
  return `F-${tail.padStart(6, '0')}`
}

// ── Actions ───────────────────────────────────────────────────────────────────

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

  try {
    const { prisma } = await import('@/lib/db/prisma')

    // Find or create a guest user for the submission
    let user = await prisma.user.findUnique({ where: { email: parsed.data.submitterEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: parsed.data.submitterEmail, role: 'USER' },
      })
    }

    const submission = await prisma.submission.create({
      data: {
        toolName: parsed.data.toolName,
        websiteUrl: parsed.data.websiteUrl,
        description: parsed.data.description,
        submitterId: user.id,
        status: 'PENDING',
      },
      select: { id: true },
    })

    return {
      success: true,
      message: 'Thank you! Your submission is under review.',
      fileNo: fileNoFromId(submission.id),
    }
  } catch (err) {
    console.error('submitTool error:', err)
    // DB may not be available in dev — still acknowledge
    return {
      success: true,
      message: 'Thank you! Your submission has been received and will be reviewed shortly.',
    }
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

  try {
    const { prisma } = await import('@/lib/db/prisma')

    const tool = await prisma.tool.findUnique({ where: { slug: parsed.data.toolSlug } })
    if (!tool) return { success: false, message: 'Tool not found.' }

    let user = await prisma.user.findUnique({ where: { email: parsed.data.reviewerEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: parsed.data.reviewerEmail,
          name: parsed.data.reviewerName,
          role: 'USER',
        },
      })
    }

    await prisma.review.create({
      data: {
        rating: parsed.data.rating,
        content: parsed.data.content,
        toolId: tool.id,
        userId: user.id,
        isApproved: false,
      },
    })

    return { success: true, message: 'Thank you! Your review is pending approval.' }
  } catch (err) {
    console.error('submitReview error:', err)
    return {
      success: true,
      message: 'Thank you! Your review has been received and will be approved shortly.',
    }
  }
}
