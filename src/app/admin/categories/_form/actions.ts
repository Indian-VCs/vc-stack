'use server'

/**
 * Categories CRUD actions. Same pattern as tools: requireAdmin → validate →
 * write → audit → revalidate. Categories also propagate to /all-categories
 * and any /category/[slug] cache.
 */

import { eq, and, ne, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import {
  parseCategoryForm,
  parseSortOrder,
  type CategoryActionState,
} from './categorySchema'

async function withAdmin<T>(fn: (admin: { email: string }) => Promise<T>): Promise<T | CategoryActionState> {
  try {
    const admin = await requireAdminAction()
    return await fn(admin)
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      return { ok: false, message: 'Sign in again.' } as CategoryActionState as T
    }
    throw err
  }
}

async function slugInUse(slug: string, excludeId?: string): Promise<boolean> {
  const db = await getDb()
  const cond = excludeId
    ? and(eq(schema.categories.slug, slug), ne(schema.categories.id, excludeId))
    : eq(schema.categories.slug, slug)
  const [hit] = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(cond)
    .limit(1)
  return Boolean(hit)
}

export async function createCategory(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const result = await withAdmin(async (admin): Promise<CategoryActionState> => {
    const parsed = parseCategoryForm(formData)
    if (!parsed.success) {
      return {
        ok: false,
        message: 'Please fix the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    if (await slugInUse(parsed.data.slug)) {
      return { ok: false, message: 'That slug is taken.', fieldErrors: { slug: ['taken'] } }
    }

    const db = await getDb()
    const id = crypto.randomUUID()
    const now = Date.now()
    await db.insert(schema.categories).values({
      id,
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
      imageUrl: parsed.data.imageUrl || null,
      intro: null,
      buyingCriteria: null,
      relatedSlugs: null,
      seoTitle: null,
      seoDescription: null,
      heroAngle: null,
      sortOrder: parseSortOrder(parsed.data.sortOrder),
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    })

    await audit({
      adminEmail: admin.email,
      action: 'create',
      entity: 'category',
      entityId: id,
      diff: { slug: parsed.data.slug, name: parsed.data.name },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/all-categories')
    revalidatePath(`/category/${parsed.data.slug}`)
    return { ok: true, message: 'Created.' }
  })

  if ((result as CategoryActionState).ok) {
    redirect('/admin/categories')
  }
  return result as CategoryActionState
}

export async function updateCategory(
  id: string,
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const result = await withAdmin(async (admin): Promise<CategoryActionState> => {
    const parsed = parseCategoryForm(formData)
    if (!parsed.success) {
      return {
        ok: false,
        message: 'Please fix the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    if (await slugInUse(parsed.data.slug, id)) {
      return { ok: false, message: 'That slug is taken.', fieldErrors: { slug: ['taken'] } }
    }

    const db = await getDb()
    const [before] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1)
    if (!before) return { ok: false, message: 'Category not found.' }

    await db
      .update(schema.categories)
      .set({
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
        imageUrl: parsed.data.imageUrl || null,
        sortOrder: parseSortOrder(parsed.data.sortOrder),
        updatedAt: Date.now(),
      })
      .where(eq(schema.categories.id, id))

    await audit({
      adminEmail: admin.email,
      action: 'update',
      entity: 'category',
      entityId: id,
      diff: {
        before: { slug: before.slug, name: before.name },
        after: { slug: parsed.data.slug, name: parsed.data.name },
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/all-categories')
    revalidatePath(`/category/${before.slug}`)
    revalidatePath(`/category/${parsed.data.slug}`)
    return { ok: true, message: 'Saved.' }
  })

  if ((result as CategoryActionState).ok) {
    redirect('/admin/categories')
  }
  return result as CategoryActionState
}

export async function archiveCategory(id: string): Promise<{ ok: boolean; message?: string }> {
  return (await withAdmin(async (admin) => {
    const db = await getDb()
    const [before] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1)
    if (!before) return { ok: false, message: 'Category not found.' }
    if (before.archivedAt) return { ok: false, message: 'Already archived.' }

    // Sanity check: refuse to archive a category that has active tools.
    const [hasTools] = await db
      .select({ id: schema.tools.id })
      .from(schema.tools)
      .where(and(eq(schema.tools.categoryId, id), isNull(schema.tools.archivedAt)))
      .limit(1)
    if (hasTools) {
      return {
        ok: false,
        message: 'Section still has active tools. Reassign or archive them first.',
      }
    }

    await db
      .update(schema.categories)
      .set({ archivedAt: Date.now() })
      .where(eq(schema.categories.id, id))
    await audit({
      adminEmail: admin.email,
      action: 'archive',
      entity: 'category',
      entityId: id,
      diff: { slug: before.slug, name: before.name },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/all-categories')
    revalidatePath(`/category/${before.slug}`)
    return { ok: true }
  })) as { ok: boolean; message?: string }
}

export async function restoreCategory(id: string): Promise<{ ok: boolean; message?: string }> {
  return (await withAdmin(async (admin) => {
    const db = await getDb()
    const [before] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1)
    if (!before) return { ok: false, message: 'Category not found.' }
    if (!before.archivedAt) return { ok: false, message: 'Not archived.' }

    await db
      .update(schema.categories)
      .set({ archivedAt: null })
      .where(eq(schema.categories.id, id))
    await audit({
      adminEmail: admin.email,
      action: 'update',
      entity: 'category',
      entityId: id,
      diff: { restored: true },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/all-categories')
    revalidatePath(`/category/${before.slug}`)
    return { ok: true }
  })) as { ok: boolean; message?: string }
}
