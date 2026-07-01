const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepo = require('../repositories/authRepository');

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, club_id: user.club_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(name, email, password) {
  if (!name || !email || !password) throw { status: 400, message: 'Nome, e-mail e senha são obrigatórios.' };
  if (password.length < 6) throw { status: 400, message: 'A senha deve ter no mínimo 6 caracteres.' };

  const existing = await authRepo.findByEmail(email);
  if (existing) throw { status: 409, message: 'E-mail já cadastrado.' };

  const hash = await bcrypt.hash(password, 10);
  const user = await authRepo.create(name, email, hash);
  return { user, token: signToken(user) };
}

async function login(email, password) {
  if (!email || !password) throw { status: 400, message: 'E-mail e senha são obrigatórios.' };

  const user = await authRepo.findByEmail(email);
  if (!user) throw { status: 401, message: 'Credenciais inválidas.' };
  if (!user.is_active) throw { status: 403, message: 'Conta desativada.' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Credenciais inválidas.' };

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token: signToken(user) };
}

async function me(userId) {
  const user = await authRepo.findById(userId);
  if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
  if (!user.is_active) throw { status: 403, message: 'Conta desativada.' };
  return user;
}

module.exports = { register, login, me };
