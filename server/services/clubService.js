const clubRepo = require('../repositories/clubRepository');

async function listClubs() {
  return clubRepo.findAll();
}

async function getClub(id) {
  const club = await clubRepo.findById(id);
  if (!club) throw { status: 404, message: 'Clube não encontrado.' };
  return club;
}

function canSeeUnvalidated(user) {
  return user && ['club_admin', 'platform_admin'].includes(user.role);
}

async function createClub(body, file) {
  const { name, short_name, founded_year, city, state, stadium, description, logo_url } = body;
  if (!name) throw { status: 400, message: 'Nome do clube é obrigatório.' };
  const resolvedLogoUrl = file ? `/uploads/${file.filename}` : (logo_url || null);
  return clubRepo.create({ name, short_name, founded_year: founded_year || null, city, state, stadium, description, logo_url: resolvedLogoUrl });
}

async function updateClub(id, body, file, user) {
  if (user.role === 'club_admin' && user.club_id !== id) {
    throw { status: 403, message: 'Acesso negado.' };
  }
  const current = await clubRepo.findRawById(id);
  if (!current) throw { status: 404, message: 'Clube não encontrado.' };

  const resolvedLogoUrl = file ? `/uploads/${file.filename}` : (body.logo_url ?? current.logo_url);
  const resolvedFoundedYear = body.founded_year === '' || body.founded_year === undefined
    ? current.founded_year
    : body.founded_year;

  return clubRepo.update(id, {
    name: body.name ?? current.name,
    short_name: body.short_name ?? current.short_name,
    founded_year: resolvedFoundedYear,
    city: body.city ?? current.city,
    state: body.state ?? current.state,
    stadium: body.stadium ?? current.stadium,
    description: body.description ?? current.description,
    logo_url: resolvedLogoUrl,
  });
}

async function deleteClub(id) {
  await clubRepo.deactivate(id);
}

async function getClubSummary(id, year, user) {
  const fiscalYear = year ? parseInt(year) : new Date().getFullYear();
  const rows = await clubRepo.getSummary(id, fiscalYear, canSeeUnvalidated(user));
  const summary = { receita: 0, despesa: 0, investimento: 0 };
  rows.forEach((row) => { summary[row.type] = parseFloat(row.total); });
  summary.saldo = summary.receita - summary.despesa;
  summary.fiscal_year = fiscalYear;
  return summary;
}

async function getClubYears(id, user) {
  return clubRepo.getYears(id, canSeeUnvalidated(user));
}

module.exports = { listClubs, getClub, createClub, updateClub, deleteClub, getClubSummary, getClubYears };
