'use client';

import { useState, useEffect } from 'react';
import { EnigmaData } from '@/types/enigma';
import EnigmaForm from '@/components/EnigmaForm';
import Link from 'next/link';

interface EnigmaPageProps {
  initialId?: string;
}

export default function EnigmaPage({ initialId }: EnigmaPageProps) {
  const [enigmaData, setEnigmaData] = useState<EnigmaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enigmaId = initialId;

  // Floating admin button component
  const FloatingAdminButton = () => (
    <Link
      href="/admin"
      className="floating-admin-btn"
      title="Accéder à l'administration"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
        <path fill="currentColor" d="M9.18017 4.30565C9.09681 4.36823 9.04087 4.41023 9.00001 4.4384C8.95795 4.40957 8.90022 4.36627 8.81355 4.30126C8.55818 4.10969 8.05154 3.72964 6.95401 2.97618C5.35601 1.8766 2.73201 1.48869 1.19201 2.97618C0.426959 3.71393 -0.00233202 4.71883 9.52887e-06 5.76644C-0.00132645 6.82284 0.435633 7.83512 1.21201 8.57421L9.00001 16L16.788 8.57421C17.5644 7.83512 18.0013 6.82284 18 5.76644C18.0022 4.71858 17.5729 3.71344 16.808 2.97521C15.268 1.48772 12.644 1.8766 11.046 2.97521C9.94001 3.73521 9.43349 4.11548 9.18017 4.30565Z"/>
      </svg>
    </Link>
  );

  useEffect(() => {
    if (!enigmaId) {
      setEnigmaData(null);
      setLoading(false);
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
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1>Enigma</h1>
            <p>Pour accéder à une énigme, utilisez le paramètre ?id=nom_enigme</p>
            <p>Exemple: <code>?id=test</code></p>
          </div>
        </div>
        <FloatingAdminButton />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
        <FloatingAdminButton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1>Erreur</h1>
            <p>{error}</p>
          </div>
        </div>
        <FloatingAdminButton />
      </>
    );
  }

  if (!enigmaData) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p>Aucune énigme trouvée</p>
        </div>
        <FloatingAdminButton />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <EnigmaForm enigmaId={enigmaId} enigmaData={enigmaData} />
      </div>
      <FloatingAdminButton />
    </>
  );
}