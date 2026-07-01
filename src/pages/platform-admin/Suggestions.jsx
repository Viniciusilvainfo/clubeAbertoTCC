import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const EMPTY_TX = {
  type: 'despesa', description: '', amount: '',
  date: new Date().toISOString().split('T')[0],
  fiscal_year: new Date().getFullYear(),
  category_id: '', is_public: true, notes: '',
};

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [txModal, setTxModal] = useState(null);
  const [txForm, setTxForm] = useState(EMPTY_TX);
  const [txSaving, setTxSaving] = useState(false);
  const [txError, setTxError] = useState('');
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    api.get('/financial/categories').then((res) => setCategories(res.data));
  }, []);

  function openReview(s) {
    setTxForm({ ...EMPTY_TX, description: s.title, amount: s.value || '', notes: s.description || '' });
    setTxError('');
    setTxModal(s);
  }

  async function handleTxSubmit(e) {
    e.preventDefault();
    setTxSaving(true);
    setTxError('');
    try {
      await api.post('/financial/transactions', {
        ...txForm,
        club_id: txModal.club_id,
        amount: parseFloat(txForm.amount),
        fiscal_year: parseInt(txForm.fiscal_year),
        category_id: txForm.category_id || null,
      });
      await api.patch(`/suggestions/${txModal.id}/review`, { status: 'approved' });
      setTxModal(null);
      fetchSuggestions();
    } catch (err) {
      setTxError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setTxSaving(false);
    }
  }

  async function handleReject(id) {
    if (!confirm('Rejeitar esta sugestão?')) return;
    await api.patch(`/suggestions/${id}/review`, { status: 'rejected' });
    fetchSuggestions();
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta sugestão?')) return;
    await api.delete(`/suggestions/${id}`);
    fetchSuggestions();
  }

  const filteredCats = categories.filter((c) => !txForm.type || c.type === txForm.type);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sugestões</h1>
      </div>

      <div className="filters">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s || 'all'} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Clube: <strong>{s.club_name}</strong> · Por: {s.user_name || 'Anônimo'} · {new Date(s.created_at).toLocaleDateString('pt-BR')}
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
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {s.status === 'pending' && (
                      <button className="btn btn-primary btn-sm" onClick={() => openReview(s)}>Revisar</button>
                    )}
                    {s.status === 'pending' && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleReject(s.id)}>Rejeitar</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>✕</button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {txModal && (
        <div className="modal-overlay" onClick={() => setTxModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Criar Transação · {txModal.club_name}</h2>
              <button className="modal-close" onClick={() => setTxModal(null)}>✕</button>
            </div>
            {txError && <div className="alert alert-error">{txError}</div>}
            <form onSubmit={handleTxSubmit} className="form-stack">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select className="form-control" value={txForm.type} onChange={(e) => setTxForm((f) => ({ ...f, type: e.target.value, category_id: '' }))} required>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-control" value={txForm.category_id} onChange={(e) => setTxForm((f) => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Sem categoria</option>
                    {filteredCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descrição *</label>
                <input className="form-control" value={txForm.description} onChange={(e) => setTxForm((f) => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Valor (R$) *</label>
                  <input type="number" step="0.01" min="0" className="form-control" value={txForm.amount} onChange={(e) => setTxForm((f) => ({ ...f, amount: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ano Fiscal *</label>
                  <input type="number" className="form-control" value={txForm.fiscal_year} onChange={(e) => setTxForm((f) => ({ ...f, fiscal_year: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Data *</label>
                <input type="date" className="form-control" value={txForm.date} onChange={(e) => setTxForm((f) => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-control" rows={3} value={txForm.notes} onChange={(e) => setTxForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="tx_is_public" checked={txForm.is_public} onChange={(e) => setTxForm((f) => ({ ...f, is_public: e.target.checked }))} />
                <label htmlFor="tx_is_public" className="form-label" style={{ marginBottom: 0 }}>Tornar público</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setTxModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={txSaving}>
                  {txSaving ? 'Salvando...' : 'Criar transação e aprovar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
