import React, { useEffect, useState } from 'react';
import ClubLogo from '../../components/ClubLogo';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ClubAdminProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.club_id) return;
    api.get(`/clubs/${user.club_id}`).then((res) => {
      const c = res.data;
      setForm({
        name: c.name || '',
        short_name: c.short_name || '',
        founded_year: c.founded_year || '',
        city: c.city || '',
        state: c.state || '',
        stadium: c.stadium || '',
        description: c.description || '',
        logo_url: c.logo_url || '',
      });
        setLogoFile(null);
    });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value ?? ''));
      if (logoFile) payload.append('logo', logoFile);
      await api.put(`/clubs/${user.club_id}`, payload);
      setMessage('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div className="loading">Carregando...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Perfil do Clube</h1>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Nome completo *</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Sigla (ex: FLA)</label>
              <input className="form-control" value={form.short_name} onChange={(e) => setForm((f) => ({ ...f, short_name: e.target.value }))} maxLength={10} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Ano de fundação</label>
              <input type="number" className="form-control" value={form.founded_year} onChange={(e) => setForm((f) => ({ ...f, founded_year: e.target.value }))} min={1800} max={new Date().getFullYear()} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado (UF)</label>
              <input className="form-control" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} maxLength={2} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input className="form-control" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Estádio</label>
              <input className="form-control" value={form.stadium} onChange={(e) => setForm((f) => ({ ...f, stadium: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Anexar logo</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            {form.logo_url && !logoFile && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ClubLogo src={form.logo_url} alt="Logo atual" fallback={(form.short_name || form.name.slice(0, 2)).toUpperCase()} size={48} fontSize={14} fallbackBackground="var(--surface-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Logo atual</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-control" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
