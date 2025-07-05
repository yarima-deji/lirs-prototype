import db from '../db/index.js';

// Initialize parcels table
export async function initParcelTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS parcels (
      id SERIAL PRIMARY KEY,
      parcel_id TEXT NOT NULL UNIQUE,
      owner_name TEXT NOT NULL,
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      area REAL,
      classification TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(sql);
}

// Create a new parcel
enexport async function createParcel({
  parcel_id,
  owner_name,
  latitude,
  longitude,
  area,
  classification,
}) {
  const sql = `
    INSERT INTO parcels
      (parcel_id, owner_name, latitude, longitude, area, classification)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [parcel_id, owner_name, latitude, longitude, area, classification];
  const result = await db.query(sql, values);
  return result.rows[0];
}

/**
 * Retrieve parcels, optionally filtered by parcel_id, owner_name, or a bounding box.
 * @param {Object} filters
 * @param {string} [filters.parcel_id]
 * @param {string} [filters.owner_name]
 * @param {number} [filters.minLat]
 * @param {number} [filters.maxLat]
 * @param {number} [filters.minLng]
 * @param {number} [filters.maxLng]
 */
export async function getParcels(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.parcel_id) {
    values.push(`%${filters.parcel_id}%`);
    conditions.push(`parcel_id ILIKE $${values.length}`);
  }
  if (filters.owner_name) {
    values.push(`%${filters.owner_name}%`);
    conditions.push(`owner_name ILIKE $${values.length}`);
  }
  if (filters.minLat != null && filters.maxLat != null) {
    values.push(filters.minLat, filters.maxLat);
    conditions.push(`latitude BETWEEN $${values.length - 1} AND $${values.length}`);
  }
  if (filters.minLng != null && filters.maxLng != null) {
    values.push(filters.minLng, filters.maxLng);
    conditions.push(`longitude BETWEEN $${values.length - 1} AND $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM parcels ${whereClause} ORDER BY created_at DESC;`;
  const result = await db.query(sql, values);
  return result.rows;
}

// Retrieve a single parcel by its UUID
export async function getParcelById(id) {
  const result = await db.query(
    'SELECT * FROM parcels WHERE id = $1;',
    [id]
  );
  return result.rows[0];
}

// Update specified fields on a parcel
export async function updateParcel(id, data) {
  // Build dynamic SET clause
  const fields = [];
  const values = [];
  let idx = 1;
  for (const [key, val] of Object.entries(data)) {
    fields.push(`${key} = $${idx}`);
    values.push(val);
    idx++;
  }
  // Always update `updated_at`
  fields.push(`updated_at = now()`);
  const sql = `
    UPDATE parcels
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *;
  `;
  values.push(id);
  const result = await db.query(sql, values);
  return result.rows[0];
}

// Soft‑delete: mark status = 'deleted'
export async function softDeleteParcel(id) {
  const result = await db.query(
    `UPDATE parcels
     SET status = 'deleted', updated_at = now()
     WHERE id = $1
     RETURNING *;`,
    [id]
  );
  return result.rows[0];
}
