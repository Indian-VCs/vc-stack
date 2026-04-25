/**
 * Audit log helper — every admin write goes through here.
 *
 * Why: a tamper-evident trail of who did what and when. If a credential is
 * compromised, the audit log shows the blast radius. If two admins disagree
 * about a change, the log settles it.
 *
 * Failures are swallowed and logged to console — auditing should never block
 * the user-facing action. (If audit writes start failing systematically, the
 * Cloudflare logs will show it.)
 */

import { getDb, schema } from '@/lib/db/client'
import type { AuditLogRow } from '@/lib/db/schema'

type AuditAction = AuditLogRow['action']
type AuditEntity = AuditLogRow['entity']

interface AuditEntry {
  adminEmail: string
  action: AuditAction
  entity: AuditEntity
  entityId?: string | null
  /** Compact diff: `{ before, after }` or `{ fields: [...] }` or `{ failed: true, reason }` for login failures. */
  diff?: Record<string, unknown> | null
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const db = await getDb()
    await db.insert(schema.auditLog).values({
      adminEmail: entry.adminEmail,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      diff: entry.diff ?? null,
      createdAt: Date.now(),
    })
  } catch (err) {
    console.error('[audit] failed to log entry', { entry, err })
  }
}

/** Recent audit entries for the admin dashboard. */
export async function recentAudit(limit = 50): Promise<AuditLogRow[]> {
  const db = await getDb()
  const rows = await db.query.auditLog.findMany({
    orderBy: (log, { desc }) => [desc(log.createdAt)],
    limit,
  })
  return rows
}

/** Convenience wrapper: log a failed login attempt with the supplied identity. */
export async function auditFailedLogin(email: string, reason: string): Promise<void> {
  await audit({
    adminEmail: email || '<empty>',
    action: 'login',
    entity: 'session',
    diff: { failed: true, reason },
  })
}

export async function auditSuccessfulLogin(email: string): Promise<void> {
  await audit({ adminEmail: email, action: 'login', entity: 'session', diff: { failed: false } })
}
