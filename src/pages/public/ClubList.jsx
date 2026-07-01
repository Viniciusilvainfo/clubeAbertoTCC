import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ClubLogo from '../../components/ClubLogo';
import api from '../../services/api';

export default function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clubs').then((res) => setClubs(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = clubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.state || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="page-header">
          <h1 className="page-title">Clubes</h1>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            className="form-control"
            style={{ maxWidth: 400 }}
            placeholder="Buscar por nome, cidade ou estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Carregando clubes...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">Nenhum clube encontrado.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filtered.map((club) => (
              <Link key={club.id} to={`/clubes/${club.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                >
                  <ClubLogo src={club.logo_url} alt={club.name} fallback={club.short_name || club.name.slice(0, 3).toUpperCase()} size={56} fontSize={16} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{club.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {[club.city, club.state].filter(Boolean).join(' - ')}
                      {club.founded_year && ` · Fundado em ${club.founded_year}`}
                    </div>
                    {club.stadium && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🏟️ {club.stadium}</div>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
