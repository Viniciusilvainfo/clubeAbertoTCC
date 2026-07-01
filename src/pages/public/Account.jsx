import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Erro ao carregar a conta.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!confirm('Desativar sua conta?')) return;
    setRemoving(true);
    setError('');
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao desativar sua conta.');
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="page-header">
          <h1 className="page-title">Minha conta</h1>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="grid grid-2">
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Dados da conta</h2>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <div><strong>Nome:</strong> {profile?.name || user?.name || '—'}</div>
                <div><strong>E-mail:</strong> {profile?.email || user?.email || '—'}</div>
                <div><strong>Perfil:</strong> {profile?.role || user?.role || '—'}</div>
                <div><strong>Clube:</strong> {profile?.club_name || '—'}</div>
                <div><strong>Criado em:</strong> {formatDate(profile?.created_at)}</div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Ação da conta</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Você pode desativar sua conta a qualquer momento. Essa ação remove o acesso ao sistema.
              </p>
              <button className="btn btn-danger" onClick={handleDelete} disabled={removing}>
                {removing ? 'Desativando...' : 'Desativar minha conta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}