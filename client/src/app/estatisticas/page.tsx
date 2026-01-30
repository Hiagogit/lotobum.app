'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { loterias, getLatestResult, LoteriaResult } from '@/lib/loteriasApi';
import {
  ChartLineIcon,
  SearchIcon,
  ChartBarIcon,
  LightbulbIcon,
  WarningIcon,
} from '@/components/Icons';

export default function EstatisticasPage() {
  const [selectedLoteria, setSelectedLoteria] = useState('megasena');
  const [resultado, setResultado] = useState<LoteriaResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResultado();
  }, [selectedLoteria]);

  const fetchResultado = async () => {
    setLoading(true);
    try {
      const data = await getLatestResult(selectedLoteria);
      setResultado(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getNumerosPares = (dezenas: string[]) => {
    return dezenas.filter(num => parseInt(num) % 2 === 0).length;
  };

  const getNumerosImpares = (dezenas: string[]) => {
    return dezenas.filter(num => parseInt(num) % 2 !== 0).length;
  };

  const getSomaNumeros = (dezenas: string[]) => {
    return dezenas.reduce((acc, num) => acc + parseInt(num), 0);
  };

  const getMediaNumeros = (dezenas: string[]) => {
    const soma = getSomaNumeros(dezenas);
    return (soma / dezenas.length).toFixed(2);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="glass-card p-6 mb-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <ChartLineIcon size={32} /> Estatísticas das Loterias
          </h2>

          {/* Filtro de Loterias */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Selecione a Loteria:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {loterias.map((loteria) => (
                <button
                  key={loteria.id}
                  onClick={() => setSelectedLoteria(loteria.id)}
                  className={`p-3 rounded-lg transition-all text-sm font-medium ${
                    selectedLoteria === loteria.id
                      ? 'bg-luck-green text-black'
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                >
                  {loteria.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">Carregando estatísticas...</div>
          </div>
        )}

        {resultado && !loading && (
          <div className="space-y-6">
            {/* Info do Concurso */}
            <div className="glass-card p-6">
              <h3 className="text-2xl font-bold text-luck-green mb-4">
                {loterias.find(l => l.id === resultado.loteria)?.nome} - Concurso {resultado.concurso}
              </h3>
              <p className="text-gray-400">Análise do último sorteio realizado em {resultado.data}</p>
            </div>

            {/* Estatísticas Básicas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Números Sorteados</p>
                  <p className="text-4xl font-bold text-luck-green">{resultado.dezenas.length}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Números Pares</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {getNumerosPares(resultado.dezenas)}
                  </p>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Números Ímpares</p>
                  <p className="text-4xl font-bold text-purple-400">
                    {getNumerosImpares(resultado.dezenas)}
                  </p>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Média dos Números</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {getMediaNumeros(resultado.dezenas)}
                  </p>
                </div>
              </div>
            </div>

            {/* Análise Detalhada */}
            <div className="glass-card p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <SearchIcon size={24} /> Análise Detalhada
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Distribuição Par/Ímpar</h5>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Pares</span>
                          <span className="text-sm font-bold">{getNumerosPares(resultado.dezenas)}</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-blue-400 h-3 rounded-full"
                            style={{
                              width: `${(getNumerosPares(resultado.dezenas) / resultado.dezenas.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center mt-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Ímpares</span>
                          <span className="text-sm font-bold">{getNumerosImpares(resultado.dezenas)}</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-purple-400 h-3 rounded-full"
                            style={{
                              width: `${(getNumerosImpares(resultado.dezenas) / resultado.dezenas.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Soma Total</h5>
                    <p className="text-3xl font-bold text-luck-green">
                      {getSomaNumeros(resultado.dezenas)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Soma de todos os números sorteados
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h5 className="font-semibold mb-3">Números Sorteados</h5>
                  <div className="grid grid-cols-5 gap-2">
                    {resultado.dezenas.map((num, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center font-bold ${
                          parseInt(num) % 2 === 0
                            ? 'bg-blue-500/30 text-blue-300'
                            : 'bg-purple-500/30 text-purple-300'
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500/30 rounded"></div>
                      <span>Pares</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500/30 rounded"></div>
                      <span>Ímpares</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Estatísticas */}
            <div className="glass-card p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ChartBarIcon size={24} /> Informações Estatísticas
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Menor Número</p>
                  <p className="text-3xl font-bold text-luck-green">
                    {Math.min(...resultado.dezenas.map(n => parseInt(n)))}
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Maior Número</p>
                  <p className="text-3xl font-bold text-luck-green">
                    {Math.max(...resultado.dezenas.map(n => parseInt(n)))}
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Amplitude</p>
                  <p className="text-3xl font-bold text-luck-green">
                    {Math.max(...resultado.dezenas.map(n => parseInt(n))) -
                     Math.min(...resultado.dezenas.map(n => parseInt(n)))}
                  </p>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="glass-card p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LightbulbIcon size={24} /> Sobre as Estatísticas
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Distribuição Par/Ímpar:</strong> Mostra o equilíbrio entre números pares e ímpares</li>
                <li>• <strong>Média:</strong> Indica se os números sorteados tendem para valores baixos ou altos</li>
                <li>• <strong>Amplitude:</strong> Diferença entre o maior e menor número sorteado</li>
                <li>• <strong>Soma Total:</strong> Ajuda a identificar padrões de somas nos sorteios</li>
                <li className="flex items-center gap-2">
                  <WarningIcon className="text-yellow-400 flex-shrink-0" size={18} />
                  Lembre-se: cada sorteio é independente, estatísticas passadas não garantem resultados futuros
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
