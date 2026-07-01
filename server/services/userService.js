const bcrypt = require('bcryptjs');
const repo = require('../repositories/userRepository');

async function listUsers({ role, club_id }) {
  const conditions = [];
  const params = [];
  let i = 1;
  if (role) { conditions.push(`role = $${i++}`); params.push(role); }
  if (club_id) { conditions.push(`club_id = $${i++}`); params.push(club_id); }
  return repo.findAll(conditions, params);
}

async function getUser(id) {
  const user = await repo.findById(id);
  if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
  return user;
}

async function createUser({ name, email, password, role, club_id }) {
  if (!name || !email || !password || !role) {
    throw { status: 400, message: 'Campos obrigatórios faltando.' };
  }
  const existing = await repo.findByEmail(email);
  if (existing) throw { status: 409, message: 'E-mail já cadastrado.' };

  const password_hash = await bcrypt.hash(password, 10);
  return repo.create({ name, email, password_hash, role, club_id });
}

async function updateUser(id, { name, email, role, club_id, is_active, password }) {
  const user = await repo.findRawById(id);
  if (!user) throw { status: 404, message: 'Usuário não encontrado.' };

  const password_hash = password ? await bcrypt.hash(password, 10) : user.password_hash;
  return repo.update(id, {
    name: name ?? user.name,
    email: email ?? user.email,
    role: role ?? user.role,
    club_id: club_id ?? user.club_id,
    is_active: is_active ?? user.is_active,
    password_hash,
  });
}

async function deactivateUser(id) {
  await repo.deactivate(id);
}

async function deactivateCurrentUser(userId) {
  await repo.deactivate(userId);
}

module.exports = { listUsers, getUser, createUser, updateUser, deactivateUser, deactivateCurrentUser };
