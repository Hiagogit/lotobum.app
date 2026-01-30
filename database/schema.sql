-- Loto Bum Database Schema (Sem Autenticacao)
-- Execute este SQL no Supabase SQL Editor

-- Primeiro, remover a tabela antiga se existir (CUIDADO: apaga dados!)
-- DROP TABLE IF EXISTS public.saved_games;

-- Table: saved_games
-- Armazena jogos gerados (sem vinculo com usuario)
CREATE TABLE IF NOT EXISTS public.saved_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL CHECK (game_type IN ('megasena', 'lotofacil', 'quina', 'lotomania', 'duplasena', 'diadesorte')),
  numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes para melhor performance
CREATE INDEX IF NOT EXISTS saved_games_created_at_idx ON public.saved_games(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_games_game_type_idx ON public.saved_games(game_type);

-- Desabilitar RLS para acesso publico
ALTER TABLE public.saved_games DISABLE ROW LEVEL SECURITY;

-- OU se preferir manter RLS habilitado, criar policy publica:
-- ALTER TABLE public.saved_games ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access" ON public.saved_games FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- MIGRACAO: Se ja tem a tabela antiga com user_id
-- Execute isso para remover a coluna user_id:
-- ===========================================
-- ALTER TABLE public.saved_games DROP CONSTRAINT IF EXISTS saved_games_user_id_fkey;
-- ALTER TABLE public.saved_games DROP COLUMN IF EXISTS user_id;
