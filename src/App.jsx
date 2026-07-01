import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/public/Home';
import ClubList from './pages/public/ClubList';
import ClubDetail from './pages/public/ClubDetail';
import Compare from './pages/public/Compare';
import Account from './pages/public/Account';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ClubAdminLayout from './pages/club-admin/Layout';
import ClubAdminDashboard from './pages/club-admin/Dashboard';
import ClubAdminTransactions from './pages/club-admin/Transactions';
import ClubAdminSuggestions from './pages/club-admin/Suggestions';
import ClubAdminProfile from './pages/club-admin/Profile';

import AdminLayout from './pages/platform-admin/Layout';
import AdminDashboard from './pages/platform-admin/Dashboard';
import AdminClubs from './pages/platform-admin/Clubs';
import AdminUsers from './pages/platform-admin/Users';
import AdminTransactions from './pages/platform-admin/Transactions';
import AdminSuggestions from './pages/platform-admin/Suggestions';
import MiniChat from './components/MiniChat';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubes" element={<ClubList />} />
          <Route path="/clubes/:id" element={<ClubDetail />} />
          <Route path="/comparar" element={<Compare />} />
          <Route path="/conta" element={
            <PrivateRoute roles={['fan']}>
              <Account />
            </PrivateRoute>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route path="/club-admin" element={
            <PrivateRoute roles={['club_admin']}>
              <ClubAdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<ClubAdminDashboard />} />
            <Route path="transacoes" element={<ClubAdminTransactions />} />
            <Route path="sugestoes" element={<ClubAdminSuggestions />} />
            <Route path="perfil" element={<ClubAdminProfile />} />
          </Route>

          <Route path="/admin" element={
            <PrivateRoute roles={['platform_admin']}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="clubes" element={<AdminClubs />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="transacoes" element={<AdminTransactions />} />
            <Route path="sugestoes" element={<AdminSuggestions />} />
          </Route>

          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h1>404</h1>
              <p>Página não encontrada.</p>
              <a href="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Voltar ao início</a>
            </div>
          } />
        </Routes>
        <MiniChat />
      </AuthProvider>
    </BrowserRouter>
  );
}
