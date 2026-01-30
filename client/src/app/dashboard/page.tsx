'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { loterias, getLatestResult, LoteriaResult, formatCurrency } from '@/lib/loteriasApi';
import {
  CloverIcon,
  TargetIcon,
  DiceIcon,
  ChartLineIcon,
  TrophyIcon,
  ChartBarIcon,
  InfoIcon,
  WarningIcon,
} from '@/components/Icons';

export default function Dashboard() {
  const router = useRouter();
  const [ultimosResultados, setUltimosResultados] = useState<{ [key: string]: LoteriaResult }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResultados();
  }, []);

  const carregarResultados = async () => {
    setLoading(true);
    try {
      // Carregar apenas as 3 principais loterias
      const principais = ['megasena', 'lotofacil', 'quina'];
      const resultados: { [key: string]: LoteriaResult } = {};

      await Promise.all(
        principais.map(async (loteria) => {
          try {
            const resultado = await getLatestResult(loteria);
            resultados[loteria] = resultado;
          } catch (error) {
            console.error(`Erro ao carregar ${loteria}:`, error);
          }
        })
      );

      setUltimosResultados(resultados);
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        {/* Hero Section */}
        <div className="glass-card p-8 mb-6 text-center">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            Bem-vindo ao Loto Bum! <CloverIcon className="text-luck-green" size={48} />
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Seu portal completo de loterias com resultados, estatísticas e gerador de jogos
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push('/resultados')}
              className="btn-primary flex items-center gap-2"
            >
              <TargetIcon size={20} /> Ver Resultados
            </button>
            <button
              onClick={() => router.push('/gerador')}
              className="btn-secondary flex items-center gap-2"
            >
              <DiceIcon size={20} /> Gerar Jogos
            </button>
            <button
              onClick={() => router.push('/estatisticas')}
              className="btn-secondary flex items-center gap-2"
            >
              <ChartLineIcon size={20} /> Estatísticas
            </button>
          </div>
        </div>

        {/* Últimos Resultados Destaque */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrophyIcon size={28} /> Últimos Resultados
          </h2>

          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="animate-pulse">Carregando resultados...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(ultimosResultados).map(([tipo, resultado]) => {
                const loteriaInfo = loterias.find(l => l.id === tipo);
                return (
                  <div key={tipo} className="glass-card p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-luck-green">
                        {loteriaInfo?.nome}
                      </h3>
                      <p className="text-sm text-gray-400">Concurso {resultado.concurso}</p>
                      <p className="text-xs text-gray-500">{resultado.data}</p>
                    </div>

                    {/* Números */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {resultado.dezenas.slice(0, 6).map((num, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 flex items-center justify-center bg-luck-green text-black text-lg font-bold rounded-full"
                        >
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* Acumulou ou Ganhadores */}
                    {resultado.acumulou ? (
                      <div className="bg-yellow-500/20 p-3 rounded-lg text-center">
                        <p className="text-yellow-400 font-bold">ACUMULOU!</p>
                        <p className="text-sm text-gray-300">
                          {formatCurrency(resultado.valorEstimadoProximoConcurso)}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-500/20 p-3 rounded-lg text-center">
                        <p className="text-green-400 font-semibold">
                          {resultado.premiacoes[0]?.ganhadores || 0} ganhador(es)
                        </p>
                        <p className="text-sm text-gray-300">
                          {formatCurrency(resultado.premiacoes[0]?.valorPremio || 0)}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => router.push('/resultados')}
                      className="btn-secondary w-full mt-4"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div
            onClick={() => router.push('/resultados')}
            className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="text-luck-green mb-3">
              <TargetIcon size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Resultados</h3>
            <p className="text-gray-400 text-sm">
              Consulte os resultados de todas as loterias em tempo real
            </p>
          </div>

          <div
            onClick={() => router.push('/gerador')}
            className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="text-luck-green mb-3">
              <DiceIcon size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Gerador</h3>
            <p className="text-gray-400 text-sm">
              Gere jogos aleatórios para suas apostas
            </p>
          </div>

          <div
            onClick={() => router.push('/probabilidades')}
            className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="text-luck-green mb-3">
              <ChartBarIcon size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Probabilidades</h3>
            <p className="text-gray-400 text-sm">
              Entenda suas chances em cada modalidade
            </p>
          </div>

          <div
            onClick={() => router.push('/estatisticas')}
            className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="text-luck-green mb-3">
              <ChartLineIcon size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Estatísticas</h3>
            <p className="text-gray-400 text-sm">
              Análise completa dos sorteios
            </p>
          </div>
        </div>

        {/* Informação Importante */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <InfoIcon size={24} /> Sobre o Loto Bum
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="mb-2">
                • <strong>Resultados em Tempo Real:</strong> Acompanhe todos os sorteios das principais loterias
              </p>
              <p className="mb-2">
                • <strong>Gerador Inteligente:</strong> Crie jogos aleatórios com as mesmas chances de qualquer outro
              </p>
            </div>
            <div>
              <p className="mb-2">
                • <strong>Análise Estatística:</strong> Veja padrões e tendências dos sorteios
              </p>
              <p className="mb-2">
                • <strong>100% Gratuito:</strong> Todas as funcionalidades sem custo
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg flex items-start gap-3">
            <WarningIcon className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-yellow-400 text-sm">
              <strong>Jogue com responsabilidade!</strong> As loterias devem ser encaradas como diversão.
              Nunca aposte mais do que pode perder.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
