const BASE_URL = 'https://loteriascaixa-api.herokuapp.com/api';

export const loterias = [
  { id: 'maismilionaria', nome: '+Milionária' },
  { id: 'megasena', nome: 'Mega-Sena' },
  { id: 'lotofacil', nome: 'Lotofácil' },
  { id: 'quina', nome: 'Quina' },
  { id: 'lotomania', nome: 'Lotomania' },
  { id: 'timemania', nome: 'Timemania' },
  { id: 'duplasena', nome: 'Dupla Sena' },
  { id: 'federal', nome: 'Federal' },
  { id: 'diadesorte', nome: 'Dia de Sorte' },
  { id: 'supersete', nome: 'Super Sete' },
];

export interface LoteriaResult {
  loteria: string;
  concurso: number;
  data: string;
  local: string;
  dezenasOrdemSorteio: string[];
  dezenas: string[];
  trevos?: string[];
  timeCoracao?: string | null;
  mesSorte?: string | null;
  premiacoes: {
    descricao: string;
    faixa: number;
    ganhadores: number;
    valorPremio: number;
  }[];
  estadosPremiados: any[];
  observacao: string;
  acumulou: boolean;
  proximoConcurso: number;
  dataProximoConcurso: string;
  localGanhadores: {
    ganhadores: number;
    municipio: string;
    nomeFatansiaUL: string;
    serie: string;
    posicao: number;
    uf: string;
  }[];
  valorArrecadado: number;
  valorAcumuladoConcurso_0_5: number;
  valorAcumuladoConcursoEspecial: number;
  valorAcumuladoProximoConcurso: number;
  valorEstimadoProximoConcurso: number;
}

export async function getLatestResult(loteria: string): Promise<LoteriaResult> {
  const response = await fetch(`${BASE_URL}/${loteria}/latest`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar resultado de ${loteria}`);
  }
  return response.json();
}

export async function getConcursoResult(
  loteria: string,
  concurso: number
): Promise<LoteriaResult> {
  const response = await fetch(`${BASE_URL}/${loteria}/${concurso}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar concurso ${concurso} de ${loteria}`);
  }
  return response.json();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  return `${day}/${month}/${year}`;
}
