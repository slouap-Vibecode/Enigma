'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EnigmaData } from '@/types/enigma';
import EnigmaForm from '@/components/EnigmaForm';

export default function Home() {
  const searchParams = useSearchParams();
  const [enigmaData, setEnigmaData] = useState<EnigmaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enigmaId = searchParams?.get('id');

  useEffect(() => {
    if (!enigmaId) {
      setEnigmaData(null);
      return;
    }

    const fetchEnigma = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/enigma/${enigmaId}`);
        if (response.ok) {
          const data = await response.json();
          setEnigmaData(data);
        } else if (response.status === 404) {
          setError('Énigme introuvable');
        } else {
          setError('Erreur lors du chargement de l\'énigme');
        }
      } catch (err) {
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchEnigma();
  }, [enigmaId]);

  if (!enigmaId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1>Enigma</h1>
          <p>Pour accéder à une énigme, utilisez le paramètre ?id=nom_enigme</p>
          <p>Exemple: <code>?id=test</code></p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1>Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!enigmaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Aucune énigme trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <EnigmaForm enigmaId={enigmaId} enigmaData={enigmaData} />
    </div>
  );
}