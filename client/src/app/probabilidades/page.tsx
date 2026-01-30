'use client';

import Navbar from '@/components/Navbar';
import {
  ChartBarIcon,
  CalculatorIcon,
  LightbulbIcon,
  TargetIcon,
  MoneyIcon,
  DiceIcon,
  WarningIcon,
} from '@/components/Icons';

const loterias = [
  {
    nome: 'Mega-Sena',
    totalNumeros: 60,
    numerosSorteados: 6,
    probabilidade: '1 em 50.063.860',
    valorAproximado: 'R$ 50 milhões',
  },
  {
    nome: 'Lotofácil',
    totalNumeros: 25,
    numerosSorteados: 15,
    probabilidade: '1 em 3.268.760',
    valorAproximado: 'R$ 1,5 milhão',
  },
  {
    nome: 'Quina',
    totalNumeros: 80,
    numerosSorteados: 5,
    probabilidade: '1 em 24.040.016',
    valorAproximado: 'R$ 5 milhões',
  },
  {
    nome: 'Lotomania',
    totalNumeros: 100,
    numerosSorteados: 50,
    probabilidade: '1 em 11.372.635',
    valorAproximado: 'R$ 2 milhões',
  },
  {
    nome: '+Milionária',
    totalNumeros: 50,
    numerosSorteados: 6,
    probabilidade: '1 em 238.360.500',
    valorAproximado: 'R$ 100 milhões',
  },
  {
    nome: 'Dupla Sena',
    totalNumeros: 50,
    numerosSorteados: 6,
    probabilidade: '1 em 15.890.700',
    valorAproximado: 'R$ 3 milhões',
  },
];

export default function ProbabilidadesPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="glass-card p-6 mb-6">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <ChartBarIcon size={32} /> Probabilidades das Loterias
          </h2>
          <p className="text-gray-400">
            Entenda as chances de ganhar em cada modalidade de loteria
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {loterias.map((loteria, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="text-2xl font-bold text-luck-green mb-4">
                {loteria.nome}
              </h3>

              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total de Números</p>
                  <p className="text-2xl font-bold">{loteria.totalNumeros}</p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Números Sorteados</p>
                  <p className="text-2xl font-bold">{loteria.numerosSorteados}</p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Probabilidade de Acertar</p>
                  <p className="text-xl font-bold text-luck-green">
                    {loteria.probabilidade}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Prêmio Aproximado</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {loteria.valorAproximado}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explicação */}
        <div className="glass-card p-6 mt-6">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalculatorIcon size={24} /> Como são calculadas as probabilidades?
          </h4>
          <div className="space-y-4 text-gray-300">
            <p>
              A probabilidade de acertar todos os números em uma loteria é calculada através de
              combinações matemáticas. Para jogos simples, a fórmula é:
            </p>
            <div className="bg-black/30 p-4 rounded-lg font-mono text-center">
              C(n,k) = n! / (k! × (n-k)!)
            </div>
            <p>Onde:</p>
            <ul className="space-y-2 ml-6">
              <li>• <strong>n</strong> = total de números disponíveis</li>
              <li>• <strong>k</strong> = quantidade de números a serem escolhidos</li>
              <li>• <strong>!</strong> = fatorial (multiplicação de todos os números até ele)</li>
            </ul>
            <div className="bg-yellow-500/20 p-4 rounded-lg mt-4">
              <p className="text-yellow-400 font-semibold flex items-center gap-2">
                <LightbulbIcon size={20} /> Exemplo: Mega-Sena
              </p>
              <p className="mt-2">
                Para acertar 6 números entre 60: C(60,6) = 50.063.860 combinações possíveis.
                Isso significa que com um jogo simples, você tem 1 chance em 50 milhões de ganhar!
              </p>
            </div>
          </div>
        </div>

        {/* Dicas */}
        <div className="glass-card p-6 mt-6">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LightbulbIcon size={24} /> Dicas para Aumentar suas Chances
          </h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <TargetIcon className="flex-shrink-0 mt-1" size={24} />
              <div>
                <strong>Bolões:</strong> Participe de bolões para aumentar o número de apostas
                sem gastar muito
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MoneyIcon className="flex-shrink-0 mt-1" size={24} />
              <div>
                <strong>Loterias com melhores odds:</strong> Lotofácil tem as melhores probabilidades
                entre as principais loterias
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ChartBarIcon className="flex-shrink-0 mt-1" size={24} />
              <div>
                <strong>Consistência:</strong> Jogar regularmente aumenta suas chances ao longo do tempo
              </div>
            </li>
            <li className="flex items-start gap-3">
              <DiceIcon className="flex-shrink-0 mt-1" size={24} />
              <div>
                <strong>Variação:</strong> Não se prenda a números fixos, varie suas apostas
              </div>
            </li>
            <li className="flex items-start gap-3">
              <WarningIcon className="flex-shrink-0 mt-1 text-yellow-400" size={24} />
              <div>
                <strong>Jogue com responsabilidade:</strong> Nunca aposte mais do que pode perder
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
