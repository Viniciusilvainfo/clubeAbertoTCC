import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function recentYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [pending, setPending] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ type: '', fiscal_year: '', club_id: '' });
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filters.type) params.append('type', filters.type);
      if (filters.fiscal_year) params.append('fiscal_year', filters.fiscal_year);
      if (filters.club_id) params.append('club_id', filters.club_id);

      const [txRes, pendingRes, clubsRes] = await Promise.all([
        api.get(`/financial/transactions?${params}`),
        api.get('/admin/pending-transactions'),
        api.get('/clubs'),
      ]);
      setTransactions(txRes.data.data);
      setMeta(txRes.data.meta);
      setPending(pendingRes.data);
      setClubs(clubsRes.data);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleValidate(id, is_validated) {
    await api.patch(`/admin/transactions/${id}/validate`, { is_validated });
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta transação?')) return;
    await api.delete(`/financial/transactions/${id}`);
    fetchData();
  }

  const displayed = tab === 'pending' ? pending : transactions;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transações</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn btn-sm ${tab === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('all')}>
            Todas ({meta.total})
          </button>
          <button className={`btn btn-sm ${tab === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('pending')}>
            Pendentes ({pending.length})
          </button>
        </div>
      </div>

      {tab === 'all' && (
        <div className="filters">
          <select className="form-control" value={filters.club_id} onChange={(e) => { setFilters((f) => ({ ...f, club_id: e.target.value })); setPage(1); }}>
            <option value="">Todos os clubes</option>
            {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
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
        </div>
      )}

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
                    <th>Clube</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Validado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhuma transação.</td></tr>
                  ) : displayed.map((tx) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                      <td style={{ fontSize: '0.8rem' }}>{tx.club_name}</td>
                      <td>{tx.description}</td>
                      <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                      <td style={{ fontWeight: 600, color: tx.type === 'receita' ? 'var(--success)' : tx.type === 'despesa' ? 'var(--danger)' : 'var(--info)' }}>
                        {currency(tx.amount)}
                      </td>
                      <td>
                        {tx.is_validated ? (
                          <span className="badge badge-success">✓ Válido</span>
                        ) : (
                          <span className="badge badge-warning">Pendente</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {!tx.is_validated ? (
                            <button className="btn btn-primary btn-sm" onClick={() => handleValidate(tx.id, true)}>Validar</button>
                          ) : (
                            <button className="btn btn-outline btn-sm" onClick={() => handleValidate(tx.id, false)}>Invalidar</button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tx.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {tab === 'all' && meta.pages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                {Array.from({ length: Math.min(meta.pages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
