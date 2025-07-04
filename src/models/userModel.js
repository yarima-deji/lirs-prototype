import db from '../db/index.js';

// Called at startup to ensure table exists
export async function initUserTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await db.query(createTableSQL);
}

export async function createUser(username, passwordHash) {
  const result = await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role, created_at',
    [username, passwordHash]
  );
  return result.rows[0];
}

export async function getUserByUsername(username) {
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
}
