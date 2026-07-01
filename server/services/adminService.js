const repo = require('../repositories/adminRepository');

async function getDashboardStats() {
  const [clubs, users, txData, pendingSuggestions, pendingValidation] = await Promise.all([
    repo.countClubs(),
    repo.countUsers(),
    repo.countTransactionsAndSum(),
    repo.countPendingSuggestions(),
    repo.countPendingValidation(),
  ]);

  return {
    total_clubs: clubs,
    total_users: users,
    total_transactions: txData.count,
    total_amount: txData.sum,
    pending_suggestions: pendingSuggestions,
    pending_validation: pendingValidation,
  };
}

async function validateTransaction(id, isValidated) {
  const result = await repo.setTransactionValidation(id, isValidated);
  if (!result) throw { status: 404, message: 'Transação não encontrada.' };
  return result;
}

async function getPendingTransactions() {
  return repo.findPendingTransactions();
}

async function getFinancialReport(fiscal_year) {
  const year = fiscal_year ? parseInt(fiscal_year) : new Date().getFullYear();
  const rows = await repo.getFinancialReport(year);

  const report = {};
  rows.forEach((row) => {
    if (!report[row.club_name]) {
      report[row.club_name] = { club_name: row.club_name, short_name: row.short_name, receita: 0, despesa: 0, investimento: 0 };
    }
    if (row.type) report[row.club_name][row.type] = parseFloat(row.total || 0);
  });

  const data = Object.values(report).map((c) => ({ ...c, saldo: c.receita - c.despesa }));
  return { fiscal_year: year, data };
}

module.exports = { getDashboardStats, validateTransaction, getPendingTransactions, getFinancialReport };
