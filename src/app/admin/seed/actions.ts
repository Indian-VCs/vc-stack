'use server'

/**
 * Seed action — upserts STATIC_CATEGORIES + STATIC_TOOLS into D1.
 *
 * Idempotent: running it on a populated DB updates existing rows in place
 * without dropping admin-created data. Featured order is rewritten to mirror
 * FEATURED_TOOL_SLUGS each time.
 *
 * Uses D1's batch API in production so all 17 + 119 + clear + 5 statements
 * land in a handful of round-trips rather than 142 sequential ones — the
 * sequential pattern was hitting Cloudflare Worker time limits and crashing
 * mid-seed. Local SQLite (dev) doesn't expose batch(); we fall back to
 * sequential awaits there, which is fine because better-sqlite3 is sync-fast.
 */

import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdminAction, NotAuthenticatedError } from '@/lib/auth'
import { getDb, schema, type Db } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import {
  STATIC_CATEGORIES,
  STATIC_TOOLS,
  FEATURED_TOOL_SLUGS,
} from '@/lib/static-catalog'

export type SeedResult =
  | { ok: true; categories: number; tools: number; featured: number }
  | { ok: false; message: string }

// D1's batch ceiling is 100 statements per call; we leave headroom.
const BATCH_CHUNK = 50

type Statement = unknown

async function runBatched(db: Db, statements: Statement[]): Promise<void> {
  if (statements.length === 0) return
  const dbAny = db as unknown as {
    batch?: (stmts: [Statement, ...Statement[]]) => Promise<unknown>
  }
  if (typeof dbAny.batch === 'function') {
    for (let i = 0; i < statements.length; i += BATCH_CHUNK) {
      const chunk = statements.slice(i, i + BATCH_CHUNK)
      if (chunk.length === 0) continue
      await dbAny.batch(chunk as [Statement, ...Statement[]])
    }
  } else {
    for (const stmt of statements) {
      await (stmt as Promise<unknown>)
    }
  }
}

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

  try {
    return await runSeed(admin)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[seed] failed', { message, err })
    return { ok: false, message: `Seed failed: ${message.slice(0, 400)}` }
  }
}

async function runSeed(admin: { email: string }): Promise<SeedResult> {
  const db = await getDb()
  const now = Date.now()

  // ── 1. Categories upsert (one batched round-trip) ──
  const catStatements = STATIC_CATEGORIES.map((c, i) => {
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
    return db
      .insert(schema.categories)
      .values(row)
      .onConflictDoUpdate({
        target: schema.categories.id,
        set: { ...row, createdAt: undefined as never },
      })
  })

  // ── 2. Tools upsert (chunked into batches of 50) ──
  const toolStatements = STATIC_TOOLS.map((t) => {
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
    return db
      .insert(schema.tools)
      .values(row)
      .onConflictDoUpdate({
        target: schema.tools.id,
        set: { ...row, createdAt: undefined as never },
      })
  })

  // ── 3. Reset + re-apply the canonical Featured order ──
  const featuredStatements: Statement[] = [
    db
      .update(schema.tools)
      .set({ featuredOrder: null, isFeatured: false, updatedAt: now })
      .where(sql`${schema.tools.featuredOrder} IS NOT NULL OR ${schema.tools.isFeatured} = 1`),
    ...FEATURED_TOOL_SLUGS.map((slug, i) =>
      db
        .update(schema.tools)
        .set({ featuredOrder: i, isFeatured: true, updatedAt: now })
        .where(eq(schema.tools.slug, slug)),
    ),
  ]

  await runBatched(db, catStatements)
  await runBatched(db, toolStatements)
  await runBatched(db, featuredStatements)

  await audit({
    adminEmail: admin.email,
    action: 'create',
    entity: 'tool',
    entityId: null,
    diff: {
      seed: true,
      categories: STATIC_CATEGORIES.length,
      tools: STATIC_TOOLS.length,
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
    categories: STATIC_CATEGORIES.length,
    tools: STATIC_TOOLS.length,
    featured: FEATURED_TOOL_SLUGS.length,
  }
}
