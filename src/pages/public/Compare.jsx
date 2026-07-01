import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

function currency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(val);
}

function recentYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

const COLORS = ['#27a85a', '#e53e3e', '#3182ce', '#d69e2e', '#805ad5'];

export default function Compare() {
  const [clubs, setClubs] = useState([]);
  const [clubFilter, setClubFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const yearOptions = recentYears();
  const visibleClubs = clubs.filter((club) => {
    const term = clubFilter.trim().toLowerCase();
    if (!term) return true;
    return [club.name, club.short_name].filter(Boolean).some((field) => field.toLowerCase().includes(term));
  });

  useEffect(() => {
    api.get('/clubs').then((res) => setClubs(res.data));
  }, []);

  function toggleClub(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 5 ? [...prev, id] : prev
    );
    setCompareData(null);
  }

  async function handleCompare() {
    if (selected.length < 2) return;
    setLoading(true);
    try {
      const res = await api.get(`/financial/compare?clubs=${selected.join(',')}&fiscal_year=${year}`);
      setCompareData(res.data);
    } finally {
      setLoading(false);
    }
  }

  const barData = compareData?.data.map((c) => ({
    name: c.short_name || c.name,
    Receita: c.receita,
    Despesa: c.despesa,
    Investimento: c.investimento,
  }));

  const radarData = compareData ? [
    { metric: 'Receita', ...Object.fromEntries(compareData.data.map((c) => [c.short_name || c.name, c.receita])) },
    { metric: 'Despesa', ...Object.fromEntries(compareData.data.map((c) => [c.short_name || c.name, c.despesa])) },
    { metric: 'Investimento', ...Object.fromEntries(compareData.data.map((c) => [c.short_name || c.name, c.investimento])) },
    { metric: 'Saldo', ...Object.fromEntries(compareData.data.map((c) => [c.short_name || c.name, Math.max(0, c.saldo)])) },
  ] : [];

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="page-header">
          <h1 className="page-title">Comparar Clubes</h1>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ano fiscal</label>
              <select className="form-control" value={year} onChange={(e) => { setYear(parseInt(e.target.value)); setCompareData(null); }}>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, minWidth: 240 }}>
              <label className="form-label">Filtrar times</label>
              <input className="form-control" value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} placeholder="Digite parte do nome" />
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', alignSelf: 'flex-end', paddingBottom: '0.5rem' }}>
              Período disponível: últimos 5 anos. Selecione de 2 a 5 clubes para comparar.
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {visibleClubs.map((club) => {
              const sel = selected.includes(club.id);
              const idx = selected.indexOf(club.id);
              return (
                <button
                  key={club.id}
                  onClick={() => toggleClub(club.id)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '999px',
                    border: `2px solid ${sel ? COLORS[idx] : 'var(--border)'}`,
                    background: sel ? COLORS[idx] : 'transparent',
                    color: sel ? '#fff' : 'var(--text)',
                    fontWeight: sel ? 600 : 400,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {club.short_name || club.name}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={selected.length < 2 || loading}
          >
            {loading ? 'Comparando...' : 'Comparar Clubes'}
          </button>
        </div>

        {compareData && (
          <>
            {/* Tabela comparativa */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Comparativo {compareData.fiscal_year}</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Clube</th>
                      <th>Receita Total</th>
                      <th>Despesa Total</th>
                      <th>Investimentos</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareData.data.map((c, i) => (
                      <tr key={c.id}>
                        <td>
                          <span style={{ display: 'inline-block', width: '0.6rem', height: '0.6rem', borderRadius: '50%', background: COLORS[i], marginRight: '0.5rem' }} />
                          <strong>{c.name}</strong>
                        </td>
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

            {/* Gráfico de barras */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Comparação por Indicador</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => currency(v)} tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => currency(v)} />
                  <Legend />
                  <Bar dataKey="Receita" fill="#27a85a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Despesa" fill="#e53e3e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Investimento" fill="#3182ce" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar */}
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Radar Financeiro</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis tickFormatter={(v) => currency(v)} tick={{ fontSize: 10 }} />
                  {compareData.data.map((c, i) => (
                    <Radar
                      key={c.id}
                      name={c.short_name || c.name}
                      dataKey={c.short_name || c.name}
                      stroke={COLORS[i]}
                      fill={COLORS[i]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                  <Tooltip formatter={(v) => currency(v)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
