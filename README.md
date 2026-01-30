# 🍀 Loto Bum V1

Sistema fullstack profissional para geração, salvamento e consulta de jogos de loteria, com estética minimalista Dark inspirada na Apple.

## 📋 Tecnologias

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Supabase** (PostgreSQL + Auth)
- API versionada (`/v1/api/`)
- Cache em memória para resultados de loteria

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (tema Dark Apple)
- **Supabase Auth** (Email/Senha)

### Funcionalidades
✅ Geração aleatória de jogos (Mega-Sena, Lotofácil, Quina)  
✅ Consulta de resultados oficiais em tempo real  
✅ Salvamento de jogos no banco de dados  
✅ Histórico de jogos salvos  
✅ Compartilhamento via WhatsApp  
✅ Autenticação segura com JWT  
✅ Row Level Security (RLS) no Supabase  

---

## 🚀 Setup Inicial

### 1. Clonar e Instalar Dependências

```bash
cd loto-bum

# Instalar todas as dependências (raiz + server + client)
npm run install:all

# OU manualmente:
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configurar Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o arquivo `database/schema.sql`
4. Copie as credenciais:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (Settings → API)
   - **JWT Secret** → `JWT_SECRET` (Settings → API → JWT Settings)

### 3. Configurar Variáveis de Ambiente

#### Backend (`/server/.env`)
```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
JWT_SECRET=seu_jwt_secret

API_VERSION=v1
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (`/client/.env.local`)
```bash
cd client
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

---

## 🎮 Executar o Projeto

### Modo Desenvolvimento (Recomendado)

Na raiz do projeto:
```bash
npm run dev
```

Este comando inicia:
- ✅ Backend em `http://localhost:3001`
- ✅ Frontend em `http://localhost:3000`

### Executar Separadamente

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

---

## 📁 Estrutura do Projeto

```
loto-bum/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts       # Servidor principal
│   │   ├── middleware/
│   │   │   └── auth.ts    # Middleware de autenticação JWT
│   │   └── routes/
│   │       ├── lottery.ts # Rotas de resultados da loteria
│   │       └── games.ts   # Rotas de geração/salvamento
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                 # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Login/Signup
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Dashboard principal
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── lib/
│   │       ├── supabase.ts        # Cliente Supabase
│   │       └── api.ts             # API calls
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local.example
│
├── database/
│   └── schema.sql         # Schema do banco de dados
│
├── package.json           # Scripts do monorepo
└── README.md
```

---

## 🌐 Endpoints da API

Base URL: `http://localhost:3001/v1/api`

### Públicos
- **GET** `/lottery/latest` - Últimos resultados (Mega-Sena, Lotofácil, Quina)
- **POST** `/games/generate` - Gerar números aleatórios
  ```json
  { "gameType": "megasena" | "lotofacil" | "quina" }
  ```

### Protegidos (Requer Token JWT)
- **POST** `/games/save` - Salvar jogo
  ```json
  { "gameType": "megasena", "numbers": [1, 5, 12, 23, 45, 56] }
  ```
- **GET** `/games/history` - Histórico de jogos salvos (últimos 10)

**Headers para rotas protegidas:**
```
Authorization: Bearer {jwt_token}
```

---

## 🎨 Design System

### Cores (Apple Dark Theme)
- **Background**: `#000000`
- **Cards**: `#1C1C1E`
- **Verde Sorte**: `#30D158`
- **Texto**: `#FFFFFF`

### Componentes Principais
- **Glass Cards**: Cards com `backdrop-filter: blur(20px)`
- **Number Balls**: Bolinhas com gradiente verde
- **Segmented Control**: Seletor de jogo estilo iOS
- **Botões**: Primários (verde) e secundários (outline)

---

## 🗄️ Banco de Dados

### Tabelas

#### `profiles`
- `id` (UUID, FK auth.users)
- `email` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `saved_games`
- `id` (UUID)
- `user_id` (UUID, FK profiles.id)
- `game_type` (TEXT: megasena | lotofacil | quina)
- `numbers` (INTEGER[])
- `created_at` (TIMESTAMP)

### Segurança (RLS)
- ✅ Usuários só acessam seus próprios jogos
- ✅ Policies aplicadas em todas as operações
- ✅ Trigger automático para criar perfil no signup

---

## 📱 Funcionalidades

### 1. Autenticação
- Login com email/senha
- Registro de novos usuários
- Verificação de email (Supabase)
- Logout seguro

### 2. Geração de Jogos
- **Mega-Sena**: 6 números de 1 a 60
- **Lotofácil**: 15 números de 1 a 25
- **Quina**: 5 números de 1 a 80

### 3. Consulta de Resultados
- Cache de 1 hora para performance
- Dados da API pública da Caixa
- Exibição dos últimos concursos

### 4. WhatsApp
- Compartilhamento direto dos números gerados
- Mensagem formatada com emoji e nome do jogo

---

## 🔧 Scripts Disponíveis

```bash
# Raiz
npm run dev              # Executa server + client
npm run dev:server       # Apenas backend
npm run dev:client       # Apenas frontend
npm run install:all      # Instala todas as dependências

# Server
cd server
npm run dev              # Modo desenvolvimento
npm run build            # Compilar TypeScript
npm start                # Executar versão compilada

# Client
cd client
npm run dev              # Modo desenvolvimento
npm run build            # Build de produção
npm start                # Servidor de produção
npm run lint             # Linter
```

---

## 🚀 Deploy

### Backend (Render, Railway, Fly.io)
1. Configure as variáveis de ambiente
2. Build: `npm run build`
3. Start: `npm start`
4. Porta: `process.env.PORT || 3001`

### Frontend (Vercel)
1. Conecte o repositório
2. Configure variáveis de ambiente
3. Build Command: `npm run build`
4. Output Directory: `.next`

---

## 📝 Próximas Funcionalidades (V2)

- [ ] Página de histórico completo
- [ ] Estatísticas de números mais sorteados
- [ ] Análise de padrões
- [ ] Geração de múltiplos jogos
- [ ] Exportação em PDF
- [ ] Notificações de resultados
- [ ] Modo escuro/claro
- [ ] PWA (Progressive Web App)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

---

## 🙏 Créditos

- API de Loteria: [loteriascaixa-api](https://github.com/guto-alves/loteriascaixa-api)
- Design inspirado em Apple UI/UX
- Ícone: 🍀 (Trevo da Sorte)

---

**Desenvolvido com ❤️ e muita sorte! 🍀**
