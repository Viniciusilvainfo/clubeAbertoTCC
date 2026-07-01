const repo = require('../repositories/suggestionRepository');

async function listSuggestions({ club_id, status }, user) {
  const conditions = [];
  const params = [];
  let i = 1;

  if (user.role === 'club_admin') {
    conditions.push(`suggestions.club_id = $${i++}`);
    params.push(user.club_id);
  } else if (club_id) {
    conditions.push(`suggestions.club_id = $${i++}`);
    params.push(club_id);
  }

  if (status) {
    conditions.push(`suggestions.status = $${i++}`);
    params.push(status);
  }

  return repo.findAll(conditions, params);
}

async function createSuggestion({ club_id, title, description, value }, user) {
  if (!club_id || !title || !description) {
    throw { status: 400, message: 'Clube, título e descrição são obrigatórios.' };
  }
  return repo.create({ user_id: user?.id || null, club_id, title, description, value });
}

async function reviewSuggestion(id, { status, admin_notes }, userId) {
  if (!['approved', 'rejected'].includes(status)) {
    throw { status: 400, message: 'Status inválido.' };
  }
  const result = await repo.review(id, { status, admin_notes, reviewed_by: userId });
  if (!result) throw { status: 404, message: 'Sugestão não encontrada.' };
  return result;
}

async function deleteSuggestion(id) {
  await repo.remove(id);
}

module.exports = { listSuggestions, createSuggestion, reviewSuggestion, deleteSuggestion };
