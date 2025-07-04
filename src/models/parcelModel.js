import db from '../db/index.js';

// Initialize parcels table
// src/models/parcelModel.js
export async function createParcel({
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

// CRUD function stubs
export async function createParcel(data) { /* TODO */ }
export async function getParcels(filters) { /* TODO */ }
export async function getParcelById(id) { /* TODO */ }
export async function updateParcel(id, data) { /* TODO */ }
export async function softDeleteParcel(id) { /* TODO */ }

