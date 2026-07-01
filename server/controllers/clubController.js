const clubService = require('../services/clubService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
}

async function listClubs(req, res) {
  try {
    return res.json(await clubService.listClubs());
  } catch (err) {
    return handleError(res, err);
  }
}

async function getClub(req, res) {
  try {
    return res.json(await clubService.getClub(req.params.id));
  } catch (err) {
    return handleError(res, err);
  }
}

async function createClub(req, res) {
  try {
    return res.status(201).json(await clubService.createClub(req.body, req.file));
  } catch (err) {
    return handleError(res, err);
  }
}

async function updateClub(req, res) {
  try {
    return res.json(await clubService.updateClub(req.params.id, req.body, req.file, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function deleteClub(req, res) {
  try {
    await clubService.deleteClub(req.params.id);
    return res.json({ message: 'Clube desativado com sucesso.' });
  } catch (err) {
    return handleError(res, err);
  }
}

async function getClubSummary(req, res) {
  try {
    return res.json(await clubService.getClubSummary(req.params.id, req.query.year, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getClubYears(req, res) {
  try {
    return res.json(await clubService.getClubYears(req.params.id, req.user));
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { listClubs, getClub, createClub, updateClub, deleteClub, getClubSummary, getClubYears };
