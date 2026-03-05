'use client';

import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      if (response.ok) {
        onLogin(token.trim());
      } else {
        setError('Token invalide');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Enigma</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token administrateur"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
          )}
          <input
            type="submit"
            value={isLoading ? 'Connexion...' : 'Connexion'}
            disabled={isLoading || !token.trim()}
          />
        </form>
      </div>
    </div>
  );
}