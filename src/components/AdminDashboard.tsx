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
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [editingEnigma, setEditingEnigma] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Afficher l'info de session au focus de la page
  useEffect(() => {
    const handleFocus = () => {
      setShowSessionInfo(true);
      setTimeout(() => setShowSessionInfo(false), 2000);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const searchParams = useSearchParams();
  const router = useRouter();

  const newEnigma = searchParams?.get('new');
  const delEnigma = searchParams?.get('del');
  const editEnigma = searchParams?.get('edit');

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

  const handleEditEnigma = (enigmaName: string) => {
    router.push(`/admin?edit=${encodeURIComponent(enigmaName)}`);
  };

  const handleDoubleClick = (enigma: string) => {
    setEditingEnigma(enigma);
    setEditingName(enigma);
  };

  const handleRename = async (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) {
      setEditingEnigma(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/enigma/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldName: oldName,
          newName: newName.trim(),
        }),
      });

      if (response.ok) {
        await loadEnigmas();
        setSelectedEnigma(''); // Désélectionner après renommage
        setEditingEnigma(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du renommage');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, oldName: string) => {
    if (e.key === 'Enter') {
      handleRename(oldName, editingName);
    } else if (e.key === 'Escape') {
      setEditingEnigma(null);
      setEditingName('');
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

  if (editEnigma) {
    return (
      <EditEnigmaForm
        enigmaName={editEnigma}
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

      {showSessionInfo && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          zIndex: 1000,
          fontSize: 'small'
        }}>
          ✅ Session maintenue - Connecté en tant qu'admin
        </div>
      )}

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

      {enigmas.length > 0 && (
        <p style={{ fontSize: 'small', color: '#999', textAlign: 'center', marginBottom: '15px' }}>
          💡 Double-cliquez sur un nom pour le renommer • Utilisez Entrée pour valider • Échap pour annuler
        </p>
      )}

      <div className="select-enigma">
        {enigmas.map((enigma) => (
          <div key={enigma} className="field" style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minHeight: '52px'
            }}>
              <input
                type="radio"
                id={enigma}
                name="del"
                value={enigma}
                checked={selectedEnigma === enigma}
                onChange={(e) => setSelectedEnigma(e.target.value)}
                disabled={editingEnigma === enigma}
              />
              {editingEnigma === enigma ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, enigma)}
                  onBlur={() => handleRename(enigma, editingName)}
                  autoFocus
                  style={{
                    marginLeft: '10px',
                    padding: '12px 15px',
                    border: '2px solid white',
                    borderRadius: '6px',
                    backgroundColor: '#333',
                    color: 'white',
                    fontSize: 'inherit',
                    height: '52px',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <label
                  htmlFor={enigma}
                  onDoubleClick={() => handleDoubleClick(enigma)}
                  style={{
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  title="Double-cliquez pour renommer"
                >
                  {enigma}
                </label>
              )}
            </div>
            <button
              onClick={() => handleEditEnigma(enigma)}
              className="btn"
              disabled={editingEnigma === enigma}
              style={{
                padding: '12px 15px',
                fontSize: 'small',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '52px',
                boxSizing: 'border-box',
                flexShrink: 0,
                opacity: editingEnigma === enigma ? 0.5 : 1,
                pointerEvents: editingEnigma === enigma ? 'none' : 'auto',
                marginRight: '10px'
              }}
              title={`Éditer l'énigme "${enigma}"`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: '5px' }}>
                <path fill="currentColor" fillRule="evenodd" d="M35.5226 3.85398L33.3386 6.04201L41.9345 14.6508L44.1202 12.461L44.2555 12.3163C45.2922 11.1324 45.2471 9.32292 44.1202 8.1934L39.7882 3.85447L39.6478 3.72321C38.4935 2.71687 36.6138 2.76104 35.5226 3.85398ZM39.8141 16.7751L31.2182 8.16622L6.0138 33.4168L5.91194 33.5297C5.78419 33.6867 5.68919 33.8685 5.63294 34.0647L3.05775 43.0866L3.02427 43.23C2.93675 43.7103 3.08864 44.2073 3.43665 44.5573C3.72181 44.8446 4.10657 45 4.50013 45C4.63489 45 4.77161 44.9814 4.90443 44.9443L13.9542 42.4084L14.1003 42.3592C14.2911 42.2839 14.4654 42.1697 14.6115 42.0243L39.8141 16.7751Z" clipRule="evenodd"/>
              </svg>
              Éditer
            </button>
            <a
              href={`/?id=${encodeURIComponent(enigma)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                padding: '12px 15px',
                fontSize: 'small',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '52px',
                boxSizing: 'border-box',
                flexShrink: 0,
                opacity: editingEnigma === enigma ? 0.5 : 1,
                pointerEvents: editingEnigma === enigma ? 'none' : 'auto'
              }}
              title={`Ouvrir l'énigme "${enigma}" dans un nouvel onglet`}
            >
              🔗 Ouvrir
            </a>
          </div>
        ))}
      </div>

      {enigmas.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn supprimer-button"
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
            style={{ marginRight: '10px' }}
          />
          <a
            href={`/?id=${encodeURIComponent(enigmaName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            title={`Prévisualiser l'énigme "${enigmaName}"`}
          >
            🔗 Prévisualiser
          </a>
        </div>
      </form>
    </div>
  );
}

interface EditEnigmaFormProps {
  enigmaName: string;
  token: string;
  onCancel: () => void;
  onSuccess: () => void;
}

function EditEnigmaForm({ enigmaName, token, onCancel, onSuccess }: EditEnigmaFormProps) {
  const [passwords, setPasswords] = useState<string[]>(['']);
  const [reward, setReward] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing enigma data
  useEffect(() => {
    const loadEnigmaData = async () => {
      try {
        const response = await fetch(`/api/enigma/${encodeURIComponent(enigmaName)}`);
        if (response.ok) {
          const data = await response.json();
          setPasswords(data.passwords);
          setReward(data.reward);
        } else {
          setError('Impossible de charger les données de l\'énigme');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoadingData(false);
      }
    };

    loadEnigmaData();
  }, [enigmaName]);

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
        method: 'PUT',
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
        setError('Erreur lors de la modification de l\'énigme');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des données de l'énigme...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <p className="enigma-title">Éditer : {enigmaName}</p>

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
            value={loading ? 'Modification...' : 'Sauvegarder'}
            disabled={loading}
            style={{ marginRight: '10px' }}
          />
          <a
            href={`/?id=${encodeURIComponent(enigmaName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            title={`Prévisualiser l'énigme "${enigmaName}"`}
          >
            🔗 Prévisualiser
          </a>
        </div>
      </form>
    </div>
  );
}