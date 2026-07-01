SET client_encoding = 'UTF8';

TRUNCATE TABLE suggestions, financial_transactions, users, financial_categories, clubs RESTART IDENTITY CASCADE;

INSERT INTO clubs (id, name, short_name, founded_year, city, state, stadium, description) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Flamengo', 'FLA', 1895, 'Rio de Janeiro', 'RJ', 'Maracanã', 'Clube de Regatas do Flamengo, maior clube do Brasil.'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Corinthians', 'COR', 1910, 'São Paulo', 'SP', 'Neo Química Arena', 'Sport Club Corinthians Paulista.'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'São Paulo', 'SAO', 1930, 'São Paulo', 'SP', 'MorumBIS', 'São Paulo Futebol Clube.'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Palmeiras', 'PAL', 1914, 'São Paulo', 'SP', 'Allianz Parque', 'Sociedade Esportiva Palmeiras.'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'Grêmio', 'GRE', 1903, 'Porto Alegre', 'RS', 'Arena do Grêmio', 'Grêmio Foot-Ball Porto Alegrense.');

INSERT INTO financial_categories (name, type, description) VALUES
  ('Direitos de TV', 'receita', 'Receitas provenientes de contratos de transmissão'),
  ('Patrocínio', 'receita', 'Receitas de patrocinadores e parceiros comerciais'),
  ('Bilheteria', 'receita', 'Receitas de venda de ingressos'),
  ('Transferência de jogadores', 'receita', 'Receitas com venda de atletas'),
  ('Licenciamento', 'receita', 'Receitas com produtos licenciados e uniformes'),
  ('Folha de pagamento', 'despesa', 'Salários e encargos de jogadores e comissão técnica'),
  ('Infraestrutura', 'despesa', 'Manutenção e melhorias em instalações'),
  ('Marketing', 'despesa', 'Gastos com publicidade e marketing'),
  ('Transferência de jogadores', 'despesa', 'Gastos com contratação de atletas'),
  ('Administração', 'despesa', 'Despesas administrativas gerais'),
  ('Instalações', 'investimento', 'Investimentos em estádios e CT'),
  ('Formação de base', 'investimento', 'Investimentos nas categorias de base'),
  ('Tecnologia', 'investimento', 'Investimentos em tecnologia e inovação');

INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('b1c2d3e4-0001-0001-0001-000000000001',
   'Administrador',
   'admin@clubeaberto.com',
  '$2a$10$owXLoG4YMLWjvpzHIEOPSOROTOIrY8IJtXMSk.4N5uR97r7C7KDvK',
   'platform_admin');

INSERT INTO users (id, name, email, password_hash, role, club_id) VALUES
  ('b1c2d3e4-0002-0002-0002-000000000002',
   'Admin Flamengo',
   'admin@flamengo.com',
  '$2a$10$OFf6QDXE2GMRWCxsjYqBf.Zvn0A942du1NlbPHF4w/F60zhKth8KC',
   'club_admin',
   'a1b2c3d4-0001-0001-0001-000000000001');

INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('b1c2d3e4-0003-0003-0003-000000000003',
   'João Torcedor',
   'joao@email.com',
  '$2a$10$YSADJ0E19KciOMNhpWf.e.ZkkBGNXBBwQFhKCjPfipZ4xmkEngima',
   'fan');

INSERT INTO financial_transactions (club_id, category_id, type, description, amount, date, fiscal_year, is_public, is_validated, created_by) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Direitos de TV Brasileirão 2023', 180000000.00, '2023-01-15', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'receita', 'Patrocínio master 2023', 85000000.00, '2023-02-01', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 3, 'receita', 'Bilheteria temporada 2023', 62000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 4, 'receita', 'Venda Pedro ao Al-Qadsiah', 72000000.00, '2023-06-15', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 5, 'receita', 'Licenciamento 2023', 45000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Folha de pagamento 2023', 350000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 7, 'despesa', 'Manutenção Ninho do Urubu 2023', 18000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 9, 'despesa', 'Contratação Éverton Cebolinha', 15000000.00, '2023-07-01', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 11, 'investimento', 'Expansão CT Ninho do Urubu', 25000000.00, '2023-03-01', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 12, 'investimento', 'Categorias de base 2023', 12000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002');

INSERT INTO financial_transactions (club_id, category_id, type, description, amount, date, fiscal_year, is_public, is_validated, created_by) VALUES
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Direitos de TV Brasileirão 2023', 150000000.00, '2023-01-15', 2023, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'receita', 'Patrocínio 2023', 60000000.00, '2023-02-01', 2023, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 3, 'receita', 'Bilheteria 2023', 55000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Folha de pagamento 2023', 270000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 10, 'despesa', 'Administração 2023', 22000000.00, '2023-12-31', 2023, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001');

INSERT INTO suggestions (user_id, club_id, title, description, status) VALUES
  ('b1c2d3e4-0003-0003-0003-000000000003',
   'a1b2c3d4-0001-0001-0001-000000000001',
   'Incluir receitas de streaming',
   'Sugiro incluir dados sobre receitas com streaming e conteúdo digital, que têm crescido muito nos últimos anos.',
   'pending');

INSERT INTO financial_transactions (club_id, category_id, type, description, amount, date, fiscal_year, is_public, is_validated, created_by) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'receita', 'Patrocínio master 2024', 92000000.00, '2024-02-01', 2024, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Folha de pagamento 2024', 285000000.00, '2024-12-31', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 11, 'investimento', 'Modernização do centro de treinamento', 18000000.00, '2024-08-10', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001');

INSERT INTO suggestions (user_id, club_id, title, description, value, status) VALUES
  ('b1c2d3e4-0003-0003-0003-000000000003',
   'a1b2c3d4-0002-0002-0002-000000000002',
   'Detalhar investimento em base',
   'Seria útil separar os investimentos nas categorias de base por projeto.',
   2500000.00,
   'pending');

INSERT INTO financial_transactions (club_id, category_id, type, description, amount, date, fiscal_year, is_public, is_validated, created_by) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Receita anual 2024 - FLA', 190000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Despesa anual 2024 - FLA', 360000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 11, 'investimento', 'Investimento anual 2024 - FLA', 26000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Receita anual 2025 - FLA', 205000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Despesa anual 2025 - FLA', 375000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 11, 'investimento', 'Investimento anual 2025 - FLA', 28000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Receita anual 2024 - COR', 155000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Despesa anual 2024 - COR', 275000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 11, 'investimento', 'Investimento anual 2024 - COR', 24000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Receita anual 2025 - COR', 170000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Despesa anual 2025 - COR', 290000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 11, 'investimento', 'Investimento anual 2025 - COR', 25000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 1, 'receita', 'Receita anual 2024 - SAO', 145000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 6, 'despesa', 'Despesa anual 2024 - SAO', 250000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 11, 'investimento', 'Investimento anual 2024 - SAO', 22000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 1, 'receita', 'Receita anual 2025 - SAO', 158000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 6, 'despesa', 'Despesa anual 2025 - SAO', 260000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 11, 'investimento', 'Investimento anual 2025 - SAO', 23000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'receita', 'Receita anual 2024 - PAL', 175000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 6, 'despesa', 'Despesa anual 2024 - PAL', 240000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 11, 'investimento', 'Investimento anual 2024 - PAL', 20000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'receita', 'Receita anual 2025 - PAL', 188000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 6, 'despesa', 'Despesa anual 2025 - PAL', 255000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 11, 'investimento', 'Investimento anual 2025 - PAL', 22000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'receita', 'Receita anual 2024 - GRE', 120000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 6, 'despesa', 'Despesa anual 2024 - GRE', 180000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 11, 'investimento', 'Investimento anual 2024 - GRE', 15000000.00, '2024-12-15', 2024, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'receita', 'Receita anual 2025 - GRE', 130000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 6, 'despesa', 'Despesa anual 2025 - GRE', 190000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 11, 'investimento', 'Investimento anual 2025 - GRE', 16000000.00, '2025-12-15', 2025, TRUE, FALSE, 'b1c2d3e4-0001-0001-0001-000000000001');

INSERT INTO suggestions (user_id, club_id, title, description, value, status) VALUES
  ('b1c2d3e4-0003-0003-0003-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001', 'Detalhar receitas digitais - FLA', 'Separar receitas de mídia, streaming e patrocínio digital para facilitar a leitura.', 1500000.00, 'pending'),
  ('b1c2d3e4-0003-0003-0003-000000000003', 'a1b2c3d4-0002-0002-0002-000000000002', 'Abrir mais detalhes do orçamento - COR', 'Publicar um resumo mais claro do orçamento por área.', 1200000.00, 'pending'),
  ('b1c2d3e4-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003', 'Separar base e profissional - SAO', 'Detalhar os investimentos da base separadamente dos gastos do time principal.', 1000000.00, 'pending'),
  ('b1c2d3e4-0003-0003-0003-000000000003', 'a1b2c3d4-0004-0004-0004-000000000004', 'Mostrar contratos por categoria - PAL', 'Agrupar contratos e despesas por centro de custo para facilitar auditoria.', 1300000.00, 'pending'),
  ('b1c2d3e4-0003-0003-0003-000000000003', 'a1b2c3d4-0005-0005-0005-000000000005', 'Publicar metas anuais - GRE', 'Adicionar metas de receita e despesa para acompanhar a execução do orçamento.', 900000.00, 'pending');

INSERT INTO financial_transactions (club_id, category_id, type, description, amount, date, fiscal_year, is_public, is_validated, created_by) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Direitos de TV 2024 - Flamengo', 214000000.00, '2024-01-20', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'receita', 'Patrocínio master 2024 - Flamengo', 98000000.00, '2024-03-11', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 3, 'receita', 'Bilheteria Maracanã 2024 - Flamengo', 69000000.00, '2024-05-04', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Folha de pagamento 2024 - Flamengo', 365000000.00, '2024-02-28', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 7, 'despesa', 'Infraestrutura Ninho do Urubu 2024', 18500000.00, '2024-04-16', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 8, 'despesa', 'Marketing e mídia 2024 - Flamengo', 14200000.00, '2024-08-09', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 11, 'investimento', 'Modernização do CT Ninho do Urubu 2024', 27000000.00, '2024-11-23', 2024, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Direitos de TV 2025 - Flamengo', 225000000.00, '2025-01-18', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'receita', 'Patrocínio master 2025 - Flamengo', 105000000.00, '2025-03-07', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 4, 'receita', 'Venda de atleta 2025 - Flamengo', 61000000.00, '2025-07-12', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Folha de pagamento 2025 - Flamengo', 382000000.00, '2025-02-26', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 7, 'despesa', 'Manutenção de instalações 2025 - Flamengo', 20500000.00, '2025-06-14', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 9, 'despesa', 'Contratação de reforço 2025 - Flamengo', 45000000.00, '2025-09-03', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 12, 'investimento', 'Formação de base 2025 - Flamengo', 31000000.00, '2025-10-21', 2025, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'receita', 'Direitos de TV 2026 - Flamengo', 234000000.00, '2026-01-16', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'receita', 'Patrocínio 2026 - Flamengo', 112000000.00, '2026-02-24', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 3, 'receita', 'Bilheteria 2026 - Flamengo', 76000000.00, '2026-04-19', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 6, 'despesa', 'Folha de pagamento 2026 - Flamengo', 395000000.00, '2026-03-31', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 10, 'despesa', 'Administração 2026 - Flamengo', 24500000.00, '2026-05-15', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 13, 'investimento', 'Tecnologia e dados 2026 - Flamengo', 34000000.00, '2026-09-11', 2026, TRUE, TRUE, 'b1c2d3e4-0002-0002-0002-000000000002'),

  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Direitos de TV 2024 - Corinthians', 162000000.00, '2024-01-19', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'receita', 'Patrocínio 2024 - Corinthians', 68000000.00, '2024-03-09', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 3, 'receita', 'Bilheteria Neo Química Arena 2024', 57000000.00, '2024-05-12', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Folha de pagamento 2024 - Corinthians', 278000000.00, '2024-02-27', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 7, 'despesa', 'Infraestrutura 2024 - Corinthians', 16500000.00, '2024-04-18', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 8, 'despesa', 'Marketing 2024 - Corinthians', 12800000.00, '2024-09-06', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 11, 'investimento', 'Instalações Arena e CT 2024', 24000000.00, '2024-11-20', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Direitos de TV 2025 - Corinthians', 171000000.00, '2025-01-17', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'receita', 'Patrocínio 2025 - Corinthians', 74000000.00, '2025-03-13', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 5, 'receita', 'Licenciamento 2025 - Corinthians', 38000000.00, '2025-06-08', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Folha de pagamento 2025 - Corinthians', 286000000.00, '2025-02-25', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 9, 'despesa', 'Transferência de jogadores 2025 - Corinthians', 33000000.00, '2025-07-22', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 10, 'despesa', 'Administração 2025 - Corinthians', 21500000.00, '2025-09-15', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 12, 'investimento', 'Formação de base 2025 - Corinthians', 17000000.00, '2025-10-28', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'receita', 'Direitos de TV 2026 - Corinthians', 179000000.00, '2026-01-21', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'receita', 'Patrocínio 2026 - Corinthians', 79000000.00, '2026-03-05', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 6, 'despesa', 'Folha de pagamento 2026 - Corinthians', 294000000.00, '2026-04-29', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 7, 'despesa', 'Infraestrutura 2026 - Corinthians', 18300000.00, '2026-06-11', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 8, 'despesa', 'Marketing 2026 - Corinthians', 13400000.00, '2026-08-24', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 13, 'investimento', 'Tecnologia 2026 - Corinthians', 29000000.00, '2026-11-19', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),

  ('a1b2c3d4-0003-0003-0003-000000000003', 1, 'receita', 'Direitos de TV 2024 - São Paulo', 148000000.00, '2024-01-23', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 2, 'receita', 'Patrocínio 2024 - São Paulo', 61000000.00, '2024-03-14', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 3, 'receita', 'Bilheteria MorumBIS 2024', 49000000.00, '2024-05-27', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 6, 'despesa', 'Folha de pagamento 2024 - São Paulo', 252000000.00, '2024-02-29', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 7, 'despesa', 'Infraestrutura 2024 - São Paulo', 15200000.00, '2024-04-12', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 8, 'despesa', 'Marketing 2024 - São Paulo', 11600000.00, '2024-08-21', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 11, 'investimento', 'Instalações MorumBIS 2024', 21000000.00, '2024-11-17', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 1, 'receita', 'Direitos de TV 2025 - São Paulo', 156000000.00, '2025-01-20', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 2, 'receita', 'Patrocínio 2025 - São Paulo', 66000000.00, '2025-03-10', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 4, 'receita', 'Transferência de jogador 2025 - São Paulo', 42000000.00, '2025-07-18', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 6, 'despesa', 'Folha de pagamento 2025 - São Paulo', 264000000.00, '2025-02-24', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 7, 'despesa', 'Infraestrutura 2025 - São Paulo', 16800000.00, '2025-06-06', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 10, 'despesa', 'Administração 2025 - São Paulo', 19700000.00, '2025-09-12', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 12, 'investimento', 'Categorias de base 2025 - São Paulo', 18500000.00, '2025-10-25', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 1, 'receita', 'Direitos de TV 2026 - São Paulo', 164000000.00, '2026-01-14', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 2, 'receita', 'Patrocínio 2026 - São Paulo', 71000000.00, '2026-03-22', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 3, 'receita', 'Bilheteria 2026 - São Paulo', 53000000.00, '2026-04-16', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 6, 'despesa', 'Folha de pagamento 2026 - São Paulo', 271000000.00, '2026-05-02', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 8, 'despesa', 'Marketing 2026 - São Paulo', 12900000.00, '2026-08-07', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 13, 'investimento', 'Tecnologia 2026 - São Paulo', 31000000.00, '2026-11-13', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),

  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'receita', 'Direitos de TV 2024 - Palmeiras', 171000000.00, '2024-01-25', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 2, 'receita', 'Patrocínio 2024 - Palmeiras', 83000000.00, '2024-03-05', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 3, 'receita', 'Bilheteria Allianz Parque 2024', 61000000.00, '2024-05-15', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 6, 'despesa', 'Folha de pagamento 2024 - Palmeiras', 243000000.00, '2024-02-28', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 7, 'despesa', 'Infraestrutura 2024 - Palmeiras', 17100000.00, '2024-04-20', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 8, 'despesa', 'Marketing 2024 - Palmeiras', 13700000.00, '2024-09-04', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 11, 'investimento', 'Instalações 2024 - Palmeiras', 26000000.00, '2024-11-24', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'receita', 'Direitos de TV 2025 - Palmeiras', 179000000.00, '2025-01-22', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 2, 'receita', 'Patrocínio 2025 - Palmeiras', 88000000.00, '2025-03-11', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 4, 'receita', 'Transferência de atleta 2025 - Palmeiras', 47000000.00, '2025-07-14', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 6, 'despesa', 'Folha de pagamento 2025 - Palmeiras', 251000000.00, '2025-02-26', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 9, 'despesa', 'Transferência de jogadores 2025 - Palmeiras', 39000000.00, '2025-06-19', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 10, 'despesa', 'Administração 2025 - Palmeiras', 20800000.00, '2025-08-28', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 12, 'investimento', 'Formação de base 2025 - Palmeiras', 22000000.00, '2025-10-17', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'receita', 'Direitos de TV 2026 - Palmeiras', 186000000.00, '2026-01-18', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 2, 'receita', 'Patrocínio 2026 - Palmeiras', 91000000.00, '2026-03-08', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 6, 'despesa', 'Folha de pagamento 2026 - Palmeiras', 259000000.00, '2026-04-27', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 7, 'despesa', 'Infraestrutura 2026 - Palmeiras', 18900000.00, '2026-05-23', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 8, 'despesa', 'Marketing 2026 - Palmeiras', 14600000.00, '2026-08-16', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 13, 'investimento', 'Tecnologia 2026 - Palmeiras', 33000000.00, '2026-11-21', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),

  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'receita', 'Direitos de TV 2024 - Grêmio', 123000000.00, '2024-01-24', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 2, 'receita', 'Patrocínio 2024 - Grêmio', 52000000.00, '2024-03-19', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 3, 'receita', 'Bilheteria 2024 - Grêmio', 39000000.00, '2024-05-09', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 6, 'despesa', 'Folha de pagamento 2024 - Grêmio', 181000000.00, '2024-02-23', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 7, 'despesa', 'Infraestrutura 2024 - Grêmio', 13400000.00, '2024-04-17', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 8, 'despesa', 'Marketing 2024 - Grêmio', 9800000.00, '2024-08-15', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 11, 'investimento', 'Instalações 2024 - Grêmio', 15800000.00, '2024-11-12', 2024, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'receita', 'Direitos de TV 2025 - Grêmio', 128000000.00, '2025-01-16', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 2, 'receita', 'Patrocínio 2025 - Grêmio', 56000000.00, '2025-03-06', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 5, 'receita', 'Licenciamento 2025 - Grêmio', 24000000.00, '2025-06-21', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 6, 'despesa', 'Folha de pagamento 2025 - Grêmio', 188000000.00, '2025-02-21', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 9, 'despesa', 'Transferência de jogadores 2025 - Grêmio', 27000000.00, '2025-07-29', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 10, 'despesa', 'Administração 2025 - Grêmio', 16300000.00, '2025-09-09', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 12, 'investimento', 'Formação de base 2025 - Grêmio', 14900000.00, '2025-10-22', 2025, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'receita', 'Direitos de TV 2026 - Grêmio', 133000000.00, '2026-01-12', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 2, 'receita', 'Patrocínio 2026 - Grêmio', 59000000.00, '2026-03-17', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 6, 'despesa', 'Folha de pagamento 2026 - Grêmio', 194000000.00, '2026-04-26', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 7, 'despesa', 'Infraestrutura 2026 - Grêmio', 14200000.00, '2026-05-20', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 8, 'despesa', 'Marketing 2026 - Grêmio', 10900000.00, '2026-08-26', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 13, 'investimento', 'Tecnologia 2026 - Grêmio', 26500000.00, '2026-11-09', 2026, TRUE, TRUE, 'b1c2d3e4-0001-0001-0001-000000000001');
