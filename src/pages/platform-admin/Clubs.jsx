import React, { useEffect, useState } from 'react';
import ClubLogo from '../../components/ClubLogo';
import api from '../../services/api';

const EMPTY_FORM = { name: '', short_name: '', founded_year: '', city: '', state: '', stadium: '', description: '', logo_url: '' };

export default function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  async function fetchClubs() {
    setLoading(true);
    const res = await api.get('/clubs');
    setClubs(res.data);
    setLoading(false);
  }

  useEffect(() => { fetchClubs(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setLogoFile(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(c) {
    setEditing(c.id);
    setForm({ name: c.name, short_name: c.short_name || '', founded_year: c.founded_year || '', city: c.city || '', state: c.state || '', stadium: c.stadium || '', description: c.description || '', logo_url: c.logo_url || '' });
    setLogoFile(null);
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value ?? ''));
      if (logoFile) payload.append('logo', logoFile);
      if (editing) {
        await api.put(`/clubs/${editing}`, payload);
      } else {
        await api.post('/clubs', payload);
      }
      setShowModal(false);
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Desativar este clube?')) return;
    await api.delete(`/clubs/${id}`);
    fetchClubs();
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clubes</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Clube</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Clube</th>
                  <th>Sigla</th>
                  <th>Cidade/UF</th>
                  <th>Fundação</th>
                  <th>Estádio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clubs.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum clube cadastrado.</td></tr>
                ) : clubs.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <ClubLogo src={c.logo_url} alt={c.name} fallback={(c.short_name || c.name.slice(0, 2)).toUpperCase()} size={40} fontSize={12} fallbackBackground="var(--surface-muted)" />
                    </td>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.short_name || '—'}</td>
                    <td>{[c.city, c.state].filter(Boolean).join(' - ') || '—'}</td>
                    <td>{c.founded_year || '—'}</td>
                    <td>{c.stadium || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar' : 'Novo'} Clube</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="grid grid-2">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Nome completo *</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sigla</label>
                  <input className="form-control" value={form.short_name} onChange={(e) => setForm((f) => ({ ...f, short_name: e.target.value }))} maxLength={10} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ano de fundação</label>
                  <input type="number" className="form-control" value={form.founded_year} onChange={(e) => setForm((f) => ({ ...f, founded_year: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input className="form-control" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado (UF)</label>
                  <input className="form-control" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} maxLength={2} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Estádio</label>
                  <input className="form-control" value={form.stadium} onChange={(e) => setForm((f) => ({ ...f, stadium: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Descrição</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Anexar logo</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                  {form.logo_url && !logoFile && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ClubLogo src={form.logo_url} alt={form.name} fallback={(form.short_name || form.name.slice(0, 2)).toUpperCase()} size={48} fontSize={14} fallbackBackground="var(--surface-muted)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Logo atual</span>
                    </div>
                  )}
                </div>
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
