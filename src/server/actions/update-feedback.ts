'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { and, eq, gte } from 'drizzle-orm'
import { check } from '@/lib/rate-limit'
import { getDb, schema } from '@/lib/db/client'

// ── IP helpers ────────────────────────────────────────────────────────────────

async function getClientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('cf-connecting-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  )
}

async function hashIp(ip: string): Promise<string> {
  // Salted SHA-256 truncated to 32 hex chars. Enough for a per-IP fingerprint
  // suitable for dedupe + abuse triage; never reversible to the raw IP.
  const enc = new TextEncoder().encode(`vc-stack:${ip}`)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── requestUpdate (one-click) ────────────────────────────────────────────────
//
// Inserts a kind='request' row. Server-side 24h dedupe per (toolSlug, ipHash)
// prevents button-mashing inflating the count. Always returns ok:true on
// dedupe hits — the user sees the same "Flagged" UX whether their click
// landed a row or not.

export type RequestUpdateState = { ok: boolean; message?: string }

export async function requestUpdate(toolSlug: string): Promise<RequestUpdateState> {
  if (typeof toolSlug !== 'string' || toolSlug.length === 0 || toolSlug.length > 200) {
    return { ok: false, message: 'Invalid tool.' }
  }

  const ip = await getClientIp()
  const rl = check(`request-update:${ip}`, 30, 60 * 60 * 1000)
  if (!rl.allowed) {
    return { ok: false, message: 'Too many requests. Try again in a bit.' }
  }

  const ipHash = await hashIp(ip)

  try {
    const db = await getDb()
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    const existing = await db
      .select({ id: schema.updateFeedback.id })
      .from(schema.updateFeedback)
      .where(
        and(
          eq(schema.updateFeedback.toolSlug, toolSlug),
          eq(schema.updateFeedback.kind, 'request'),
          eq(schema.updateFeedback.ipHash, ipHash),
          gte(schema.updateFeedback.createdAt, cutoff),
        ),
      )
      .limit(1)

    if (existing.length > 0) {
      return { ok: true, message: 'Already flagged today — thanks.' }
    }

    await db.insert(schema.updateFeedback).values({
      id: crypto.randomUUID(),
      toolSlug,
      kind: 'request',
      fieldArea: null,
      suggestion: null,
      submitterEmail: null,
      submitterRole: null,
      ipHash,
      status: 'pending',
      adminNotes: null,
      createdAt: Date.now(),
      reviewedAt: null,
    })
    return { ok: true, message: 'Flagged for review — thanks.' }
  } catch (err) {
    console.error('[requestUpdate] DB write failed', err)
    return { ok: false, message: 'Could not save right now. Try again in a minute.' }
  }
}

// ─── submitUpdateSuggestion (form) ────────────────────────────────────────────

const submitUpdateSchema = z.object({
  toolSlug: z.string().trim().min(1, 'Please pick a tool').max(200),
  fieldArea: z.enum([
    'description',
    'pricing',
    'logo',
    'use_cases',
    'key_features',
    'broken_link',
    'other',
  ]),
  suggestion: z
    .string()
    .trim()
    .min(20, 'Tell us a little more — at least 20 characters')
    .max(2000, 'Keep it under 2000 characters'),
  submitterEmail: z.string().trim().toLowerCase().email('Please enter a valid email').max(200),
  submitterRole: z.enum(['gp', 'analyst', 'operator', 'founder', 'other']).optional(),
})

export type SubmitUpdateState = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof z.infer<typeof submitUpdateSchema>, string[]>>
}

export async function submitUpdateSuggestion(
  _prev: SubmitUpdateState,
  formData: FormData,
): Promise<SubmitUpdateState> {
  const ip = await getClientIp()
  const rl = check(`suggest-update:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) {
    return {
      success: false,
      message: 'Too many submissions in the last hour. Try again later.',
    }
  }

  const raw = {
    toolSlug: formData.get('toolSlug'),
    fieldArea: formData.get('fieldArea'),
    suggestion: formData.get('suggestion'),
    submitterEmail: formData.get('submitterEmail'),
    submitterRole: formData.get('submitterRole') || undefined,
  }

  const parsed = submitUpdateSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as SubmitUpdateState['errors'],
    }
  }

  const ipHash = await hashIp(ip)

  try {
    const db = await getDb()
    await db.insert(schema.updateFeedback).values({
      id: crypto.randomUUID(),
      toolSlug: parsed.data.toolSlug,
      kind: 'suggestion',
      fieldArea: parsed.data.fieldArea,
      suggestion: parsed.data.suggestion,
      submitterEmail: parsed.data.submitterEmail,
      submitterRole: parsed.data.submitterRole ?? null,
      ipHash,
      status: 'pending',
      adminNotes: null,
      createdAt: Date.now(),
      reviewedAt: null,
    })
  } catch (err) {
    console.error('[submitUpdateSuggestion] DB write failed', err)
    return {
      success: false,
      message:
        "Couldn't save your suggestion right now. Try again in a minute, or email support@indianvcs.com.",
    }
  }

  return {
    success: true,
    message:
      'Thanks — suggestion received. An editor will review it within a few days. Reply to your confirmation email for follow-up.',
  }
}
