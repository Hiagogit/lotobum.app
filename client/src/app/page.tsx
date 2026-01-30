'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona direto para o dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="animate-pulse text-xl">Carregando...</div>
    </main>
  );
}
