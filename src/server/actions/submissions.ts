'use server'

import { z } from 'zod'
import { STATIC_CATEGORIES } from '@/lib/data'
import { getDb, schema } from '@/lib/db/client'

const CATEGORY_IDS = new Set(STATIC_CATEGORIES.map((category) => category.id))

// ── Zod schemas ───────────────────────────────────────────────────────────────

const submitToolSchema = z.object({
  toolName: z.string().trim().min(2, 'Tool name must be at least 2 characters').max(100),
  websiteUrl: z.string().trim().url('Please enter a valid URL').max(500),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(1000),
  submitterEmail: z.string().trim().toLowerCase().email('Please enter a valid email').max(200),
  submitterName: z.string().trim().max(100).optional(),
  submitterFirm: z.string().trim().max(100).optional(),
  categoryId: z.string().trim().min(1, 'Please select a category')
    .refine((id) => CATEGORY_IDS.has(id), 'Please select a valid category'),
  /** "we_use" | "i_built" | "i_know" — optional, controls editorial weight. */
  relationship: z.enum(['we_use', 'i_built', 'i_know']).optional(),
})

export type SubmitToolState = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof z.infer<typeof submitToolSchema>, string[]>>
}

// ── Actions ───────────────────────────────────────────────────────────────────
//
// Submissions are validated server-side and persisted to the `tool_submissions`
// table. An editor reviews them at /admin/submissions/tools and either promotes
// to a real `tools` row (status=approved) or rejects/archives.
//
// On DB failure we return success=false with a friendly message — we never want
// the public form to throw. The error is logged server-side for ops.

export async function submitTool(
  _prev: SubmitToolState,
  formData: FormData,
): Promise<SubmitToolState> {
  const raw = {
    toolName: formData.get('toolName'),
    websiteUrl: formData.get('websiteUrl'),
    description: formData.get('description'),
    submitterEmail: formData.get('submitterEmail'),
    submitterName: formData.get('submitterName') || undefined,
    submitterFirm: formData.get('submitterFirm') || undefined,
    categoryId: formData.get('categoryId'),
    relationship: formData.get('relationship') || undefined,
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
    const db = await getDb()
    await db.insert(schema.toolSubmissions).values({
      id: crypto.randomUUID(),
      toolName: parsed.data.toolName,
      websiteUrl: parsed.data.websiteUrl,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      submitterEmail: parsed.data.submitterEmail,
      submitterName: parsed.data.submitterName ?? null,
      submitterFirm: parsed.data.submitterFirm ?? null,
      relationship: parsed.data.relationship ?? null,
      status: 'pending',
      pricingModel: null,
      adminNotes: null,
      approvedToolId: null,
      createdAt: Date.now(),
      reviewedAt: null,
    })
  } catch (err) {
    console.error('[submitTool] DB write failed', err)
    return {
      success: false,
      message:
        "Couldn't save your submission right now. Please try again in a minute, or email hello@indianvcs.com.",
    }
  }

  return {
    success: true,
    message:
      'Thanks — submission received. An editor will review it within a few days. Reply to your confirmation email for follow-up.',
  }
}
