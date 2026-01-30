import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Cache para armazenar resultados por 1 hora
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em ms

const LOTTERY_API = 'https://loteriascaixa-api.herokuapp.com/api';

// GET /v1/api/lottery/latest
router.get('/latest', async (req, res) => {
  try {
    const now = Date.now();
    const cachedData = cache.get('latest');

    // Retornar cache se ainda válido
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return res.json(cachedData.data);
    }

    // Buscar resultados das 3 loterias
    const [megasena, lotofacil, quina] = await Promise.all([
      axios.get(`${LOTTERY_API}/megasena/latest`),
      axios.get(`${LOTTERY_API}/lotofacil/latest`),
      axios.get(`${LOTTERY_API}/quina/latest`)
    ]);

    const result = {
      megasena: megasena.data,
      lotofacil: lotofacil.data,
      quina: quina.data,
      cachedAt: new Date().toISOString()
    };

    // Armazenar no cache
    cache.set('latest', { data: result, timestamp: now });

    res.json(result);
  } catch (error) {
    console.error('Error fetching lottery data:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados da loteria' });
  }
});

export default router;
