const { query } = require('../config/database');

async function findByEmail(email) {
  const result = await query(
    'SELECT id, name, email, password_hash, role, club_id, is_active FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function create(name, email, passwordHash) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'fan')
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash]
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await query(
    `SELECT users.id, users.name, users.email, users.role, users.club_id, users.is_active, users.created_at,
            clubs.name AS club_name
     FROM users
     LEFT JOIN clubs ON clubs.id = users.club_id
     WHERE users.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { findByEmail, create, findById };
