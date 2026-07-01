const { query } = require('../config/database');

async function findAll(conditions, params) {
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const result = await query(
    `SELECT users.id, users.name, users.email, users.role, users.club_id, users.is_active, users.created_at,
            clubs.name AS club_name
     FROM users
     LEFT JOIN clubs ON clubs.id = users.club_id
     ${where}
     ORDER BY users.created_at DESC`,
    params
  );
  return result.rows;
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

async function findByEmail(email) {
  const result = await query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findRawById(id) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ name, email, password_hash, role, club_id }) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, club_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, club_id, is_active, created_at`,
    [name, email, password_hash, role, club_id || null]
  );
  return result.rows[0];
}

async function update(id, { name, email, role, club_id, is_active, password_hash }) {
  const result = await query(
    `UPDATE users SET name=$1, email=$2, role=$3, club_id=$4, is_active=$5, password_hash=$6
     WHERE id=$7 RETURNING id, name, email, role, club_id, is_active, created_at`,
    [name, email, role, club_id, is_active, password_hash, id]
  );
  return result.rows[0];
}

async function deactivate(id) {
  await query('UPDATE users SET is_active = FALSE WHERE id = $1', [id]);
}

module.exports = { findAll, findById, findByEmail, findRawById, create, update, deactivate };
