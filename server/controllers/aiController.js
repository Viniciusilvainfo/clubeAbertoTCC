const aiService = require('../services/aiService');

function handleError(res, err) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err);
  return res.status(502).json({ error: 'Falha ao consultar a IA no momento.' });
}

async function chat(req, res) {
  try {
    return res.json(await aiService.chat(req.body || {}));
  } catch (err) {
    return handleError(res, err);
  }
}

module.exports = { chat };
