const repo = require('../repositories/financialRepository');

function canSeeUnvalidated(user) {
  return user && ['club_admin', 'platform_admin'].includes(user.role);
}

async function listTransactions({ club_id, type, fiscal_year, page = 1, limit = 20 }, user) {
  const conditions = [];
  const params = [];
  let i = 1;

  if (!canSeeUnvalidated(user)) {
    conditions.push('financial_transactions.is_public = TRUE');
    conditions.push('financial_transactions.is_validated = TRUE');
  }

  if (club_id) { conditions.push(`financial_transactions.club_id = $${i++}`); params.push(club_id); }
  if (type) { conditions.push(`financial_transactions.type = $${i++}`); params.push(type); }
  if (fiscal_year) { conditions.push(`financial_transactions.fiscal_year = $${i++}`); params.push(parseInt(fiscal_year)); }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const [total, data] = await Promise.all([
    repo.countTransactions(conditions, params),
    repo.findTransactions(conditions, params, limitNum, offset),
  ]);

  return { data, meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } };
}

async function getTransaction(id, user) {
  const tx = await repo.findById(id);
  if (!tx) throw { status: 404, message: 'Transação não encontrada.' };
  if ((!canSeeUnvalidated(user) && !tx.is_validated) || (!tx.is_public && (!user || user.role === 'fan'))) {
    throw { status: 403, message: 'Acesso negado.' };
  }
  return tx;
}

async function createTransaction(body, user) {
  const { club_id, category_id, type, description, amount, date, fiscal_year, is_public, source, notes } = body;

  if (user.role === 'club_admin' && user.club_id !== club_id) {
    throw { status: 403, message: 'Acesso negado.' };
  }
  if (!club_id || !type || !description || !amount || !date || !fiscal_year) {
    throw { status: 400, message: 'Campos obrigatórios faltando.' };
  }

  return repo.create({
    club_id, category_id, type, description, amount, date, fiscal_year,
    is_public: is_public ?? true, source, notes, created_by: user.id,
  });
}

async function updateTransaction(id, body, user) {
  const tx = await repo.findById(id);
  if (!tx) throw { status: 404, message: 'Transação não encontrada.' };
  if (user.role === 'club_admin' && user.club_id !== tx.club_id) {
    throw { status: 403, message: 'Acesso negado.' };
  }

  return repo.update(id, {
    category_id: body.category_id ?? tx.category_id,
    type: body.type ?? tx.type,
    description: body.description ?? tx.description,
    amount: body.amount ?? tx.amount,
    date: body.date ?? tx.date,
    fiscal_year: body.fiscal_year ?? tx.fiscal_year,
    is_public: body.is_public ?? tx.is_public,
    source: body.source ?? tx.source,
    notes: body.notes ?? tx.notes,
    is_validated: user.role === 'platform_admin' ? (body.is_validated ?? tx.is_validated) : tx.is_validated,
  });
}

async function deleteTransaction(id, user) {
  const tx = await repo.findById(id);
  if (!tx) throw { status: 404, message: 'Transação não encontrada.' };
  if (user.role === 'club_admin' && user.club_id !== tx.club_id) {
    throw { status: 403, message: 'Acesso negado.' };
  }
  await repo.remove(id);
}

async function listCategories() {
  return repo.listCategories();
}

async function compareClubs(clubs, fiscal_year, user) {
  if (!clubs) throw { status: 400, message: 'Informe os IDs dos clubes.' };
  const clubIds = clubs.split(',').slice(0, 5);
  const year = fiscal_year ? parseInt(fiscal_year) : new Date().getFullYear();

  const rows = await repo.compareClubs(clubIds, year, canSeeUnvalidated(user));

  const map = {};
  rows.forEach((row) => {
    if (!map[row.id]) {
      map[row.id] = { id: row.id, name: row.name, short_name: row.short_name, receita: 0, despesa: 0, investimento: 0 };
    }
    if (row.type) map[row.id][row.type] = parseFloat(row.total || 0);
  });

  const data = Object.values(map).map((c) => ({ ...c, saldo: c.receita - c.despesa }));
  return { fiscal_year: year, data };
}

async function getMonthlyBreakdown(club_id, fiscal_year, user) {
  const rows = await repo.getMonthlyBreakdown(club_id, parseInt(fiscal_year), canSeeUnvalidated(user));
  const months = {};
  for (let m = 1; m <= 12; m++) {
    months[m] = { month: m, receita: 0, despesa: 0, investimento: 0 };
  }
  rows.forEach((row) => { months[parseInt(row.month)][row.type] = parseFloat(row.total); });
  return Object.values(months);
}

async function getCategoryBreakdown(club_id, fiscal_year, type, user) {
  return repo.getCategoryBreakdown(club_id, parseInt(fiscal_year), type, canSeeUnvalidated(user));
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
