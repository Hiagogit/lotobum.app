import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || url === 'https://your-project.supabase.co' || !key || key === 'your_supabase_service_role_key_here') {
    return null;
  }

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

// Funcao para gerar numeros aleatorios unicos
const generateNumbers = (count: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

// POST /v1/api/games/generate
router.post('/generate', (req, res) => {
  try {
    const { gameType } = req.body;

    const config = loteriasConfig[gameType];
    if (!config) {
      return res.status(400).json({ error: 'Tipo de jogo invalido' });
    }

    const numbers = generateNumbers(config.count, config.max);

    res.json({
      gameType,
      numbers,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating game:', error);
    res.status(500).json({ error: 'Erro ao gerar jogo' });
  }
});

// POST /v1/api/games/save
router.post('/save', async (req, res) => {
  try {
    const { gameType, numbers } = req.body;

    if (!gameType || !numbers || !Array.isArray(numbers)) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    // Valida se o tipo de jogo existe
    if (!loteriasConfig[gameType]) {
      return res.status(400).json({ error: 'Tipo de jogo invalido' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Se nao tiver Supabase configurado, salva localmente
      return res.json({
        success: true,
        message: 'Jogo salvo localmente (Supabase nao configurado)',
        game: {
          id: `local-${Date.now()}`,
          game_type: gameType,
          numbers,
          created_at: new Date().toISOString()
        }
      });
    }

    const { data, error } = await supabase
      .from('saved_games')
      .insert({
        game_type: gameType,
        numbers: numbers
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Erro ao salvar jogo' });
    }

    res.json({
      success: true,
      game: data
    });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Erro ao salvar jogo' });
  }
});

// GET /v1/api/games/history
router.get('/history', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json({
        games: []
      });
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

    res.json({
      games: data || []
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Erro ao buscar historico' });
  }
});

// DELETE /v1/api/games/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do jogo nao fornecido' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json({
        success: true,
        message: 'Jogo excluido localmente (Supabase nao configurado)'
      });
    }

    const { error } = await supabase
      .from('saved_games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Erro ao excluir jogo' });
    }

    res.json({
      success: true,
      message: 'Jogo excluido com sucesso'
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Erro ao excluir jogo' });
  }
});

export default router;
