const { query } = require('../config/database');

async function countTransactions(conditions, params) {
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const result = await query(
    `SELECT COUNT(*) FROM financial_transactions ${where}`,
    params
  );
  return parseInt(result.rows[0].count);
}

async function findTransactions(conditions, params, limit, offset) {
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const i = params.length + 1;
  const result = await query(
    `SELECT financial_transactions.id, financial_transactions.club_id, clubs.name AS club_name, financial_transactions.category_id,
            financial_categories.name AS category_name, financial_transactions.type, financial_transactions.description,
            financial_transactions.amount, financial_transactions.date, financial_transactions.fiscal_year, financial_transactions.source, financial_transactions.is_validated, financial_transactions.created_at
     FROM financial_transactions
     LEFT JOIN clubs ON clubs.id = financial_transactions.club_id
     LEFT JOIN financial_categories ON financial_categories.id = financial_transactions.category_id
     ${where}
     ORDER BY financial_transactions.date DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    [...params, limit, offset]
  );
  return result.rows;
}

async function findById(id) {
  const result = await query(
    `SELECT financial_transactions.*, clubs.name AS club_name, financial_categories.name AS category_name
     FROM financial_transactions
     LEFT JOIN clubs ON clubs.id = financial_transactions.club_id
     LEFT JOIN financial_categories ON financial_categories.id = financial_transactions.category_id
     WHERE financial_transactions.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function create({ club_id, category_id, type, description, amount, date, fiscal_year, is_public, source, notes, created_by }) {
  const result = await query(
    `INSERT INTO financial_transactions
     (club_id, category_id, type, description, amount, date, fiscal_year, is_public, source, notes, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [club_id, category_id || null, type, description, amount, date, fiscal_year, is_public, source, notes, created_by]
  );
  return result.rows[0];
}

async function update(id, { category_id, type, description, amount, date, fiscal_year, is_public, source, notes, is_validated }) {
  const result = await query(
    `UPDATE financial_transactions SET
     category_id=$1, type=$2, description=$3, amount=$4, date=$5,
     fiscal_year=$6, is_public=$7, source=$8, notes=$9, is_validated=$10
     WHERE id=$11 RETURNING *`,
    [category_id, type, description, amount, date, fiscal_year, is_public, source, notes, is_validated, id]
  );
  return result.rows[0];
}

async function remove(id) {
  await query('DELETE FROM financial_transactions WHERE id = $1', [id]);
}

async function listCategories() {
  const result = await query(
    'SELECT * FROM financial_categories WHERE is_active = TRUE ORDER BY type, name'
  );
  return result.rows;
}

async function compareClubs(clubIds, year, includeUnvalidated = false) {
  const validationClause = includeUnvalidated ? '' : ' AND financial_transactions.is_validated = TRUE';
  const result = await query(
    `SELECT clubs.id, clubs.name, clubs.short_name, financial_transactions.type, SUM(financial_transactions.amount) AS total
     FROM clubs
     LEFT JOIN financial_transactions ON financial_transactions.club_id = clubs.id
       AND financial_transactions.fiscal_year = $1 AND financial_transactions.is_public = TRUE${validationClause}
     WHERE clubs.id = ANY($2::uuid[])
     GROUP BY clubs.id, clubs.name, clubs.short_name, financial_transactions.type
     ORDER BY clubs.name`,
    [year, clubIds]
  );
  return result.rows;
}

async function getMonthlyBreakdown(clubId, fiscalYear, includeUnvalidated = false) {
  const validationClause = includeUnvalidated ? '' : ' AND is_validated = TRUE';
  const result = await query(
    `SELECT EXTRACT(MONTH FROM date) AS month, type, SUM(amount) AS total
     FROM financial_transactions
     WHERE club_id = $1 AND fiscal_year = $2 AND is_public = TRUE${validationClause}
     GROUP BY month, type
     ORDER BY month`,
    [clubId, fiscalYear]
  );
  return result.rows;
}

async function getCategoryBreakdown(clubId, fiscalYear, type, includeUnvalidated = false) {
  const validationClause = includeUnvalidated ? '' : ' AND financial_transactions.is_validated = TRUE';
  const result = await query(
    `SELECT financial_categories.name AS category, SUM(financial_transactions.amount) AS total
     FROM financial_transactions
     LEFT JOIN financial_categories ON financial_categories.id = financial_transactions.category_id
     WHERE financial_transactions.club_id = $1 AND financial_transactions.fiscal_year = $2 AND financial_transactions.type = $3 AND financial_transactions.is_public = TRUE${validationClause}
     GROUP BY financial_categories.name
     ORDER BY total DESC`,
    [clubId, fiscalYear, type]
  );
  return result.rows;
}

module.exports = {
  countTransactions,
  findTransactions,
  findById,
  create,
  update,
  remove,
  listCategories,
  compareClubs,
  getMonthlyBreakdown,
  getCategoryBreakdown,
};
