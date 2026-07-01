const suggestionService = require('../services/suggestionService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
}

async function listSuggestions(req, res) {
  try {
    return res.json(await suggestionService.listSuggestions(req.query, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function createSuggestion(req, res) {
  try {
    return res.status(201).json(await suggestionService.createSuggestion(req.body, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function reviewSuggestion(req, res) {
  try {
    return res.json(await suggestionService.reviewSuggestion(req.params.id, req.body, req.user.id));
  } catch (err) {
    return handleError(res, err);
  }
}

async function deleteSuggestion(req, res) {
  try {
    await suggestionService.deleteSuggestion(req.params.id);
    return res.json({ message: 'Sugestão removida.' });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { listSuggestions, createSuggestion, reviewSuggestion, deleteSuggestion };
