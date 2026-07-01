const axios = require('axios');
const aiRepo = require('../repositories/aiRepository');

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && typeof item.content === 'string' && typeof item.role === 'string')
    .slice(-6)
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content.trim().slice(0, 1000),
    }));
}

async function getFinancialContext(year) {
  const rows = await aiRepo.getFinancialReport(year);

  const clubs = rows.map((row) => ({
    name: row.name,
    short_name: row.short_name || null,
    receita: Number(row.receita || 0),
    despesa: Number(row.despesa || 0),
    saldo: Number(row.receita || 0) - Number(row.despesa || 0),
  }));

  return { year, clubs };
}

async function chat({ message, context, history }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';

  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    throw { status: 400, message: 'Mensagem inválida.' };
  }
  if (!apiKey) {
    throw { status: 503, message: 'Integração com IA não configurada. Defina GEMINI_API_KEY no .env.' };
  }

  const userMessage = message.trim().slice(0, 2000);
  const safeHistory = normalizeHistory(history);
  const year = Number(context?.fiscal_year) || new Date().getFullYear();

  const financialContext = await getFinancialContext(year);

  const historyText = safeHistory
    .map((item) => `${item.role === 'assistant' ? 'Assistente' : 'Usuário'}: ${item.content}`)
    .join('\n');

  const prompt = [
    'Você é um assistente financeiro da plataforma ClubeAberto.',
    'Responda sempre em português do Brasil, de forma objetiva e confiável.',
    'Use os dados de contexto abaixo quando possível e não invente números.',
    'Use nome completo dos clubes nas respostas (não use só sigla).',
    'Se o usuário pedir ranking/top N, devolva exatamente N itens quando houver dados suficientes.',
    'Se não houver dados suficientes para o número pedido, explique claramente quantos itens existem.',
    'Quando a pergunta for objetiva (ex: maior déficit, top 3, maior receita), responda direto sem enrolação.',
    'Se o usuário pedir algo fora do contexto disponível, explique a limitação e proponha próxima ação.',
    '',
    `Contexto financeiro atual: ${JSON.stringify(financialContext)}`,
    historyText ? `Histórico recente:\n${historyText}` : '',
    `Pergunta do usuário: ${userMessage}`,
  ].filter(Boolean).join('\n\n');

  // temperature o quanto a IA é criativa, topP o quanto ela é precisa, maxOutputTokens o tamanho máximo da resposta
  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 1024 },
  };

  let geminiRes;
  let modelUsed = configuredModel;

  try {
    geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${configuredModel}:generateContent?key=${apiKey}`,
      requestBody,
      { timeout: 15000 }
    );
  } catch (err) {
    const isModelUnavailable =
      err.response?.status === 404 &&
      typeof err.response?.data?.error?.message === 'string' &&
      err.response.data.error.message.toLowerCase().includes('no longer available');

    if (!isModelUnavailable || fallbackModel === configuredModel) throw err;

    modelUsed = fallbackModel;
    geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey}`,
      requestBody,
      { timeout: 15000 }
    );
  }

  const answer =
    geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    'Não consegui gerar uma resposta agora. Tente novamente em instantes.';

  return {
    answer,
    contextUsed: {
      fiscal_year: financialContext.year,
      model: modelUsed,
    },
  };
}

module.exports = { chat };
