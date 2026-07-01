const { query } = require('../config/database');

async function findAll(conditions, params) {
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const result = await query(
    `SELECT suggestions.*, users.name AS user_name, clubs.name AS club_name
     FROM suggestions
     LEFT JOIN users ON users.id = suggestions.user_id
     LEFT JOIN clubs ON clubs.id = suggestions.club_id
     ${where}
     ORDER BY suggestions.created_at DESC`,
    params
  );
  return result.rows;
}

async function create({ user_id, club_id, title, description, value }) {
  const result = await query(
    `INSERT INTO suggestions (user_id, club_id, title, description, value)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, club_id, title, description, value || null]
  );
  return result.rows[0];
}

async function review(id, { status, admin_notes, reviewed_by }) {
  const result = await query(
    `UPDATE suggestions SET status=$1, admin_notes=$2, reviewed_by=$3, reviewed_at=NOW()
     WHERE id=$4 RETURNING *`,
    [status, admin_notes, reviewed_by, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  await query('DELETE FROM suggestions WHERE id = $1', [id]);
}

module.exports = { findAll, create, review, remove };
