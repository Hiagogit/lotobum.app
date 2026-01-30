'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { loterias, getLatestResult, LoteriaResult, formatCurrency } from '@/lib/loteriasApi';
import {
  TargetIcon,
  MoneyIcon,
  SoccerIcon,
  CloverIcon,
  DiceIcon,
  LocationIcon,
} from '@/components/Icons';

export default function ResultadosPage() {
  const [selectedLoteria, setSelectedLoteria] = useState('megasena');
  const [resultado, setResultado] = useState<LoteriaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResultado();
  }, [selectedLoteria]);

  const fetchResultado = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLatestResult(selectedLoteria);
      setResultado(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="glass-card p-6 mb-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <TargetIcon size={32} /> Resultados das Loterias
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

        {/* Resultado */}
        {loading && (
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">Carregando resultado...</div>
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center text-red-500">
            {error}
          </div>
        )}

        {resultado && !loading && (
          <div className="space-y-6">
            {/* Cabeçalho do Resultado */}
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-luck-green">
                    {loterias.find(l => l.id === resultado.loteria)?.nome}
                  </h3>
                  <p className="text-gray-400">Concurso {resultado.concurso}</p>
                  <p className="text-sm text-gray-500">{resultado.data}</p>
                </div>
                {resultado.acumulou && (
                  <div className="bg-yellow-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                    <MoneyIcon className="text-yellow-400" size={20} />
                    <span className="text-yellow-400 font-bold">ACUMULOU!</span>
                  </div>
                )}
              </div>

              {/* Números Sorteados */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Números Sorteados:</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {resultado.dezenas.map((num, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 flex items-center justify-center bg-luck-green text-black text-xl font-bold rounded-full"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Time do Coração ou Mês da Sorte */}
              {resultado.timeCoracao && (
                <div className="mb-4 text-center flex items-center justify-center gap-2">
                  <SoccerIcon size={20} />
                  <span className="text-lg">Time do Coração: <strong>{resultado.timeCoracao}</strong></span>
                </div>
              )}
              {resultado.mesSorte && (
                <div className="mb-4 text-center flex items-center justify-center gap-2">
                  <CloverIcon className="text-luck-green" size={20} />
                  <span className="text-lg">Mês da Sorte: <strong>{resultado.mesSorte}</strong></span>
                </div>
              )}
            </div>

            {/* Premiação */}
            <div className="glass-card p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MoneyIcon size={24} /> Premiação
              </h4>
              <div className="space-y-3">
                {resultado.premiacoes.map((premiacao, index) => (
                  <div
                    key={index}
                    className="bg-black/30 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{premiacao.descricao}</p>
                      <p className="text-sm text-gray-400">
                        {premiacao.ganhadores} {premiacao.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-luck-green font-bold">
                        {formatCurrency(premiacao.valorPremio)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximo Concurso */}
            <div className="glass-card p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DiceIcon size={24} /> Próximo Concurso
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Concurso</p>
                  <p className="text-2xl font-bold">{resultado.proximoConcurso}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Data do Sorteio</p>
                  <p className="text-2xl font-bold">{resultado.dataProximoConcurso}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg md:col-span-2">
                  <p className="text-gray-400 text-sm">Prêmio Estimado</p>
                  <p className="text-3xl font-bold text-luck-green">
                    {formatCurrency(resultado.valorEstimadoProximoConcurso)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ganhadores por Localidade */}
            {resultado.localGanhadores && resultado.localGanhadores.length > 0 && (
              <div className="glass-card p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <LocationIcon size={24} /> Ganhadores por Localidade
                </h4>
                <div className="space-y-2">
                  {resultado.localGanhadores.map((local, index) => (
                    <div
                      key={index}
                      className="bg-black/30 p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{local.municipio} - {local.uf}</p>
                        {local.nomeFatansiaUL && (
                          <p className="text-sm text-gray-400">{local.nomeFatansiaUL}</p>
                        )}
                      </div>
                      <div className="text-luck-green font-bold">
                        {local.ganhadores} {local.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
