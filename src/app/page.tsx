import EnigmaPage from '@/components/EnigmaPage';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  return <EnigmaPage initialId={params.id} />;
}