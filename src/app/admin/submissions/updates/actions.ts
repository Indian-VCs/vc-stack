'use server'

/**
 * Server Actions for the update-feedback admin queue.
 *
 * Two patterns:
 *   1. Per-row actions (markApplied / rejectFeedback / archiveFeedback) for
 *      individual suggestion rows.
 *   2. markAllRequestsApplied(toolSlug) — bulk action for the Requests tab,
 *      where rows are aggregated by tool. Marks every pending request row for
 *      that tool as 'applied' in one update.
 *
 * Every mutation is mirrored into the audit log.
 */

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import type { UpdateFeedbackRow } from '@/lib/db/schema'
import { audit } from '@/lib/audit'

type ActionResult = {
  ok: boolean
  message?: string
  status?: UpdateFeedbackRow['status']
  count?: number
}

async function loadOrFail(id: string): Promise<UpdateFeedbackRow | null> {
  const db = await getDb()
  const [row] = await db
    .select()
    .from(schema.updateFeedback)
    .where(eq(schema.updateFeedback.id, id))
    .limit(1)
  return row ?? null
}

async function setRowStatus(id: string, status: UpdateFeedbackRow['status']): Promise<void> {
  const db = await getDb()
  await db
    .update(schema.updateFeedback)
    .set({ status, reviewedAt: Date.now() })
    .where(eq(schema.updateFeedback.id, id))
}

async function authedAdmin(): Promise<{ email: string } | { error: string }> {
  try {
    return await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) return { error: 'Sign in again.' }
    throw err
  }
}

export async function markApplied(id: string): Promise<ActionResult> {
  const admin = await authedAdmin()
  if ('error' in admin) return { ok: false, message: admin.error }

  const row = await loadOrFail(id)
  if (!row) return { ok: false, message: 'Not found.' }
  if (row.status !== 'pending') return { ok: false, message: `Already ${row.status}.` }

  await setRowStatus(id, 'applied')
  await audit({
    adminEmail: admin.email,
    action: 'update',
    entity: 'update_feedback',
    entityId: id,
    diff: { status: 'applied', kind: row.kind, toolSlug: row.toolSlug },
  })
  revalidatePath('/admin/submissions/updates')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'applied' }
}

export async function rejectFeedback(id: string): Promise<ActionResult> {
  const admin = await authedAdmin()
  if ('error' in admin) return { ok: false, message: admin.error }

  const row = await loadOrFail(id)
  if (!row) return { ok: false, message: 'Not found.' }
  if (row.status !== 'pending') return { ok: false, message: `Already ${row.status}.` }

  await setRowStatus(id, 'rejected')
  await audit({
    adminEmail: admin.email,
    action: 'update',
    entity: 'update_feedback',
    entityId: id,
    diff: { status: 'rejected', kind: row.kind, toolSlug: row.toolSlug },
  })
  revalidatePath('/admin/submissions/updates')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'rejected' }
}

export async function archiveFeedback(id: string): Promise<ActionResult> {
  const admin = await authedAdmin()
  if ('error' in admin) return { ok: false, message: admin.error }

  const row = await loadOrFail(id)
  if (!row) return { ok: false, message: 'Not found.' }

  await setRowStatus(id, 'archived')
  await audit({
    adminEmail: admin.email,
    action: 'archive',
    entity: 'update_feedback',
    entityId: id,
    diff: { kind: row.kind, toolSlug: row.toolSlug },
  })
  revalidatePath('/admin/submissions/updates')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'archived' }
}

/** Bulk-mark all pending request rows for a tool as 'applied'. Used from the
 * Requests tab where rows are aggregated per tool. */
export async function markAllRequestsApplied(toolSlug: string): Promise<ActionResult> {
  const admin = await authedAdmin()
  if ('error' in admin) return { ok: false, message: admin.error }
  if (typeof toolSlug !== 'string' || toolSlug.length === 0 || toolSlug.length > 200) {
    return { ok: false, message: 'Invalid tool.' }
  }

  const db = await getDb()
  const updated = await db
    .update(schema.updateFeedback)
    .set({ status: 'applied', reviewedAt: Date.now() })
    .where(
      and(
        eq(schema.updateFeedback.toolSlug, toolSlug),
        eq(schema.updateFeedback.kind, 'request'),
        eq(schema.updateFeedback.status, 'pending'),
      ),
    )
    .returning({ id: schema.updateFeedback.id })

  await audit({
    adminEmail: admin.email,
    action: 'update',
    entity: 'update_feedback',
    entityId: toolSlug,
    diff: { kind: 'request_bulk_apply', toolSlug, count: updated.length },
  })
  revalidatePath('/admin/submissions/updates')
  revalidatePath('/admin/dashboard')
  return { ok: true, status: 'applied', count: updated.length }
}
