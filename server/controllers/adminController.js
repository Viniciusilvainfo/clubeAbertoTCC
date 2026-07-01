const adminService = require('../services/adminService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
}

async function getDashboardStats(req, res) {
  try {
    return res.json(await adminService.getDashboardStats());
  } catch (err) {
    return handleError(res, err);
  }
}

async function validateTransaction(req, res) {
  try {
    return res.json(await adminService.validateTransaction(req.params.id, req.body.is_validated));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getPendingTransactions(req, res) {
  try {
    return res.json(await adminService.getPendingTransactions());
  } catch (err) {
    return handleError(res, err);
  }
}

async function getFinancialReport(req, res) {
  try {
    return res.json(await adminService.getFinancialReport(req.query.fiscal_year));
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { getDashboardStats, validateTransaction, getPendingTransactions, getFinancialReport };
