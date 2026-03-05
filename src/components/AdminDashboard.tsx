'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [enigmas, setEnigmas] = useState<string[]>([]);
  const [newEnigmaName, setNewEnigmaName] = useState('');
  const [selectedEnigma, setSelectedEnigma] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const newEnigma = searchParams?.get('new');
  const delEnigma = searchParams?.get('del');

  useEffect(() => {
    loadEnigmas();
  }, []);

  useEffect(() => {
    if (delEnigma) {
      handleDeleteEnigma(delEnigma);
    }
  }, [delEnigma]);

  const loadEnigmas = async () => {
    try {
      const response = await fetch('/api/admin/enigma', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnigmas(data.enigmas);
      }
    } catch (err) {
      console.error('Error loading enigmas:', err);
    }
  };

  const handleDeleteEnigma = async (enigmaId: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'énigme "${enigmaId}" ?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/enigma?id=${enigmaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadEnigmas();
        router.push('/admin');
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEnigma = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnigmaName.trim()) {
      router.push(`/admin?new=${encodeURIComponent(newEnigmaName.trim())}`);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEnigma) {
      router.push(`/admin?del=${encodeURIComponent(selectedEnigma)}`);
    }
  };

  if (newEnigma) {
    return (
      <CreateEnigmaForm
        enigmaName={newEnigma}
        token={token}
        onCancel={() => router.push('/admin')}
        onSuccess={() => {
          loadEnigmas();
          router.push('/admin');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div style={{ textAlign: 'right' }}>
        <button
          className="logout btn"
          onClick={onLogout}
        >
          Déconnexion
        </button>
      </div>

      <h1>Enigma</h1>

      {error && (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      )}

      <form onSubmit={handleCreateEnigma}>
        <div className="field field-inline">
          <input
            type="text"
            value={newEnigmaName}
            onChange={(e) => setNewEnigmaName(e.target.value)}
            placeholder="Nom de la nouvelle énigme"
            className="no-margin-left"
          />
        </div>
        <input type="submit" value="+" className="plus-button" />
      </form>

      <div className="select-enigma">
        {enigmas.map((enigma) => (
          <div key={enigma} className="field">
            <input
              type="radio"
              id={enigma}
              name="del"
              value={enigma}
              checked={selectedEnigma === enigma}
              onChange={(e) => setSelectedEnigma(e.target.value)}
            />
            <label htmlFor={enigma}>{enigma}</label>
          </div>
        ))}
      </div>

      {enigmas.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn"
            onClick={handleDeleteSelected}
            disabled={!selectedEnigma || loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      )}
    </div>
  );
}

interface CreateEnigmaFormProps {
  enigmaName: string;
  token: string;
  onCancel: () => void;
  onSuccess: () => void;
}

function CreateEnigmaForm({ enigmaName, token, onCancel, onSuccess }: CreateEnigmaFormProps) {
  const [passwords, setPasswords] = useState<string[]>(['']);
  const [reward, setReward] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (index: number, value: string) => {
    const newPasswords = [...passwords];
    newPasswords[index] = value;
    setPasswords(newPasswords);
  };

  const addField = (index: number) => {
    if (passwords[index].trim() !== '') {
      const newPasswords = [...passwords];
      newPasswords.splice(index + 1, 0, '');
      setPasswords(newPasswords);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredPasswords = passwords.filter(p => p.trim() !== '');

    if (filteredPasswords.length === 0 || !reward.trim()) {
      setError('Veuillez remplir au moins un mot de passe et une récompense');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/enigma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: enigmaName,
          passwords: filteredPasswords,
          reward: reward.trim(),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError('Erreur lors de la création de l\'énigme');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <p className="enigma-title">{enigmaName}</p>

      <form onSubmit={handleSubmit}>
        {passwords.map((password, index) => (
          <div key={index} className="field">
            <label htmlFor={`password-${index}`}>{index + 1}</label>
            <input
              id={`password-${index}`}
              type="text"
              value={password}
              onChange={(e) => handlePasswordChange(index, e.target.value)}
            />
            {index === passwords.length - 1 && password.trim() !== '' && (
              <button
                type="button"
                className="plus-button"
                onClick={() => addField(index)}
              >
                +
              </button>
            )}
          </div>
        ))}

        <div className="field field-column">
          <label className="mt-20">Récompense</label>
          <textarea
            rows={3}
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="max-width-90"
          />
        </div>

        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            className="btn"
            onClick={onCancel}
            style={{ marginRight: '10px' }}
          >
            Annuler
          </button>
          <input
            type="submit"
            value={loading ? 'Création...' : 'Envoyer'}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}