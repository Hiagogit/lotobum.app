'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  HomeIcon,
  TargetIcon,
  DiceIcon,
  SaveIcon,
  ChartBarIcon,
  ChartLineIcon,
  CloverIcon,
} from './Icons';

interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks: NavLink[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon size={18} /> },
    { href: '/resultados', label: 'Resultados', icon: <TargetIcon size={18} /> },
    { href: '/gerador', label: 'Gerador', icon: <DiceIcon size={18} /> },
    { href: '/jogos-salvos', label: 'Jogos Salvos', icon: <SaveIcon size={18} /> },
    { href: '/probabilidades', label: 'Probabilidades', icon: <ChartBarIcon size={18} /> },
    { href: '/estatisticas', label: 'Estatísticas', icon: <ChartLineIcon size={18} /> },
  ];

  return (
    <nav className="glass-card mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Loto Bum <CloverIcon className="text-luck-green" size={24} />
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isActive(link.href)
                  ? 'bg-luck-green text-black font-semibold'
                  : 'bg-black/30 hover:bg-black/50'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
