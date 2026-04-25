'use server'

/**
 * Server Actions for the firm-stack submissions queue.
 *
 * "Publish" here is editorial: the editor types in the slug of the firm
 * profile page they wrote elsewhere, and we mark the submission as
 * `published` so it disappears from the queue. We don't auto-create a
 * page — these need editorial polish.
 */

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { StackSubmissionRow } from '@/lib/db/schema'
import { audit } from '@/lib/audit'

type ActionResult = {
  ok: boolean
  message?: string
  status?: StackSubmissionRow['status']
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,80}[a-z0-9])?$/

async function withAdmin<T extends ActionResult>(fn: (admin: { email: string }) => Promise<T>): Promise<T> {
  try {
    const admin = await requireAdminAction()
    return await fn(admin)
  } catch (err) {
    if (err instanceof NotAuthenticatedError) return { ok: false, message: 'Sign in again.' } as T
    throw err
  }
}

async function loadOrFail(id: string): Promise<StackSubmissionRow | null> {
  const db = await getDb()
  const [row] = await db
    .select()
    .from(schema.stackSubmissions)
    .where(eq(schema.stackSubmissions.id, id))
    .limit(1)
  return row ?? null
}

async function setStatus(
  id: string,
  status: StackSubmissionRow['status'],
  patch: Partial<StackSubmissionRow> = {},
): Promise<void> {
  const db = await getDb()
  await db
    .update(schema.stackSubmissions)
    .set({ status, reviewedAt: Date.now(), ...patch })
    .where(eq(schema.stackSubmissions.id, id))
}

export async function publishStack(id: string, slug: string): Promise<ActionResult> {
  return withAdmin(async (admin) => {
    if (!SLUG_RE.test(slug)) {
      return { ok: false, message: 'Slug must be lowercase a-z, 0-9, hyphens.' }
    }
    const sub = await loadOrFail(id)
    if (!sub) return { ok: false, message: 'Submission not found.' }
    if (sub.status !== 'pending') return { ok: false, message: `Already ${sub.status}.` }

    await setStatus(id, 'published', { publishedSlug: slug })
    await audit({
      adminEmail: admin.email,
      action: 'publish',
      entity: 'stack_submission',
      entityId: id,
      diff: { publishedSlug: slug, firm: sub.firmName },
    })
    revalidatePath('/admin/submissions/stack')
    revalidatePath('/admin/dashboard')
    return { ok: true, status: 'published' }
  })
}

export async function rejectStack(id: string): Promise<ActionResult> {
  return withAdmin(async (admin) => {
    const sub = await loadOrFail(id)
    if (!sub) return { ok: false, message: 'Submission not found.' }
    if (sub.status !== 'pending') return { ok: false, message: `Already ${sub.status}.` }

    await setStatus(id, 'rejected')
    await audit({
      adminEmail: admin.email,
      action: 'update',
      entity: 'stack_submission',
      entityId: id,
      diff: { status: 'rejected' },
    })
    revalidatePath('/admin/submissions/stack')
    revalidatePath('/admin/dashboard')
    return { ok: true, status: 'rejected' }
  })
}

export async function archiveStack(id: string): Promise<ActionResult> {
  return withAdmin(async (admin) => {
    const sub = await loadOrFail(id)
    if (!sub) return { ok: false, message: 'Submission not found.' }

    await setStatus(id, 'archived')
    await audit({
      adminEmail: admin.email,
      action: 'archive',
      entity: 'stack_submission',
      entityId: id,
    })
    revalidatePath('/admin/submissions/stack')
    revalidatePath('/admin/dashboard')
    return { ok: true, status: 'archived' }
  })
}
