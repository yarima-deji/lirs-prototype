import db from '../db/index.js';

// Ensure the audit_logs table exists
export async function initAuditTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      action VARCHAR(20) NOT NULL,
      entity VARCHAR(50) NOT NULL,
      entity_id UUID NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
      details JSONB
    );
  `;
  await db.query(sql);
}

// Record an audit entry
export async function logAudit({ userId, action, entity, entityId, details }) {
  const sql = `
    INSERT INTO audit_logs
      (user_id, action, entity, entity_id, details)
    VALUES ($1, $2, $3, $4, $5);
  `;
  const params = [userId, action, entity, entityId, details || {}];
  await db.query(sql, params);
}

