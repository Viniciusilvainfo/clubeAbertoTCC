import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ROLES = { platform_admin: 'Admin Plataforma', club_admin: 'Admin Clube', fan: 'Torcedor' };
const EMPTY_FORM = { name: '', email: '', password: '', role: 'fan', club_id: '' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  async function fetchData() {
    setLoading(true);
    const [uRes, cRes] = await Promise.all([
      api.get('/users' + (filter ? `?role=${filter}` : '')),
      api.get('/clubs'),
    ]);
    setUsers(uRes.data);
    setClubs(cRes.data);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, [filter]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  }

  function openEdit(u) {
    setEditing(u.id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, club_id: u.club_id || '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, club_id: form.club_id || null };
      if (editing) {
        if (!payload.password) delete payload.password;
        await api.put(`/users/${editing}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(id) {
    if (!confirm('Desativar este usuário?')) return;
    await api.delete(`/users/${id}`);
    fetchData();
  }

  async function handleReactivate(id) {
    if (!confirm('Reativar este usuário?')) return;
    await api.put(`/users/${id}`, { is_active: true });
    fetchData();
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Usuários</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Usuário</button>
      </div>

      <div className="filters">
        {['', 'platform_admin', 'club_admin', 'fan'].map((r) => (
          <button key={r || 'all'} className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(r)}>
            {r === '' ? 'Todos' : ROLES[r]}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Clube</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum usuário.</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role === 'platform_admin' ? 'danger' : u.role === 'club_admin' ? 'info' : 'gray'}`}>{ROLES[u.role]}</span></td>
                    <td>{u.club_name || '—'}</td>
                    <td>{u.is_active ? <span className="badge badge-success">Ativo</span> : <span className="badge badge-danger">Inativo</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Editar</button>
                        {u.is_active ? (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(u.id)}>Desativar</button>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => handleReactivate(u.id)}>Reativar</button>
                        )}
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
              <h2 className="modal-title">{editing ? 'Editar' : 'Novo'} Usuário</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail *</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">{editing ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}</label>
                <input type="password" className="form-control" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required={!editing} minLength={editing ? 0 : 6} />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Perfil *</label>
                  <select className="form-control" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                    {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Clube</label>
                  <select className="form-control" value={form.club_id} onChange={(e) => setForm((f) => ({ ...f, club_id: e.target.value }))}>
                    <option value="">Nenhum</option>
                    {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
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
