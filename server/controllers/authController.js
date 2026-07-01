const authService = require('../services/authService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Erro interno no servidor.' });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    return res.status(201).json(await authService.register(name, email, password));
  } catch (err) {
    return handleError(res, err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    return res.json(await authService.login(email, password));
  } catch (err) {
    return handleError(res, err);
  }
}

async function me(req, res) {
  try {
    return res.json(await authService.me(req.user.id));
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { register, login, me };
