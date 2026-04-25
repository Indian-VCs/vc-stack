'use server'

/**
 * Server Actions for tool CRUD. Every action checks auth FIRST, validates with
 * Zod, performs the DB write, audits, then revalidates affected paths.
 */

import { eq, and, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { normalizeHttpUrl } from '@/lib/url'
import {
  parseToolForm,
  parseUseCases,
  parseExtraSlugs,
  parseFeaturedOrder,
  type ToolActionState,
} from './toolSchema'

async function withAdmin<T>(fn: (admin: { email: string }) => Promise<T>): Promise<T | ToolActionState> {
  try {
    const admin = await requireAdminAction()
    return await fn(admin)
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      return { ok: false, message: 'Sign in again.' } as ToolActionState as T
    }
    throw err
  }
}

async function slugInUse(slug: string, excludeId?: string): Promise<boolean> {
  const db = await getDb()
  const cond = excludeId
    ? and(eq(schema.tools.slug, slug), ne(schema.tools.id, excludeId))
    : eq(schema.tools.slug, slug)
  const [hit] = await db.select({ id: schema.tools.id }).from(schema.tools).where(cond).limit(1)
  return Boolean(hit)
}

async function categoryExists(categoryId: string): Promise<boolean> {
  const db = await getDb()
  const [hit] = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(eq(schema.categories.id, categoryId))
    .limit(1)
  return Boolean(hit)
}

async function categorySlugById(categoryId: string): Promise<string | null> {
  const db = await getDb()
  const [hit] = await db
    .select({ slug: schema.categories.slug })
    .from(schema.categories)
    .where(eq(schema.categories.id, categoryId))
    .limit(1)
  return hit?.slug ?? null
}

function revalidateToolSlug(slug: string | null | undefined) {
  if (!slug) return
  revalidatePath(`/product/${slug}`)
  revalidatePath(`/product/${slug}/og-image`)
}

function revalidateCategorySlug(slug: string | null | undefined) {
  if (!slug) return
  revalidatePath(`/category/${slug}`)
  revalidatePath(`/category/${slug}/og-image`)
}

function revalidateCategorySlugs(slugs: Array<string | null | undefined>) {
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidateCategorySlug(slug)
  }
}

function revalidateCatalogSurfaces() {
  revalidatePath('/')
  revalidatePath('/all-categories')
  revalidatePath('/market-map')
  revalidatePath('/search')
}

export async function createTool(_prev: ToolActionState, formData: FormData): Promise<ToolActionState> {
  const result = await withAdmin(async (admin): Promise<ToolActionState> => {
    const parsed = parseToolForm(formData)
    if (!parsed.success) {
      return {
        ok: false,
        message: 'Please fix the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    if (await slugInUse(parsed.data.slug)) {
      return { ok: false, message: 'That slug is already taken.', fieldErrors: { slug: ['taken'] } }
    }
    if (!(await categoryExists(parsed.data.categoryId))) {
      return { ok: false, message: 'Section not found.', fieldErrors: { categoryId: ['unknown'] } }
    }

    const db = await getDb()
    const id = crypto.randomUUID()
    const now = Date.now()
    const websiteUrl = normalizeHttpUrl(parsed.data.websiteUrl)!
    const logoUrl = parsed.data.logoUrl ? normalizeHttpUrl(parsed.data.logoUrl) : null
    const extraCategorySlugs = parseExtraSlugs(parsed.data.extraCategorySlugs)
    await db.insert(schema.tools).values({
      id,
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description,
      shortDesc: parsed.data.shortDesc || null,
      useCases: parseUseCases(parsed.data.useCases),
      websiteUrl,
      logoUrl,
      pricingModel: parsed.data.pricingModel,
      isFeatured: parsed.data.isFeatured,
      featuredOrder: parsed.data.isFeatured ? parseFeaturedOrder(parsed.data.featuredOrder) : null,
      categoryId: parsed.data.categoryId,
      extraCategorySlugs,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    })

    await audit({
      adminEmail: admin.email,
      action: 'create',
      entity: 'tool',
      entityId: id,
      diff: { slug: parsed.data.slug, name: parsed.data.name },
    })

    const categorySlug = await categorySlugById(parsed.data.categoryId)
    revalidatePath('/admin/tools')
    revalidatePath('/admin/dashboard')
    revalidateCatalogSurfaces()
    revalidateToolSlug(parsed.data.slug)
    revalidateCategorySlugs([categorySlug, ...(extraCategorySlugs ?? [])])
    return { ok: true, message: 'Created.' }
  })

  // If we got here with a non-error path, redirect. (Returning here causes the form to
  // re-render; that only happens on validation failure.)
  if ((result as ToolActionState).ok) {
    redirect('/admin/tools')
  }
  return result as ToolActionState
}

export async function updateTool(
  id: string,
  _prev: ToolActionState,
  formData: FormData,
): Promise<ToolActionState> {
  const result = await withAdmin(async (admin): Promise<ToolActionState> => {
    const parsed = parseToolForm(formData)
    if (!parsed.success) {
      return {
        ok: false,
        message: 'Please fix the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    if (await slugInUse(parsed.data.slug, id)) {
      return { ok: false, message: 'That slug is already taken.', fieldErrors: { slug: ['taken'] } }
    }
    if (!(await categoryExists(parsed.data.categoryId))) {
      return { ok: false, message: 'Section not found.', fieldErrors: { categoryId: ['unknown'] } }
    }

    const db = await getDb()
    const [before] = await db
      .select()
      .from(schema.tools)
      .where(eq(schema.tools.id, id))
      .limit(1)
    if (!before) return { ok: false, message: 'Tool not found.' }

    const websiteUrl = normalizeHttpUrl(parsed.data.websiteUrl)!
    const logoUrl = parsed.data.logoUrl ? normalizeHttpUrl(parsed.data.logoUrl) : null
    const extraCategorySlugs = parseExtraSlugs(parsed.data.extraCategorySlugs)

    await db
      .update(schema.tools)
      .set({
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        shortDesc: parsed.data.shortDesc || null,
        useCases: parseUseCases(parsed.data.useCases),
        websiteUrl,
        logoUrl,
        pricingModel: parsed.data.pricingModel,
        isFeatured: parsed.data.isFeatured,
        featuredOrder: parsed.data.isFeatured ? parseFeaturedOrder(parsed.data.featuredOrder) : null,
        categoryId: parsed.data.categoryId,
        extraCategorySlugs,
        updatedAt: Date.now(),
      })
      .where(eq(schema.tools.id, id))

    await audit({
      adminEmail: admin.email,
      action: 'update',
      entity: 'tool',
      entityId: id,
      diff: {
        before: { slug: before.slug, name: before.name, isFeatured: before.isFeatured },
        after: { slug: parsed.data.slug, name: parsed.data.name, isFeatured: parsed.data.isFeatured },
      },
    })

    const beforeCategorySlug = await categorySlugById(before.categoryId)
    const nextCategorySlug = await categorySlugById(parsed.data.categoryId)
    revalidatePath('/admin/tools')
    revalidatePath('/admin/dashboard')
    revalidateCatalogSurfaces()
    revalidateToolSlug(before.slug)
    revalidateToolSlug(parsed.data.slug)
    revalidateCategorySlugs([
      beforeCategorySlug,
      nextCategorySlug,
      ...(before.extraCategorySlugs ?? []),
      ...(extraCategorySlugs ?? []),
    ])
    return { ok: true, message: 'Saved.' }
  })

  if ((result as ToolActionState).ok) {
    redirect('/admin/tools')
  }
  return result as ToolActionState
}

export async function archiveTool(id: string): Promise<{ ok: boolean; message?: string }> {
  return (await withAdmin(async (admin) => {
    const db = await getDb()
    const [before] = await db.select().from(schema.tools).where(eq(schema.tools.id, id)).limit(1)
    if (!before) return { ok: false, message: 'Tool not found.' }
    if (before.archivedAt) return { ok: false, message: 'Already archived.' }

    await db.update(schema.tools).set({ archivedAt: Date.now() }).where(eq(schema.tools.id, id))
    await audit({
      adminEmail: admin.email,
      action: 'archive',
      entity: 'tool',
      entityId: id,
      diff: { slug: before.slug, name: before.name },
    })

    const categorySlug = await categorySlugById(before.categoryId)
    revalidatePath('/admin/tools')
    revalidatePath('/admin/dashboard')
    revalidateCatalogSurfaces()
    revalidateToolSlug(before.slug)
    revalidateCategorySlugs([categorySlug, ...(before.extraCategorySlugs ?? [])])
    return { ok: true }
  })) as { ok: boolean; message?: string }
}

export async function restoreTool(id: string): Promise<{ ok: boolean; message?: string }> {
  return (await withAdmin(async (admin) => {
    const db = await getDb()
    const [before] = await db.select().from(schema.tools).where(eq(schema.tools.id, id)).limit(1)
    if (!before) return { ok: false, message: 'Tool not found.' }
    if (!before.archivedAt) return { ok: false, message: 'Not archived.' }

    await db.update(schema.tools).set({ archivedAt: null }).where(eq(schema.tools.id, id))
    await audit({
      adminEmail: admin.email,
      action: 'update',
      entity: 'tool',
      entityId: id,
      diff: { restored: true },
    })

    const categorySlug = await categorySlugById(before.categoryId)
    revalidatePath('/admin/tools')
    revalidatePath('/admin/dashboard')
    revalidateCatalogSurfaces()
    revalidateToolSlug(before.slug)
    revalidateCategorySlugs([categorySlug, ...(before.extraCategorySlugs ?? [])])
    return { ok: true }
  })) as { ok: boolean; message?: string }
}
