const userService = require('../services/userService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
}

async function listUsers(req, res) {
  try {
    return res.json(await userService.listUsers(req.query));
  } catch (err) {
    return handleError(res, err);
  }
}

async function getUser(req, res) {
  try {
    return res.json(await userService.getUser(req.params.id));
  } catch (err) {
    return handleError(res, err);
  }
}

async function createUser(req, res) {
  try {
    return res.status(201).json(await userService.createUser(req.body));
  } catch (err) {
    return handleError(res, err);
  }
}

async function updateUser(req, res) {
  try {
    return res.json(await userService.updateUser(req.params.id, req.body));
  } catch (err) {
    return handleError(res, err);
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deactivateUser(req.params.id);
    return res.json({ message: 'Usuário desativado com sucesso.' });
  } catch (err) {
    return handleError(res, err);
  }
}

async function deleteCurrentUser(req, res) {
  try {
    await userService.deactivateCurrentUser(req.user.id);
    return res.json({ message: 'Sua conta foi desativada com sucesso.' });
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser, deleteCurrentUser };
