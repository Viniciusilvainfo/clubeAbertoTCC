import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(val || 0);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get(`/admin/report?fiscal_year=${year}`),
    ]).then(([s, r]) => {
      setStats(s.data);
      setReport(r.data);
    }).finally(() => setLoading(false));
  }, [year]);

  const barData = report?.data.slice(0, 8).map((c) => ({
    name: c.short_name || c.club_name.split(' ')[0],
    Receita: c.receita,
    Despesa: c.despesa,
  }));

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Painel Administrativo</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <button key={y} className={`btn btn-sm ${year === y ? 'btn-primary' : 'btn-outline'}`} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-3" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#c6f6d5' }}>🏟️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total_clubs}</div>
              <div className="stat-label">Clubes ativos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#bee3f8' }}>👥</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total_users}</div>
              <div className="stat-label">Usuários</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fefcbf' }}>TX</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total_transactions}</div>
              <div className="stat-label">Transações ({currency(stats.total_amount)})</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fed7d7' }}>SG</div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending_suggestions}</div>
              <div className="stat-label">Sugestões pendentes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fefcbf' }}>⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending_validation}</div>
              <div className="stat-label">Aguardando validação</div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico comparativo */}
      {barData && barData.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Receita vs Despesa por Clube {year}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => currency(v)} tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => currency(v)} />
              <Legend />
              <Bar dataKey="Receita" fill="#27a85a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesa" fill="#e53e3e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabela resumo */}
      {report && (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resumo Financeiro {year}</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Clube</th>
                  <th>Receita</th>
                  <th>Despesa</th>
                  <th>Investimento</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {report.data.map((c) => (
                  <tr key={c.club_name}>
                    <td><strong>{c.club_name}</strong></td>
                    <td className="positive">{currency(c.receita)}</td>
                    <td className="negative">{currency(c.despesa)}</td>
                    <td style={{ color: 'var(--info)' }}>{currency(c.investimento)}</td>
                    <td className={c.saldo >= 0 ? 'positive' : 'negative'}>{currency(c.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
