'use client';

import { useState } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (authToken: string) => {
    setToken(authToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}