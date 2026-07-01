import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function recentYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

const EMPTY_FORM = {
  type: 'receita', description: '', amount: '', date: '', fiscal_year: new Date().getFullYear(),
  category_id: '', is_public: true, source: '', notes: '',
};

export default function ClubAdminTransactions() {
  const { user } = useAuth();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ type: '', fiscal_year: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const clubId = user?.club_id;

  const fetchData = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    const params = new URLSearchParams({ club_id: clubId, page, limit: 15 });
    if (filters.type) params.append('type', filters.type);
    if (filters.fiscal_year) params.append('fiscal_year', filters.fiscal_year);
    try {
      const [txRes, catRes] = await Promise.all([
        api.get(`/financial/transactions?${params}`),
        api.get('/financial/categories'),
      ]);
      setTransactions(txRes.data.data);
      setMeta(txRes.data.meta);
      setCategories(catRes.data);
    } finally {
      setLoading(false);
    }
  }, [clubId, page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (location.state?.prefill) {
      setEditing(null);
      setForm({ ...EMPTY_FORM, ...location.state.prefill });
      setError('');
      setShowModal(true);
      window.history.replaceState({}, '');
    }
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError('');
    setShowModal(true);
  }

  function openEdit(tx) {
    setEditing(tx.id);
    setForm({
      type: tx.type, description: tx.description, amount: tx.amount,
      date: tx.date?.split('T')[0], fiscal_year: tx.fiscal_year,
      category_id: tx.category_id || '', is_public: tx.is_public,
      source: tx.source || '', notes: tx.notes || '',
    });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, club_id: clubId, amount: parseFloat(form.amount), fiscal_year: parseInt(form.fiscal_year), category_id: form.category_id || null };
      if (editing) {
        await api.put(`/financial/transactions/${editing}`, payload);
      } else {
        await api.post('/financial/transactions', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta transação?')) return;
    await api.delete(`/financial/transactions/${id}`);
    fetchData();
  }

  const filteredCats = categories.filter((c) => !form.type || c.type === form.type);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transações Financeiras</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Nova Transação</button>
      </div>

      <div className="filters">
        <select className="form-control" value={filters.type} onChange={(e) => { setFilters((f) => ({ ...f, type: e.target.value })); setPage(1); }}>
          <option value="">Todos os tipos</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
          <option value="investimento">Investimento</option>
        </select>
        <select className="form-control" value={filters.fiscal_year} onChange={(e) => { setFilters((f) => ({ ...f, fiscal_year: e.target.value })); setPage(1); }}>
          <option value="">Todos os anos</option>
          {recentYears().map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => { setFilters({ type: '', fiscal_year: '' }); setPage(1); }}>Limpar</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Validado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhuma transação encontrada.</td></tr>
                  ) : transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                      <td>{tx.description}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.category_name || '—'}</td>
                      <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                      <td style={{ fontWeight: 600, color: tx.type === 'receita' ? 'var(--success)' : tx.type === 'despesa' ? 'var(--danger)' : 'var(--info)' }}>
                        {currency(tx.amount)}
                      </td>
                      <td>{tx.is_validated ? <span className="badge badge-success">✓</span> : <span className="badge badge-warning">Pend.</span>}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(tx)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tx.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              {Array.from({ length: Math.min(meta.pages, 7) }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar' : 'Nova'} Transação</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select className="form-control" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, category_id: '' }))} required>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-control" value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Sem categoria</option>
                    {filteredCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descrição *</label>
                <input className="form-control" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Valor (R$) *</label>
                  <input type="number" step="0.01" min="0" className="form-control" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ano Fiscal *</label>
                  <input type="number" className="form-control" value={form.fiscal_year} onChange={(e) => setForm((f) => ({ ...f, fiscal_year: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Data *</label>
                <input type="date" className="form-control" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Fonte / Referência</label>
                <input className="form-control" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="Ex: Relatório anual 2023" />
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-control" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="is_public" checked={form.is_public} onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.checked }))} />
                <label htmlFor="is_public" className="form-label" style={{ marginBottom: 0 }}>Tornar público</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
