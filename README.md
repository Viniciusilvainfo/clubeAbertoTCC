# ClubeAberto

Plataforma web de transparência financeira para clubes de futebol.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Node.js + Express |
| Banco de dados | PostgreSQL (`pg`) |
| Autenticação | JWT |
| Frontend | React + Vite |
| Gráficos | Recharts |
| Uploads | Multer |
| Assistente | Endpoint `/api/ai/chat` |

## Versões utilizadas

| Tecnologia | Versão no projeto |
|---|---|
| Node.js | 22.9.0 |
| npm | 11.0.0 |
| React | `18.3.1` |
| React DOM | `18.3.1` |
| Vite | `5.4.21` |
| Express | `4.22.1` |
| PostgreSQL (`pg`) | driver `8.20.0` |
| Banco PostgreSQL (servidor) | `18.3` |

## Estrutura atual

Projeto em uma única raiz (frontend + backend no mesmo `package.json`):

```text
clubeAberto/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── server/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── uploads/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── services/
├── index.html
├── vite.config.js
└── package.json
```

## Perfis de usuário

| Perfil | Acesso |
|---|---|
| `platform_admin` | Gestão completa da plataforma (usuários, clubes, validação e relatórios) |
| `club_admin` | Gestão de dados e transações do clube |
| `fan` | Área pública + envio de sugestões |

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

`.env.example`:

```env
PORT=3001
DATABASE_URL=postgres://usuario:senha@localhost:5432/clubeaberto
JWT_SECRET=seu_segredo
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001/api
GEMINI_API_KEY=sua_chave
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-1.5-flash
```

Notas:

- `FRONTEND_URL` controla o CORS no backend.
- `VITE_API_URL` define a URL base da API no frontend. Se não for definida, o fallback é `http://localhost:3001/api`.
- A rota de IA (`POST /api/ai/chat`) depende de `GEMINI_API_KEY`.

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar banco e aplicar scripts

```bash
psql -U postgres -c "CREATE DATABASE clubeaberto;"
psql -U postgres -d clubeaberto -f database/schema.sql
psql -U postgres -d clubeaberto -f database/seed.sql
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

Esse comando sobe:

- API Express em `http://localhost:3001`
- Frontend Vite em `http://localhost:5173`

### 4. Produção local (somente API)

```bash
npm start
```

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe backend (nodemon) e frontend (vite) em paralelo |
| `npm start` | Sobe apenas o backend |
| `npm run build` | Build do frontend |
| `npm run preview` | Preview do build do frontend |
| `npm run db:migrate` | Executa `database/schema.sql` |
| `npm run db:seed` | Executa `database/seed.sql` |

Observação: os scripts `db:migrate` e `db:seed` usam expansão de variável no formato Unix (`$DATABASE_URL`). Em Windows puro, prefira os comandos `psql` mostrados na seção de banco.

## Endpoints principais

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (autenticado)

### Clubes

- `GET /api/clubs`
- `GET /api/clubs/:id`
- `GET /api/clubs/:id/summary`
- `GET /api/clubs/:id/years`
- `POST /api/clubs` (platform_admin, com upload de logo)
- `PUT /api/clubs/:id` (platform_admin ou club_admin, com upload de logo)
- `DELETE /api/clubs/:id` (platform_admin)

### Financeiro

- `GET /api/financial/categories`
- `GET /api/financial/transactions`
- `GET /api/financial/transactions/:id`
- `GET /api/financial/compare`
- `GET /api/financial/monthly/:club_id/:fiscal_year`
- `GET /api/financial/category-breakdown/:club_id/:fiscal_year/:type`
- `POST /api/financial/transactions` (club_admin ou platform_admin)
- `PUT /api/financial/transactions/:id` (club_admin ou platform_admin)
- `DELETE /api/financial/transactions/:id` (club_admin ou platform_admin)

### Sugestões

- `POST /api/suggestions` (autenticado)
- `GET /api/suggestions` (club_admin ou platform_admin)
- `PATCH /api/suggestions/:id/review` (club_admin ou platform_admin)
- `DELETE /api/suggestions/:id` (platform_admin)

### Admin de plataforma

- `GET /api/admin/stats`
- `GET /api/admin/report`
- `GET /api/admin/pending-transactions`
- `PATCH /api/admin/transactions/:id/validate`

### Usuários

- `DELETE /api/users/me` (autenticado)
- `GET /api/users` (platform_admin)
- `GET /api/users/:id` (platform_admin)
- `POST /api/users` (platform_admin)
- `PUT /api/users/:id` (platform_admin)
- `DELETE /api/users/:id` (platform_admin)

### IA

- `POST /api/ai/chat`

## Roteiro de testes (passo a passo)

1. Execute `npm install`.
2. Crie o banco e rode `database/schema.sql` e `database/seed.sql`.
3. Suba o projeto com `npm run dev`.
4. Abra o site em `http://localhost:5173` e valide o favicon na aba do navegador.
5. Faça login como torcedor (`joao@email.com`) e valide:
	- navbar e footer sem botão `Entrar` quando autenticado;
	- acesso em `/conta` com dados do usuário;
	- remoção da própria conta (botão de desativar).
6. Em um clube público (`/clubes/:id`), valide:
	- seletor de `Ano fiscal` com os últimos 5 anos;
	- mudança de ano funcionando;
	- abertura de sugestão com campo de valor.
7. Na tela de comparação (`/comparar`), valide:
	- filtro por nome de time;
	- seleção de 2 a 5 clubes;
	- filtro de período limitado aos últimos 5 anos.
8. Faça login como admin de clube (`admin@flamengo.com`) e valide:
	- dashboard com filtro de ano dos últimos 5 anos;
	- cadastro/edição/remoção de transações;
	- upload de logo em perfil do clube.
9. Faça login como admin da plataforma (`admin@clubeaberto.com`) e valide:
	- gestão de clubes com upload de logo;
	- revisão de sugestões;
	- validação de transações pendentes.
10. No backend, valide rapidamente `GET /api/clubs`.

## Contas de demonstração (seed)

| E-mail | Perfil | Clube |
|---|---|---|
| admin@clubeaberto.com | Admin Plataforma | - |
| admin@flamengo.com | Admin Clube | Flamengo |
| joao@email.com | Torcedor | - |

Senhas do seed:

- `admin@clubeaberto.com` -> `Admin@123`
- `admin@flamengo.com` -> `Clube@123`
- `joao@email.com` -> `Fan@123`
