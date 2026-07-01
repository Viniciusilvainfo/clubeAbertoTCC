import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(val || 0);
}

function recentYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const yearOptions = recentYears();
  const clubId = user?.club_id;

  useEffect(() => {
    if (!clubId) return;
    setSelectedYear(new Date().getFullYear());
  }, [clubId]);

  useEffect(() => {
    if (!clubId || !selectedYear) return;
    Promise.all([
      api.get(`/clubs/${clubId}/summary?year=${selectedYear}`),
      api.get(`/financial/monthly/${clubId}/${selectedYear}`),
      api.get(`/financial/transactions?club_id=${clubId}&fiscal_year=${selectedYear}&limit=5`),
    ]).then(([s, m, tx]) => {
      setSummary(s.data);
      setMonthly(m.data.map((r) => ({ ...r, name: MONTH_NAMES[r.month - 1] })));
      setRecentTx(tx.data.data);
    });
  }, [clubId, selectedYear]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.club_name || 'Meu Clube'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Ano fiscal (últimos 5 anos):</span>
          {yearOptions.map((y) => (
            <button
              key={y}
              className={`btn btn-sm ${selectedYear === y ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#c6f6d5' }}>R</div>
            <div className="stat-info">
              <div className="stat-value positive">{currency(summary.receita)}</div>
              <div className="stat-label">Receitas {selectedYear}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fed7d7' }}>D</div>
            <div className="stat-info">
              <div className="stat-value negative">{currency(summary.despesa)}</div>
              <div className="stat-label">Despesas {selectedYear}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#bee3f8' }}>I</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: 'var(--info)' }}>{currency(summary.investimento)}</div>
              <div className="stat-label">Investimentos {selectedYear}</div>
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
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Movimentação Mensal {selectedYear}</h2>
          <ResponsiveContainer width="100%" height={260}>
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

      {/* Transações recentes */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 700 }}>Movimentações recentes</h2>
          <Link to="/club-admin/transacoes" className="btn btn-outline btn-sm">Ver todas</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Validado</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Nenhuma movimentação.</td></tr>
              ) : recentTx.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  <td>{tx.description}</td>
                  <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                  <td style={{ fontWeight: 600, color: tx.type === 'receita' ? 'var(--success)' : tx.type === 'despesa' ? 'var(--danger)' : 'var(--info)' }}>
                    {currency(tx.amount)}
                  </td>
                  <td>{tx.is_validated ? <span className="badge badge-success">✓</span> : <span className="badge badge-warning">Pendente</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
