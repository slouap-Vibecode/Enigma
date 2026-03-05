'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const ADMIN_TOKEN_KEY = 'enigma_admin_token';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le token depuis localStorage au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (savedToken) {
      // Valider le token avec le serveur
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Valider le token avec le serveur
  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch('/api/admin/enigma', {
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
        },
      });

      if (response.ok) {
        setToken(tokenToValidate);
      } else {
        // Token invalide, le supprimer
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
      }
    } catch (error) {
      // En cas d'erreur, garder le token pour le mode offline
      setToken(tokenToValidate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (authToken: string) => {
    setToken(authToken);
    // Sauvegarder le token dans localStorage
    localStorage.setItem(ADMIN_TOKEN_KEY, authToken);
  };

  const handleLogout = () => {
    setToken(null);
    // Supprimer le token de localStorage
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  // Afficher un loader pendant le chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}