'use server'

/**
 * Seed action — upserts STATIC_CATEGORIES + STATIC_TOOLS into D1.
 *
 * Idempotent: running it on a populated DB updates existing rows in place
 * without dropping admin-created data. Featured order is rewritten to mirror
 * FEATURED_TOOL_SLUGS each time.
 *
 * Mirrors scripts/seed.ts but talks to the live D1 binding instead of
 * better-sqlite3, so it works in production without wrangler access.
 */

import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
} from '@/lib/static-catalog'

export type SeedResult =
  | { ok: true; categories: number; tools: number; featured: number }
  | { ok: false; message: string }

export async function seedFromStaticCatalog(): Promise<SeedResult> {
  let admin: { email: string }
  try {
    admin = await requireAdminAction()
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      return { ok: false, message: 'Sign in again.' }
    }
    throw err
  }

  const db = await getDb()
  const now = Date.now()

  let catUpserts = 0
  for (let i = 0; i < STATIC_CATEGORIES.length; i++) {
    const c = STATIC_CATEGORIES[i]
    const row = {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? null,
      icon: c.icon ?? null,
      imageUrl: c.imageUrl ?? null,
      intro: c.intro ?? null,
      buyingCriteria: c.buyingCriteria ?? null,
      relatedSlugs: c.relatedSlugs ?? null,
      seoTitle: c.seoTitle ?? null,
      seoDescription: c.seoDescription ?? null,
      heroAngle: c.heroAngle ?? null,
      sortOrder: i,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    await db
      .insert(schema.categories)
      .values(row)
      .onConflictDoUpdate({
        target: schema.categories.id,
        set: { ...row, createdAt: undefined as never },
      })
    catUpserts++
  }

  let toolUpserts = 0
  for (const t of STATIC_TOOLS) {
    const row = {
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      shortDesc: t.shortDesc ?? null,
      useCases: t.useCases ?? null,
      websiteUrl: t.websiteUrl,
      logoUrl: t.logoUrl ?? null,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      featuredOrder: null as number | null,
      categoryId: t.categoryId,
      extraCategorySlugs: t.extraCategorySlugs ?? null,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    await db
      .insert(schema.tools)
      .values(row)
      .onConflictDoUpdate({
        target: schema.tools.id,
        set: { ...row, createdAt: undefined as never },
      })
    toolUpserts++
  }

  // Re-apply the canonical Featured order. Clear all flags first, then set
  // the listed slugs in order.
  await db
    .update(schema.tools)
    .set({ featuredOrder: null, isFeatured: false, updatedAt: now })
    .where(sql`${schema.tools.featuredOrder} IS NOT NULL OR ${schema.tools.isFeatured} = 1`)

  for (let i = 0; i < FEATURED_TOOL_SLUGS.length; i++) {
    await db
      .update(schema.tools)
      .set({ featuredOrder: i, isFeatured: true, updatedAt: now })
      .where(eq(schema.tools.slug, FEATURED_TOOL_SLUGS[i]))
  }

  await audit({
    adminEmail: admin.email,
    action: 'create',
    entity: 'tool',
    entityId: null,
    diff: {
      seed: true,
      categories: catUpserts,
      tools: toolUpserts,
      featured: FEATURED_TOOL_SLUGS.length,
    },
  })

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/seed')
  revalidatePath('/admin/tools')
  revalidatePath('/admin/categories')
  revalidatePath('/admin/featured')
  revalidatePath('/')

  return {
    ok: true,
    categories: catUpserts,
    tools: toolUpserts,
    featured: FEATURED_TOOL_SLUGS.length,
  }
}
