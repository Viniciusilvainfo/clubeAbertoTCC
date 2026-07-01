const { query } = require('../config/database');

async function countClubs() {
  const result = await query('SELECT COUNT(*) FROM clubs WHERE is_active = TRUE');
  return parseInt(result.rows[0].count);
}

async function countUsers() {
  const result = await query('SELECT COUNT(*) FROM users WHERE is_active = TRUE');
  return parseInt(result.rows[0].count);
}

async function countTransactionsAndSum() {
  const result = await query('SELECT COUNT(*), SUM(amount) FROM financial_transactions');
  return { count: parseInt(result.rows[0].count), sum: parseFloat(result.rows[0].sum || 0) };
}

async function countPendingSuggestions() {
  const result = await query("SELECT COUNT(*) FROM suggestions WHERE status = 'pending'");
  return parseInt(result.rows[0].count);
}

async function countPendingValidation() {
  const result = await query('SELECT COUNT(*) FROM financial_transactions WHERE is_validated = FALSE');
  return parseInt(result.rows[0].count);
}

async function setTransactionValidation(id, isValidated) {
  const result = await query(
    'UPDATE financial_transactions SET is_validated=$1 WHERE id=$2 RETURNING *',
    [isValidated, id]
  );
  return result.rows[0] || null;
}

async function findPendingTransactions() {
  const result = await query(
    `SELECT financial_transactions.*, clubs.name AS club_name, financial_categories.name AS category_name
     FROM financial_transactions
     LEFT JOIN clubs ON clubs.id = financial_transactions.club_id
     LEFT JOIN financial_categories ON financial_categories.id = financial_transactions.category_id
     WHERE financial_transactions.is_validated = FALSE
     ORDER BY financial_transactions.created_at DESC`
  );
  return result.rows;
}

async function getFinancialReport(year) {
  const result = await query(
    `SELECT clubs.name AS club_name, clubs.short_name, financial_transactions.type, SUM(financial_transactions.amount) AS total
     FROM clubs
     LEFT JOIN financial_transactions ON financial_transactions.club_id = clubs.id AND financial_transactions.fiscal_year = $1
     WHERE clubs.is_active = TRUE
     GROUP BY clubs.id, clubs.name, clubs.short_name, financial_transactions.type
     ORDER BY clubs.name`,
    [year]
  );
  return result.rows;
}

module.exports = {
  countClubs,
  countUsers,
  countTransactionsAndSum,
  countPendingSuggestions,
  countPendingValidation,
  setTransactionValidation,
  findPendingTransactions,
  getFinancialReport,
};
