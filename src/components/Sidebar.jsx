import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const platformAdminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'DB', end: true },
  { to: '/admin/clubes', label: 'Clubes', icon: 'CL' },
  { to: '/admin/usuarios', label: 'Usuários', icon: 'US' },
  { to: '/admin/transacoes', label: 'Transações', icon: 'TX' },
  { to: '/admin/sugestoes', label: 'Sugestões', icon: 'SG' },
];

const clubAdminLinks = [
  { to: '/club-admin', label: 'Dashboard', icon: 'DB', end: true },
  { to: '/club-admin/transacoes', label: 'Transações', icon: 'TX' },
  { to: '/club-admin/sugestoes', label: 'Sugestões', icon: 'SG' },
  { to: '/club-admin/perfil', label: 'Perfil do Clube', icon: 'CL' },
];

export default function Sidebar() {
  const { user, logout, isPlatformAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isPlatformAdmin ? platformAdminLinks : clubAdminLinks;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>CA</span>
        <span>ClubeAberto</span>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">
            {isPlatformAdmin ? 'Admin da Plataforma' : 'Admin do Clube'}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="/" className="sidebar-link">
          <span>WEB</span>
          <span>Ver site público</span>
        </a>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span>SAIR</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
