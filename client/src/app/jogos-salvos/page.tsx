'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { SaveIcon, ShareIcon, TrashIcon } from '@/components/Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

interface SavedGame {
  id: string;
  game_type: string;
  numbers: number[];
  created_at: string;
}

const loteriaNames: { [key: string]: string } = {
  megasena: 'Mega-Sena',
  lotofacil: 'Lotofácil',
  quina: 'Quina',
  lotomania: 'Lotomania',
  duplasena: 'Dupla Sena',
  diadesorte: 'Dia de Sorte',
};

export default function JogosSalvosPage() {
  const [jogos, setJogos] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    carregarJogos();
  }, []);

  const carregarJogos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${API_VERSION}/api/games/history`);
      setJogos(response.data.games || []);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const jogosFiltrados = jogos.filter(jogo =>
    filtro === 'todos' || jogo.game_type === filtro
  );

  const formatarData = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompartilhar = (jogo: SavedGame) => {
    const nome = loteriaNames[jogo.game_type] || jogo.game_type;
    const numeros = jogo.numbers.map(n => String(n).padStart(2, '0')).join(' - ');
    const message = `*Loto Bum* - Meu Jogo de ${nome}\n\nNumeros: ${numeros}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${API_VERSION}/api/games/${id}`);
      setJogos(jogos.filter(jogo => jogo.id !== id));
    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
      alert('Erro ao excluir jogo. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="glass-card p-6 mb-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <SaveIcon size={32} /> Jogos Salvos
          </h2>

          {/* Filtro */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Filtrar por Loteria:
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltro('todos')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filtro === 'todos'
                    ? 'bg-luck-green text-black font-semibold'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
              >
                Todos
              </button>
              {Object.entries(loteriaNames).map(([id, nome]) => (
                <button
                  key={id}
                  onClick={() => setFiltro(id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filtro === id
                      ? 'bg-luck-green text-black font-semibold'
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                >
                  {nome}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Total de jogos salvos: {jogosFiltrados.length}
          </div>
        </div>

        {/* Lista de Jogos */}
        {loading ? (
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">Carregando jogos salvos...</div>
          </div>
        ) : jogosFiltrados.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400 mb-4">
              {filtro === 'todos'
                ? 'Nenhum jogo salvo ainda.'
                : `Nenhum jogo de ${loteriaNames[filtro]} salvo ainda.`}
            </p>
            <p className="text-sm text-gray-500">
              Gere e salve jogos na página do Gerador!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jogosFiltrados.map((jogo) => (
              <div key={jogo.id} className="glass-card p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-luck-green">
                    {loteriaNames[jogo.game_type] || jogo.game_type}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Salvo em: {formatarData(jogo.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {jogo.numbers.map((num, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 flex items-center justify-center bg-luck-green text-black text-sm font-bold rounded-full"
                    >
                      {String(num).padStart(2, '0')}
                    </div>
                  ))}
                </div>

                <div className="bg-black/30 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-400 mb-1">Números:</p>
                  <p className="text-sm font-mono text-center">
                    {jogo.numbers.map(n => String(n).padStart(2, '0')).join(' - ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCompartilhar(jogo)}
                    className="btn-secondary text-sm flex items-center justify-center gap-2"
                  >
                    <ShareIcon size={16} /> Compartilhar
                  </button>
                  <button
                    onClick={() => handleExcluir(jogo.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <TrashIcon size={16} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
