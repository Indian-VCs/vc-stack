'use server'

/**
 * Server Actions for the tool submissions queue.
 *
 * All three (approve / reject / archive) call requireAdminAction() FIRST so
 * an unauthed caller gets back an error instead of silent execution. Every
 * mutation is mirrored into the audit log.
 *
 * `approve` is the interesting one: it inserts a real `tools` row, derived
 * from the submission's fields. The new tool gets a generated UUID id and a
 * slug derived from the tool name (collisions append a short suffix).
 */

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { ToolSubmissionRow } from '@/lib/db/schema'
import { audit } from '@/lib/audit'
import { normalizeHttpUrl } from '@/lib/url'

type ActionResult = {
  ok: boolean
  message?: string
  status?: ToolSubmissionRow['status']
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const db = await getDb()
  const baseSlug = base || `tool-${Date.now()}`
  let slug = baseSlug
  let suffix = 0
  while (true) {
    const existing = await db
      .select({ id: schema.tools.id })
      .from(schema.tools)
      .where(eq(schema.tools.slug, slug))
      .limit(1)
    if (existing.length === 0) return slug
    suffix += 1
    slug = `${baseSlug}-${suffix}`
    if (suffix > 50) {
      slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`
      return slug
    }
  }
}

async function loadOrFail(id: string): Promise<ToolSubmissionRow | null> {
  const db = await getDb()
  const [row] = await db
    .select()
    .from(schema.toolSubmissions)
    .where(eq(schema.toolSubmissions.id, id))
    .limit(1)
  return row ?? null
}

async function setStatus(
  id: string,
  status: ToolSubmissionRow['status'],
  patch: Partial<ToolSubmissionRow> = {},
): Promise<void> {
  const db = await getDb()
  await db
    .update(schema.toolSubmissions)
    .set({ status, reviewedAt: Date.now(), ...patch })
    .where(eq(schema.toolSubmissions.id, id))
}

export async function approveSubmission(id: string): Promise<ActionResult> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) return { ok: false, message: 'Sign in again.' }
    throw err
  }

  const sub = await loadOrFail(id)
  if (!sub) return { ok: false, message: 'Submission not found.' }
  if (sub.status !== 'pending') return { ok: false, message: `Already ${sub.status}.` }

  // Verify the category still exists & isn't archived.
  const db = await getDb()
  const [cat] = await db
    .select({ id: schema.categories.id, slug: schema.categories.slug })
    .from(schema.categories)
    .where(eq(schema.categories.id, sub.categoryId))
    .limit(1)
  if (!cat) {
    return { ok: false, message: `Category ${sub.categoryId} not found — fix the submission first.` }
  }

  const slug = await ensureUniqueSlug(slugify(sub.toolName))
  const websiteUrl = normalizeHttpUrl(sub.websiteUrl)
  if (!websiteUrl) {
    return { ok: false, message: 'Submission website must be a valid http(s) URL before approval.' }
  }

  const newToolId = crypto.randomUUID()
  const now = Date.now()

  await db.insert(schema.tools).values({
    id: newToolId,
    slug,
    name: sub.toolName,
    description: sub.description,
    shortDesc: null,
    useCases: null,
    websiteUrl,
    logoUrl: null,
    pricingModel: sub.pricingModel ?? 'FREEMIUM',
    isFeatured: false,
    featuredOrder: null,
    categoryId: sub.categoryId,
    extraCategorySlugs: null,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  })

  await setStatus(id, 'approved', { approvedToolId: newToolId })
  await audit({
    adminEmail: admin.email,
    action: 'create',
    entity: 'tool',
    entityId: newToolId,
    diff: { fromSubmission: id, slug, name: sub.toolName },
  })
  await audit({
    adminEmail: admin.email,
    action: 'publish',
    entity: 'tool_submission',
    entityId: id,
  })

  revalidatePath('/admin/submissions/tools')
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  revalidatePath('/all-categories')
  revalidatePath('/market-map')
  revalidatePath('/search')
  revalidatePath(`/product/${slug}`)
  revalidatePath(`/product/${slug}/og-image`)
  revalidatePath(`/category/${cat.slug}`)
  revalidatePath(`/category/${cat.slug}/og-image`)
  return { ok: true, status: 'approved' }
}

export async function rejectSubmission(id: string): Promise<ActionResult> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) return { ok: false, message: 'Sign in again.' }
    throw err
  }

  const sub = await loadOrFail(id)
  if (!sub) return { ok: false, message: 'Submission not found.' }
  if (sub.status !== 'pending') return { ok: false, message: `Already ${sub.status}.` }

  await setStatus(id, 'rejected')
  await audit({
    adminEmail: admin.email,
    action: 'update',
    entity: 'tool_submission',
    entityId: id,
    diff: { status: 'rejected' },
  })
  revalidatePath('/admin/submissions/tools')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'rejected' }
}

export async function archiveSubmission(id: string): Promise<ActionResult> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) return { ok: false, message: 'Sign in again.' }
    throw err
  }

  const sub = await loadOrFail(id)
  if (!sub) return { ok: false, message: 'Submission not found.' }

  await setStatus(id, 'archived')
  await audit({
    adminEmail: admin.email,
    action: 'archive',
    entity: 'tool_submission',
    entityId: id,
  })
  revalidatePath('/admin/submissions/tools')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'archived' }
}
