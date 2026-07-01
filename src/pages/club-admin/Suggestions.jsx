import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ClubAdminSuggestions() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await api.get(`/suggestions${params}`);
      setSuggestions(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSuggestions(); }, [filter]);

  async function handleReject(id) {
    if (!confirm('Rejeitar esta sugestão?')) return;
    await api.patch(`/suggestions/${id}/review`, { status: 'rejected' });
    fetchSuggestions();
  }

  function handleCreateTransaction(s) {
    navigate('/club-admin/transacoes', {
      state: {
        prefill: {
          description: s.title,
          amount: s.value || '',
          notes: s.description,
        },
      },
    });
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sugestões</h1>
      </div>

      <div className="filters">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s || 'all'}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}
          >
            {s === '' ? 'Todas' : s === 'pending' ? 'Pendentes' : s === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : suggestions.length === 0 ? (
        <div className="empty">Nenhuma sugestão encontrada.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {suggestions.map((s) => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Por: {s.user_name || 'Anônimo'} · {new Date(s.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  {s.value !== null && s.value !== undefined && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Valor sugerido: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.value)}</strong>
                    </div>
                  )}
                  <p style={{ fontSize: '0.9rem' }}>{s.description}</p>
                  {s.admin_notes && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Nota:</strong> {s.admin_notes}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span className={`badge badge-${s.status === 'pending' ? 'warning' : s.status === 'approved' ? 'success' : 'danger'}`}>
                    {s.status === 'pending' ? 'Pendente' : s.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                  </span>
                  {s.status === 'pending' && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => handleCreateTransaction(s)}>Revisar</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleReject(s.id)}>Rejeitar</button>
                    </>
                  )}
                </div>
              </div>


            </div>
          ))}
        </div>
      )}
    </div>
  );
}
