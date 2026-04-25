'use server'

import { z } from 'zod'
import { inArray } from 'drizzle-orm'
import { getDb, schema } from '@/lib/db/client'
import { isHttpUrl, normalizeHttpUrl } from '@/lib/url'
import { checkSubmissionLimit, hitHoneypot } from './publicSubmissionGuards'

// ── Types ────────────────────────────────────────────────────────────────────

export type SubmitStackState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// ── Zod schemas ──────────────────────────────────────────────────────────────
//
// `toolSlugs` and `notes` arrive as JSON strings (hidden inputs), so we parse
// them through z.preprocess into real arrays before validating shape.

const toolSlugsSchema = z.preprocess((val) => {
  if (typeof val !== 'string' || val.trim() === '') return []
  try {
    return JSON.parse(val)
  } catch {
    return val
  }
}, z.array(z.string().trim().min(1).max(200)).max(50))

const notesSchema = z.preprocess(
  (val) => {
    if (typeof val !== 'string' || val.trim() === '') return []
    try {
      return JSON.parse(val)
    } catch {
      return val
    }
  },
  z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(200),
        note: z.string().trim().max(500),
      }),
    )
    .max(50),
)

const submitStackSchema = z.object({
  firmName: z.string().trim().min(1, 'Firm name is required').max(200),
  firmWebsite: z
    .string()
    .trim()
    .max(500)
    .refine(isHttpUrl, 'Please enter a valid http(s) URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  submitterName: z.string().trim().min(1, 'Your name is required').max(100),
  submitterRole: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  submitterEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email')
    .max(200),
  toolSlugs: toolSlugsSchema.refine(
    (arr) => arr.length >= 1,
    'Pick at least one tool from the catalog',
  ),
  otherTools: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  notes: notesSchema.optional().default([]),
})

// ── Action ───────────────────────────────────────────────────────────────────
//
// Public — no auth. Validates server-side, verifies every referenced slug
// actually exists in the catalog, then inserts a row into `stack_submissions`
// with status='pending'. Editors moderate at /admin/submissions/stack.
//
// On DB failure we never throw to the client; we return a friendly message and
// log server-side for ops.

export async function submitStack(
  _prev: SubmitStackState,
  formData: FormData,
): Promise<SubmitStackState> {
  if (hitHoneypot(formData)) {
    return {
      success: true,
      message:
        'Thanks — we have your stack. An editor will review it within a few days and reach out before publishing a firm profile.',
    }
  }

  const limit = await checkSubmissionLimit('stack')
  if (!limit.allowed) {
    return {
      success: false,
      message: 'Too many submissions from this network. Please try again later.',
    }
  }

  const raw = {
    firmName: formData.get('firmName') ?? '',
    firmWebsite: formData.get('firmWebsite') ?? '',
    submitterName: formData.get('submitterName') ?? '',
    submitterRole: formData.get('submitterRole') ?? '',
    submitterEmail: formData.get('submitterEmail') ?? '',
    toolSlugs: formData.get('toolSlugs') ?? '[]',
    otherTools: formData.get('otherTools') ?? '',
    notes: formData.get('notes') ?? '[]',
  }

  const parsed = submitStackSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  // Notes can only reference selected slugs.
  const selectedSet = new Set(data.toolSlugs)
  const cleanedNotes = (data.notes ?? []).filter(
    (n) => selectedSet.has(n.slug) && n.note.trim() !== '',
  )

  // Verify every slug exists in the catalog (toolSlugs ∪ note.slug).
  const allReferencedSlugs = Array.from(
    new Set<string>([...data.toolSlugs, ...cleanedNotes.map((n) => n.slug)]),
  )

  try {
    const db = await getDb()

    if (allReferencedSlugs.length > 0) {
      const existing = await db
        .select({ slug: schema.tools.slug })
        .from(schema.tools)
        .where(inArray(schema.tools.slug, allReferencedSlugs))

      const existingSet = new Set(existing.map((r) => r.slug))
      const missing = allReferencedSlugs.filter((s) => !existingSet.has(s))
      if (missing.length > 0) {
        return {
          success: false,
          message: 'Please fix the errors below.',
          errors: {
            toolSlugs: [
              `These tools aren't in the catalog: ${missing.slice(0, 5).join(', ')}${
                missing.length > 5 ? '…' : ''
              }. Refresh and try again.`,
            ],
          },
        }
      }
    }

    await db.insert(schema.stackSubmissions).values({
      id: crypto.randomUUID(),
      firmName: data.firmName,
      firmWebsite: data.firmWebsite ? normalizeHttpUrl(data.firmWebsite) : null,
      submitterName: data.submitterName,
      submitterRole: data.submitterRole ?? null,
      submitterEmail: data.submitterEmail,
      toolSlugs: data.toolSlugs,
      otherTools: data.otherTools ?? null,
      notes: cleanedNotes.length > 0 ? cleanedNotes : null,
      status: 'pending',
      adminNotes: null,
      publishedSlug: null,
      createdAt: Date.now(),
      reviewedAt: null,
    })
  } catch (err) {
    console.error('[submitStack] DB write failed', err)
    return {
      success: false,
      message:
        "Couldn't save your stack right now. Please try again in a minute, or email hello@indianvcs.com.",
    }
  }

  return {
    success: true,
    message:
      'Thanks — we have your stack. An editor will review it within a few days and reach out before publishing a firm profile.',
  }
}
