import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Supabase client
const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
};

// Configuracao das loterias
const loteriasConfig: { [key: string]: { count: number; max: number } } = {
  megasena: { count: 6, max: 60 },
  lotofacil: { count: 15, max: 25 },
  quina: { count: 5, max: 80 },
  lotomania: { count: 50, max: 100 },
  duplasena: { count: 6, max: 50 },
  diadesorte: { count: 7, max: 31 },
};

const generateNumbers = (count: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Loto Bum API' });
});

// POST /api/games/generate
app.post('/api/games/generate', (req, res) => {
  const { gameType } = req.body;
  const config = loteriasConfig[gameType];
  if (!config) {
    return res.status(400).json({ error: 'Tipo de jogo invalido' });
  }
  const numbers = generateNumbers(config.count, config.max);
  res.json({ gameType, numbers, generatedAt: new Date().toISOString() });
});

// POST /api/games/save
app.post('/api/games/save', async (req, res) => {
  const { gameType, numbers } = req.body;

  if (!gameType || !numbers || !Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Dados invalidos' });
  }

  if (!loteriasConfig[gameType]) {
    return res.status(400).json({ error: 'Tipo de jogo invalido' });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({
      success: true,
      message: 'Supabase nao configurado',
      game: { id: `local-${Date.now()}`, game_type: gameType, numbers, created_at: new Date().toISOString() }
    });
  }

  const { data, error } = await supabase
    .from('saved_games')
    .insert({ game_type: gameType, numbers })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Erro ao salvar jogo' });
  }

  res.json({ success: true, game: data });
});

// GET /api/games/history
app.get('/api/games/history', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({ games: [] });
  }

  const { data, error } = await supabase
    .from('saved_games')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Erro ao buscar historico' });
  }

  res.json({ games: data || [] });
});

// DELETE /api/games/:id
app.delete('/api/games/:id', async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({ success: true, message: 'Supabase nao configurado' });
  }

  const { error } = await supabase.from('saved_games').delete().eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Erro ao excluir jogo' });
  }

  res.json({ success: true, message: 'Jogo excluido' });
});

export default app;
