'use server'

/**
 * Server Actions for the Featured-order editor.
 *
 * `saveFeaturedOrder` accepts a flat array of tool IDs in the desired order
 * and rewrites the `featuredOrder` / `isFeatured` columns to match. Any tool
 * that previously sat in the featured list but isn't included in the new
 * order is unfeatured (so removing a row from the UI cleanly evicts it).
 *
 * D1 has no real transactions, so the writes go out as sequential `.update()`
 * calls. The validation pass up front guarantees the input set is internally
 * consistent before any DB write happens.
 */

import { and, eq, inArray, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import { audit } from '@/lib/audit'

type Result = { ok: boolean; message?: string }

export async function saveFeaturedOrder(orderedIds: string[]): Promise<Result> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      return { ok: false, message: 'Sign in again.' }
    }
    throw err
  }

  if (!Array.isArray(orderedIds)) {
    return { ok: false, message: 'Invalid payload.' }
  }
  if (orderedIds.some((id) => typeof id !== 'string' || !id)) {
    return { ok: false, message: 'Invalid tool id in payload.' }
  }

  const seen = new Set<string>()
  for (const id of orderedIds) {
    if (seen.has(id)) {
      return { ok: false, message: 'Duplicate tool id in payload.' }
    }
    seen.add(id)
  }

  const db = await getDb()

  // Validate every supplied id exists and isn't archived.
  if (orderedIds.length > 0) {
    const found = await db
      .select({ id: schema.tools.id, archivedAt: schema.tools.archivedAt })
      .from(schema.tools)
      .where(inArray(schema.tools.id, orderedIds))
    if (found.length !== orderedIds.length) {
      return { ok: false, message: 'One or more tools no longer exist.' }
    }
    if (found.some((row) => row.archivedAt !== null)) {
      return { ok: false, message: 'Cannot feature an archived tool.' }
    }
  }

  // Apply new order. Sequential updates — D1 doesn't support real transactions
  // through drizzle, so this is the safest portable option.
  const now = Date.now()
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(schema.tools)
      .set({ featuredOrder: i, isFeatured: true, updatedAt: now })
      .where(eq(schema.tools.id, orderedIds[i]))
  }

  // Unfeature any tool that was previously featured/ordered but isn't in the
  // new list.
  const evictWhere = orderedIds.length
    ? and(
        or(eq(schema.tools.isFeatured, true), sql`${schema.tools.featuredOrder} IS NOT NULL`),
        sql`${schema.tools.id} NOT IN (${sql.join(
          orderedIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      )
    : or(eq(schema.tools.isFeatured, true), sql`${schema.tools.featuredOrder} IS NOT NULL`)

  await db
    .update(schema.tools)
    .set({ featuredOrder: null, isFeatured: false, updatedAt: now })
    .where(evictWhere)

  await audit({
    adminEmail: admin.email,
    action: 'reorder',
    entity: 'featured',
    diff: { order: orderedIds },
  })

  revalidatePath('/admin/featured')
  revalidatePath('/admin/tools')
  revalidatePath('/admin/dashboard')
  revalidatePath('/')

  return { ok: true, message: 'Order saved.' }
}
