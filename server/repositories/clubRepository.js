const { query } = require('../config/database');

async function findAll() {
  const result = await query(
    `SELECT id, name, short_name, founded_year, city, state, stadium, description, logo_url, created_at
     FROM clubs WHERE is_active = TRUE ORDER BY name`
  );
  return result.rows;
}

async function findById(id) {
  const result = await query(
    `SELECT id, name, short_name, founded_year, city, state, stadium, description, logo_url, created_at
     FROM clubs WHERE id = $1 AND is_active = TRUE`,
    [id]
  );
  return result.rows[0] || null;
}

async function findRawById(id) {
  const result = await query('SELECT * FROM clubs WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ name, short_name, founded_year, city, state, stadium, description, logo_url }) {
  const result = await query(
    `INSERT INTO clubs (name, short_name, founded_year, city, state, stadium, description, logo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, short_name, founded_year || null, city, state, stadium, description, logo_url]
  );
  return result.rows[0];
}

async function update(id, { name, short_name, founded_year, city, state, stadium, description, logo_url }) {
  const result = await query(
    `UPDATE clubs SET name=$1, short_name=$2, founded_year=$3, city=$4, state=$5,
     stadium=$6, description=$7, logo_url=$8
     WHERE id=$9 RETURNING *`,
    [name, short_name, founded_year, city, state, stadium, description, logo_url, id]
  );
  return result.rows[0];
}

async function deactivate(id) {
  await query('UPDATE clubs SET is_active = FALSE WHERE id = $1', [id]);
}

async function getSummary(clubId, fiscalYear, includeUnvalidated = false) {
  const validationClause = includeUnvalidated ? '' : ' AND is_validated = TRUE';
  const result = await query(
    `SELECT type, SUM(amount) AS total, COUNT(*) AS count
     FROM financial_transactions
     WHERE club_id = $1 AND fiscal_year = $2 AND is_public = TRUE${validationClause}
     GROUP BY type`,
    [clubId, fiscalYear]
  );
  return result.rows;
}

async function getYears(clubId, includeUnvalidated = false) {
  const validationClause = includeUnvalidated ? '' : ' AND is_validated = TRUE';
  const result = await query(
    `SELECT DISTINCT fiscal_year FROM financial_transactions
     WHERE club_id = $1 AND is_public = TRUE${validationClause} ORDER BY fiscal_year DESC`,
    [clubId]
  );
  return result.rows.map((r) => r.fiscal_year);
}

module.exports = { findAll, findById, findRawById, create, update, deactivate, getSummary, getYears };
