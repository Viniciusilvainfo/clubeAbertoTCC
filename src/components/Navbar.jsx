import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isPlatformAdmin, isClubAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function getDashboardLink() {
    if (isPlatformAdmin) return '/admin';
    if (isClubAdmin) return '/club-admin';
    return '/conta';
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-name">ClubeAberto</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/clubes" onClick={() => setMenuOpen(false)}>Clubes</Link>
          <Link to="/comparar" onClick={() => setMenuOpen(false)}>Comparar</Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm">
                {isPlatformAdmin || isClubAdmin ? 'Painel' : 'Minha conta'}
              </Link>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>

        <button className="navbar-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
