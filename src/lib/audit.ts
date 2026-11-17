import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { db } from "@/src/lib/db";

// Fields come straight from the generated Prisma input type, so this helper
// cannot drift from the AuditLog model in prisma/schema.prisma.
export type AuditLogFields = Pick<
  Prisma.AuditLogUncheckedCreateInput,
  "actorId" | "action" | "targetType" | "targetId" | "meta"
>;

/**
 * Records a single action in the audit log.
 *
 * Auditing must never break the action it records, so every failure is
 * reported on the server and swallowed instead of thrown at the caller.
 */
export async function logAudit({
  actorId,
  action,
  targetType,
  targetId,
  meta,
}: AuditLogFields): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: actorId ?? null,
        action,
        targetType,
        targetId,
        meta,
      },
    });
  } catch (error) {
    // Keep this short and free of row contents: meta may hold user data.
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(`[audit] could not record "${action}" on ${targetType}: ${reason}`);
  }
}
