import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import Navbar from '../../components/Navbar';
import ClubLogo from '../../components/ClubLogo';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const COLORS = ['#27a85a', '#e53e3e', '#3182ce', '#d69e2e', '#805ad5'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(val);
}

function recentYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

function SuggestionModal({ clubId, onClose }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/suggestions', {
        club_id: clubId,
        title,
        description,
        value: value ? parseFloat(value) : null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar sugestão.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Enviar Sugestão</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <p>Você precisa estar logado para enviar uma sugestão.</p>
          <div className="modal-footer">
            <Link to="/login" className="btn btn-primary">Entrar</Link>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Enviar Sugestão</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {success ? (
          <div>
            <div className="alert alert-success">Sugestão enviada com sucesso! Obrigado pela contribuição.</div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>Fechar</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-stack">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Título</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Valor estimado</label>
              <input type="number" step="0.01" min="0" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Opcional" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [categoryExpense, setCategoryExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const TX_LIMIT = 10;
  const yearOptions = recentYears();

  useEffect(() => {
    Promise.all([
      api.get(`/clubs/${id}`),
      api.get(`/clubs/${id}/years`),
    ]).then(([clubRes, yearsRes]) => {
      setClub(clubRes.data);
      const y = yearsRes.data;
      setYears(y);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedYear) return;
    Promise.all([
      api.get(`/clubs/${id}/summary?year=${selectedYear}`),
      api.get(`/financial/monthly/${id}/${selectedYear}`),
      api.get(`/financial/category-breakdown/${id}/${selectedYear}/receita`),
      api.get(`/financial/category-breakdown/${id}/${selectedYear}/despesa`),
      api.get(`/financial/transactions?club_id=${id}&fiscal_year=${selectedYear}&limit=${TX_LIMIT}&page=${txPage}`),
    ]).then(([s, m, cr, ce, tx]) => {
      setSummary(s.data);
      setMonthly(m.data.map((row) => ({ ...row, name: MONTH_NAMES[row.month - 1] })));
      setCategoryRevenue(cr.data.map((row) => ({
        category: row.category || 'Sem categoria',
        total: Number(row.total) || 0,
      })));
      setCategoryExpense(ce.data.map((row) => ({
        category: row.category || 'Sem categoria',
        total: Number(row.total) || 0,
      })));
      setTransactions(tx.data.data);
      setTxTotal(tx.data.meta.total);
    });
  }, [id, selectedYear, txPage]);

  if (loading) return <div><Navbar /><div className="loading">Carregando...</div></div>;
  if (!club) return <div><Navbar /><div className="empty">Clube não encontrado.</div></div>;

  return (
    <div>
      <Navbar />
      {showSuggestion && <SuggestionModal clubId={id} onClose={() => setShowSuggestion(false)} />}

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header do clube */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <ClubLogo src={club.logo_url} alt={club.name} fallback={club.short_name || club.name.slice(0, 3).toUpperCase()} size={80} fontSize={20} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{club.name}</h1>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {[club.city, club.state].filter(Boolean).join(' - ')}
              {club.founded_year && ` · Fundado em ${club.founded_year}`}
              {club.stadium && ` · ${club.stadium}`}
            </div>
            {club.description && <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>{club.description}</p>}
          </div>
          <button className="btn btn-outline" onClick={() => setShowSuggestion(true)}>
            Enviar sugestão
          </button>
        </div>

        {/* Seletor de ano */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>Ano fiscal:</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {yearOptions.map((y) => (
              <button
                key={y}
                className={`btn btn-sm ${selectedYear === y ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setSelectedYear(y); setTxPage(1); }}
              >
                {y}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Últimos 5 anos</span>
          <Link to="/comparar" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
            Comparar com outros clubes
          </Link>
        </div>

        {/* Resumo financeiro */}
        {summary && (
          <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#c6f6d5' }}>R</div>
              <div className="stat-info">
                <div className="stat-value positive">{currency(summary.receita)}</div>
                <div className="stat-label">Total Receitas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fed7d7' }}>D</div>
              <div className="stat-info">
                <div className="stat-value negative">{currency(summary.despesa)}</div>
                <div className="stat-label">Total Despesas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#bee3f8' }}>I</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--info)' }}>{currency(summary.investimento)}</div>
                <div className="stat-label">Investimentos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: summary.saldo >= 0 ? '#c6f6d5' : '#fed7d7' }}>SL</div>
              <div className="stat-info">
                <div className={`stat-value ${summary.saldo >= 0 ? 'positive' : 'negative'}`}>{currency(summary.saldo)}</div>
                <div className="stat-label">Saldo (R-D)</div>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico mensal */}
        {monthly.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Evolução Mensal {selectedYear}</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => currency(v)} tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v) => currency(v)} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#27a85a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#e53e3e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investimento" name="Investimento" fill="#3182ce" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráficos de pizza */}
        <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
          {categoryRevenue.length > 0 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Receitas por Categoria</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryRevenue} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}>
                    {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => currency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {categoryExpense.length > 0 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Despesas por Categoria</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryExpense} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}>
                    {categoryExpense.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => currency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tabela de transações */}
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Movimentações {selectedYear}</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Nenhuma movimentação encontrada.</td></tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                    <td>{tx.description}</td>
                    <td>{tx.category_name || '—'}</td>
                    <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                    <td style={{ fontWeight: 600, color: tx.type === 'receita' ? 'var(--success)' : tx.type === 'despesa' ? 'var(--danger)' : 'var(--info)' }}>
                      {currency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {txTotal > TX_LIMIT && (
            <div className="pagination">
              <button disabled={txPage === 1} onClick={() => setTxPage(txPage - 1)}>‹</button>
              <span style={{ padding: '0 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {txPage} / {Math.ceil(txTotal / TX_LIMIT)}
              </span>
              <button disabled={txPage >= Math.ceil(txTotal / TX_LIMIT)} onClick={() => setTxPage(txPage + 1)}>›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
