import db from '../db/index.js';

// Initialize parcels table
export async function initParcelTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS parcels (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      parcel_id VARCHAR(50) UNIQUE NOT NULL,
      owner_name VARCHAR(100) NOT NULL,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      area DOUBLE PRECISION,
      classification VARCHAR(50),
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await db.query(sql);
}

// CRUD function stubs
export async function createParcel(data) { /* TODO */ }
export async function getParcels(filters) { /* TODO */ }
export async function getParcelById(id) { /* TODO */ }
export async function updateParcel(id, data) { /* TODO */ }
export async function softDeleteParcel(id) { /* TODO */ }

