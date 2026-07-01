require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ler arquivos

app.use(cors({ // permitir requisições de outros domínios
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // passar dados de credenciais
}));
app.use(express.json()); // para retorno de API
app.use(express.urlencoded({ extended: true })); // para formulários

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/financial', require('./routes/financial'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

module.exports = app;
