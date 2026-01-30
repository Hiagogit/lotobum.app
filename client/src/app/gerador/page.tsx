'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import {
  DiceIcon,
  SaveIcon,
  PhoneIcon,
  RefreshIcon,
  LightbulbIcon,
  CloverIcon,
} from '@/components/Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

const loterias = [
  { id: 'megasena', nome: 'Mega-Sena', qtdNumeros: 6, max: 60 },
  { id: 'lotofacil', nome: 'Lotofácil', qtdNumeros: 15, max: 25 },
  { id: 'quina', nome: 'Quina', qtdNumeros: 5, max: 80 },
  { id: 'lotomania', nome: 'Lotomania', qtdNumeros: 50, max: 100 },
  { id: 'duplasena', nome: 'Dupla Sena', qtdNumeros: 6, max: 50 },
  { id: 'diadesorte', nome: 'Dia de Sorte', qtdNumeros: 7, max: 31 },
];

export default function GeradorPage() {
  const [selectedLoteria, setSelectedLoteria] = useState(loterias[0]);
  const [numerosGerados, setNumerosGerados] = useState<number[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [salvando, setSalvando] = useState(false);

  const gerarNumeros = () => {
    const numeros = new Set<number>();
    while (numeros.size < selectedLoteria.qtdNumeros) {
      numeros.add(Math.floor(Math.random() * selectedLoteria.max) + 1);
    }
    const sorted = Array.from(numeros).sort((a, b) => a - b);
    setNumerosGerados(sorted);
  };

  const gerarMultiplosJogos = () => {
    const jogos: number[][] = [];
    for (let i = 0; i < quantidade; i++) {
      const numeros = new Set<number>();
      while (numeros.size < selectedLoteria.qtdNumeros) {
        numeros.add(Math.floor(Math.random() * selectedLoteria.max) + 1);
      }
      jogos.push(Array.from(numeros).sort((a, b) => a - b));
    }
    return jogos;
  };

  const handleGerarMultiplos = () => {
    const jogos = gerarMultiplosJogos();
    console.log('Jogos gerados:', jogos);
    // Por enquanto, mostra apenas o primeiro jogo
    if (jogos.length > 0) {
      setNumerosGerados(jogos[0]);
    }
  };

  const handleSalvarJogo = async () => {
    if (numerosGerados.length === 0) {
      alert('Gere um jogo primeiro!');
      return;
    }

    setSalvando(true);
    try {
      const response = await axios.post(`${API_URL}/${API_VERSION}/api/games/save`, {
        gameType: selectedLoteria.id,
        numbers: numerosGerados,
      });

      if (response.data.success) {
        alert('Jogo salvo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      alert('Erro ao salvar jogo. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleWhatsApp = () => {
    if (numerosGerados.length === 0) {
      alert('Gere um jogo primeiro!');
      return;
    }

    const message = `*Loto Bum* - Meu Jogo de ${selectedLoteria.nome}\n\nNumeros: ${numerosGerados.map(n => String(n).padStart(2, '0')).join(' - ')}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="glass-card p-6 mb-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <DiceIcon size={32} /> Gerador de Jogos
          </h2>

          {/* Seleção de Loteria */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Escolha a Loteria:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {loterias.map((loteria) => (
                <button
                  key={loteria.id}
                  onClick={() => {
                    setSelectedLoteria(loteria);
                    setNumerosGerados([]);
                  }}
                  className={`p-4 rounded-lg transition-all ${
                    selectedLoteria.id === loteria.id
                      ? 'bg-luck-green text-black font-bold'
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                >
                  <div className="font-semibold">{loteria.nome}</div>
                  <div className="text-sm opacity-70">
                    {loteria.qtdNumeros} números de 1 a {loteria.max}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade de Jogos */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Quantidade de Jogos:
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min="1"
                max="10"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-24 px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-luck-green"
              />
              <span className="text-sm text-gray-400">
                Gere até 10 jogos de uma vez
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={gerarNumeros}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <DiceIcon size={20} /> Gerar Jogo Único
            </button>
            {quantidade > 1 && (
              <button
                onClick={handleGerarMultiplos}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <DiceIcon size={20} /> Gerar {quantidade} Jogos
              </button>
            )}
          </div>
        </div>

        {/* Resultado */}
        {numerosGerados.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold mb-4 text-luck-green">
              Números Gerados para {selectedLoteria.nome}
            </h3>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {numerosGerados.map((num, index) => (
                <div
                  key={index}
                  className="w-16 h-16 flex items-center justify-center bg-luck-green text-black text-xl font-bold rounded-full animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {String(num).padStart(2, '0')}
                </div>
              ))}
            </div>

            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-400 mb-2">
                Números para impressão ou apostas:
              </p>
              <p className="text-lg font-mono text-center">
                {numerosGerados.map(n => String(n).padStart(2, '0')).join(' - ')}
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="grid md:grid-cols-3 gap-3">
              <button
                onClick={handleSalvarJogo}
                disabled={salvando}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <SaveIcon size={20} /> {salvando ? 'Salvando...' : 'Salvar Jogo'}
              </button>

              <button
                onClick={handleWhatsApp}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <PhoneIcon size={20} /> Compartilhar WhatsApp
              </button>

              <button
                onClick={gerarNumeros}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <RefreshIcon size={20} /> Gerar Outros Números
              </button>
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="glass-card p-6 mt-6">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LightbulbIcon size={24} /> Dicas Importantes
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li>• Os números são gerados de forma totalmente aleatória</li>
            <li>• Cada jogo tem as mesmas chances de ser sorteado</li>
            <li>• Não existe padrão ou estratégia que garanta vitória</li>
            <li>• Salve seus jogos favoritos para não perdê-los</li>
            <li>• Compartilhe seus jogos com amigos pelo WhatsApp</li>
            <li>• Jogue com responsabilidade e dentro do seu orçamento</li>
            <li className="flex items-center gap-2">• Boa sorte! <CloverIcon className="text-luck-green" size={18} /></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
