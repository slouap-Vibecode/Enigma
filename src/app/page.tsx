import { Suspense } from 'react';
import EnigmaPage from '@/components/EnigmaPage';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Chargement...</p></div>}>
      <EnigmaPage initialId={params.id} />
    </Suspense>
  );
}