import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ClubLogo from '../../components/ClubLogo';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Home.css';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export default function Home() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = Boolean(user) || (!authLoading && Boolean(localStorage.getItem('token')));

  useEffect(() => {
    api.get('/clubs').then((res) => setClubs(res.data.slice(0, 6))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-tag">Transparência no Futebol</span>
            <h1 className="hero-title">
              Dados financeiros dos clubes em um só lugar
            </h1>
            <p className="hero-desc">
              Acesse receitas, despesas, investimentos e indicadores financeiros dos principais clubes do Brasil. Tudo organizado, transparente e público.
            </p>
            <div className="hero-actions">
              <Link to="/clubes" className="btn btn-primary">
                Explorar Clubes
              </Link>
              <Link to="/comparar" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                Comparar Clubes
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>CA</div>
              <div className="hero-card-title">Dados em tempo real</div>
              <div className="hero-card-sub">Atualizados pelos próprios clubes</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Por que usar o ClubeAberto?</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">01</div>
              <h3>Transparência Financeira</h3>
              <p>Receitas, despesas e investimentos organizados por clube, ano e categoria.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">02</div>
              <h3>Gráficos Interativos</h3>
              <p>Visualize a evolução financeira com gráficos mensais, anuais e por categoria.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">03</div>
              <h3>Comparação entre Clubes</h3>
              <p>Compare indicadores financeiros de até 5 clubes lado a lado.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="clubs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Clubes Cadastrados</h2>
            <Link to="/clubes" className="btn btn-outline btn-sm">Ver todos</Link>
          </div>
          {loading ? (
            <div className="loading">Carregando clubes...</div>
          ) : (
            <div className="clubs-grid">
              {clubs.map((club) => (
                <Link key={club.id} to={`/clubes/${club.id}`} className="club-card card">
                  <ClubLogo src={club.logo_url} alt={club.name} fallback={club.short_name || club.name[0]} size={48} fontSize={16} />
                  <div className="club-info">
                    <div className="club-name">{club.name}</div>
                    <div className="club-meta">{club.city} - {club.state} · Fundado em {club.founded_year}</div>
                  </div>
                  <span className="club-arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <span style={{ fontWeight: 700 }}>ClubeAberto</span>
            <p>Transparência financeira no futebol brasileiro.</p>
          </div>
          <div className="footer-links">
            <Link to="/clubes">Clubes</Link>
            <Link to="/comparar">Comparar</Link>
            <Link to={isAuthenticated ? '/conta' : '/login'}>{isAuthenticated ? 'Minha conta' : 'Entrar'}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
