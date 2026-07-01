const financialService = require('../services/financialService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
}

async function listTransactions(req, res) {
  try {
    return res.json(await financialService.listTransactions(req.query, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getTransaction(req, res) {
  try {
    return res.json(await financialService.getTransaction(req.params.id, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function createTransaction(req, res) {
  try {
    return res.status(201).json(await financialService.createTransaction(req.body, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function updateTransaction(req, res) {
  try {
    return res.json(await financialService.updateTransaction(req.params.id, req.body, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function deleteTransaction(req, res) {
  try {
    await financialService.deleteTransaction(req.params.id, req.user);
    return res.json({ message: 'Transação removida com sucesso.' });
  } catch (err) {
    return handleError(res, err);
  }
}

async function listCategories(req, res) {
  try {
    return res.json(await financialService.listCategories());
  } catch (err) {
    return handleError(res, err);
  }
}

async function compareClubs(req, res) {
  try {
    return res.json(await financialService.compareClubs(req.query.clubs, req.query.fiscal_year, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getMonthlyBreakdown(req, res) {
  try {
    return res.json(await financialService.getMonthlyBreakdown(req.params.club_id, req.params.fiscal_year, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getCategoryBreakdown(req, res) {
  try {
    return res.json(await financialService.getCategoryBreakdown(req.params.club_id, req.params.fiscal_year, req.params.type, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listCategories,
  compareClubs,
  getMonthlyBreakdown,
  getCategoryBreakdown,
};
