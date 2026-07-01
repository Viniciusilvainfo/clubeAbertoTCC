const { query } = require('../config/database');

async function getFinancialReport(year) {
  const result = await query(
    `SELECT clubs.id, clubs.name, clubs.short_name,
            COALESCE(SUM(CASE WHEN financial_transactions.type = 'receita' THEN financial_transactions.amount END), 0) AS receita,
            COALESCE(SUM(CASE WHEN financial_transactions.type = 'despesa' THEN financial_transactions.amount END), 0) AS despesa
     FROM clubs
     LEFT JOIN financial_transactions
       ON financial_transactions.club_id = clubs.id
      AND financial_transactions.fiscal_year = $1
      AND financial_transactions.is_public = TRUE
     WHERE clubs.is_active = TRUE
     GROUP BY clubs.id, clubs.name, clubs.short_name`,
    [year]
  );
  return result.rows;
}

async function getClubSummary(clubId, year) {
  const result = await query(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'receita' THEN amount END), 0) AS receita,
      COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount END), 0) AS despesa,
      COALESCE(SUM(CASE WHEN type = 'investimento' THEN amount END), 0) AS investimento
     FROM financial_transactions
     WHERE club_id = $1 AND fiscal_year = $2 AND is_public = TRUE`,
    [clubId, year]
  );
  return result.rows[0] || { receita: 0, despesa: 0, investimento: 0 };
}

async function findClubById(id) {
  const result = await query('SELECT id, name, short_name FROM clubs WHERE id = $1', [id]);
  return result.rows[0] || null;
}

module.exports = { getFinancialReport, getClubSummary, findClubById };
