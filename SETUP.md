# 🚀 Guia Rápido de Setup - Loto Bum

Este guia vai te ajudar a configurar e rodar o projeto em menos de 10 minutos.

## ⚡ Passo a Passo Rápido

### 1️⃣ Instalar Dependências (2 min)

```bash
cd loto-bum
npm run install:all
```

Isso instala todas as dependências do monorepo (raiz, server e client).

---

### 2️⃣ Configurar Supabase (3 min)

1. **Criar conta e projeto:**
   - Acesse [supabase.com](https://supabase.com)
   - Clique em "New Project"
   - Escolha um nome e senha para o banco

2. **Executar o schema:**
   - No Supabase Dashboard, vá em **SQL Editor**
   - Copie todo o conteúdo de `database/schema.sql`
   - Cole no editor e clique em **RUN**
   - ✅ Você deve ver as tabelas `profiles` e `saved_games` criadas

3. **Copiar credenciais:**
   - Vá em **Settings** → **API**
   - Anote os seguintes valores:
     - `Project URL`
     - `anon public key`
     - `service_role key` (clique em "Reveal")
   - Vá em **Settings** → **API** → **JWT Settings**
   - Anote o `JWT Secret`

---

### 3️⃣ Configurar Variáveis de Ambiente (2 min)

#### Backend:
```bash
cd server
cp .env.example .env
nano .env  # ou use seu editor preferido
```

Preencha com suas credenciais do Supabase:
```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
JWT_SECRET=seu_jwt_secret_do_supabase

API_VERSION=v1
CORS_ORIGIN=http://localhost:3000
```

#### Frontend:
```bash
cd ../client
cp .env.local.example .env.local
nano .env.local  # ou use seu editor preferido
```

Preencha:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

### 4️⃣ Rodar o Projeto (1 min)

Volte para a raiz do projeto:
```bash
cd ..
npm run dev
```

**Pronto! 🎉**
- Backend rodando em: `http://localhost:3001`
- Frontend rodando em: `http://localhost:3000`

---

## 🧪 Testar o Sistema

### 1. Criar uma conta
1. Acesse `http://localhost:3000`
2. Preencha email e senha
3. Clique em **"Criar Conta"**
4. ⚠️ **IMPORTANTE**: Vá no Supabase Dashboard → **Authentication** → **Users** e confirme o email manualmente (clique nos 3 pontinhos → Confirm Email)

### 2. Fazer login
1. Use o email e senha que criou
2. Clique em **"Entrar"**
3. Você será redirecionado para o Dashboard

### 3. Gerar um jogo
1. Escolha o tipo de jogo (Mega-Sena, Lotofácil ou Quina)
2. Clique em **"🎲 Gerar Números"**
3. Os números aparecem nas bolinhas verdes
4. Clique em **"💾 Salvar"** para guardar no banco
5. Clique em **"📱 WhatsApp"** para compartilhar

### 4. Ver resultados oficiais
- Role a página para baixo
- Veja os últimos resultados das 3 loterias
- Os dados são atualizados a cada hora (cache)

---

## 🔧 Solução de Problemas

### ❌ Erro: "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

### ❌ Erro: "JWT Secret not configured"
- Verifique se você copiou o JWT Secret corretamente no `server/.env`
- O JWT Secret deve ser o mesmo do Supabase (Settings → API → JWT Settings)

### ❌ Erro: "Failed to fetch lottery data"
- Verifique sua conexão com a internet
- A API pública pode estar fora do ar temporariamente
- Tente novamente em alguns minutos

### ❌ Erro: "Token inválido ou expirado"
- Faça logout e login novamente
- Verifique se o JWT_SECRET no backend é igual ao do Supabase

### ❌ Frontend não conecta no Backend
- Verifique se o backend está rodando em `http://localhost:3001`
- Verifique o `NEXT_PUBLIC_API_URL` no `client/.env.local`
- Reinicie o servidor frontend

---

## 📊 Verificar se está tudo funcionando

### Testar Backend (Terminal):
```bash
# Health check
curl http://localhost:3001/health

# Gerar jogo (sem auth)
curl -X POST http://localhost:3001/v1/api/games/generate \
  -H "Content-Type: application/json" \
  -d '{"gameType":"megasena"}'

# Últimos resultados
curl http://localhost:3001/v1/api/lottery/latest
```

### Testar Database:
1. Vá no Supabase Dashboard → **Table Editor**
2. Clique em `profiles` → deve mostrar seu usuário
3. Clique em `saved_games` → deve mostrar os jogos salvos

---

## 🎨 Customização Rápida

### Mudar as cores:
Edite `client/tailwind.config.ts`:
```typescript
colors: {
  background: '#000000',  // Fundo
  card: '#1C1C1E',        // Cards
  'luck-green': '#30D158', // Verde (mude aqui!)
}
```

### Mudar porta do backend:
Edite `server/.env`:
```env
PORT=5000  # Nova porta
```

E atualize `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📚 Próximos Passos

1. ✅ Projeto rodando local
2. 🔜 Personalize o design
3. 🔜 Adicione novas features
4. 🔜 Faça deploy (veja README.md)

---

## 💡 Dicas

- Use **Ctrl+C** para parar os servidores
- Use `npm run dev:server` e `npm run dev:client` em terminais separados se preferir
- Confira o `README.md` para documentação completa
- Os logs do backend aparecem no terminal onde você rodou `npm run dev`

---

## 🆘 Precisa de Ajuda?

1. Revise este guia do início
2. Consulte o `README.md` para detalhes técnicos
3. Verifique os logs do terminal para mensagens de erro
4. Verifique o console do navegador (F12) para erros frontend

---

**Boa sorte com o Loto Bum! 🍀**
