CREATE DATABASE clubeaberto;

\encoding UTF8;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('platform_admin', 'club_admin', 'fan');
CREATE TYPE transaction_type AS ENUM ('receita', 'despesa', 'investimento');
CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE clubs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(150) NOT NULL,
  short_name  VARCHAR(20),
  founded_year INT,
  city        VARCHAR(100),
  state       VARCHAR(2),
  stadium     VARCHAR(150),
  description TEXT,
  logo_url    VARCHAR(255),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         user_role NOT NULL DEFAULT 'fan',
  club_id      UUID REFERENCES clubs(id) ON DELETE SET NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financial_categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        transaction_type NOT NULL,
  description VARCHAR(255),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE financial_transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id      UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  category_id  INT REFERENCES financial_categories(id) ON DELETE SET NULL,
  type         transaction_type NOT NULL,
  description  VARCHAR(255) NOT NULL,
  amount       NUMERIC(15, 2) NOT NULL,
  date         DATE NOT NULL,
  fiscal_year  INT NOT NULL,
  is_public    BOOLEAN NOT NULL DEFAULT TRUE,
  is_validated BOOLEAN NOT NULL DEFAULT FALSE,
  source       VARCHAR(255),
  notes        TEXT,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE suggestions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  club_id     UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  value       NUMERIC(15, 2),
  status      suggestion_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_club_id ON financial_transactions(club_id);
CREATE INDEX idx_transactions_type ON financial_transactions(type);
CREATE INDEX idx_transactions_fiscal_year ON financial_transactions(fiscal_year);
CREATE INDEX idx_transactions_date ON financial_transactions(date);
CREATE INDEX idx_suggestions_club_id ON suggestions(club_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_club_id ON users(club_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON financial_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at BEFORE UPDATE ON suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
