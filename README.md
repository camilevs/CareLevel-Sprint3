# CareLevel
 
> Plataforma gamificada de bem-estar corporativo para beneficiários e administradores.
 
---
 
## 📋 Índice
 
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Usuários de Teste](#usuários-de-teste)
- [Funcionalidades](#funcionalidades)
- [Equipe](#equipe)
---
 
## Sobre o Projeto
 
O **CareLevel** é uma aplicação web full-stack que incentiva hábitos saudáveis no ambiente corporativo por meio de gamificação. Beneficiários podem acompanhar seu humor diário, completar missões, acumular pontos, ganhar conquistas e resgatar recompensas. Administradores têm acesso a um painel gerencial completo (dashboard, equipes, missões, recompensas e beneficiários).
 
---
 
## Tecnologias
 
**Front-end**
- React 19 + Vite
- React Router DOM
- Tailwind CSS / CSS Modules
- Recharts (gráficos)
 
**Back-end**
- Node.js + Express 5
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas
- Controle de acesso por papéis (RBAC) via middleware
---
 
## Pré-requisitos
 
Antes de começar, certifique-se de ter instalado em sua máquina:
 
- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior
- PostgreSQL (instância local ou remota com um banco criado para o projeto)
---
 
## Instalação e Execução
 
### 1. Clone o repositório
 
```bash
git clone https://github.com/seu-usuario/carelevel.git
cd carelevel
```
 
### 2. Configure as variáveis de ambiente
 
Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
 
```env
PORT=3005
FRONTEND_URL=http://localhost:5173
JWT_SECRET=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=

VITE_API_URL=http://localhost:3005
```
 
> Preencha `JWT_SECRET` e as credenciais `DB_*` de acordo com sua instância PostgreSQL local. As migrations em `back_end/src/migrations/` e o seed em `back_end/src/config/seed.js` populam o banco com os dados iniciais.
 
### 3. Instale as dependências
 
Na raiz do projeto (onde está o `package.json` principal), execute:
 
```bash
npm install
```
 
> Isso instala as dependências tanto do front-end quanto do back-end, graças ao `concurrently` configurado no `package.json` raiz.
 
### 4. Rode a aplicação
 
```bash
npm start
```
 
Esse comando inicia simultaneamente o servidor back-end e o servidor de desenvolvimento do front-end (Vite).
 
| Serviço | URL padrão |
|---------|-----------|
| Front-end | http://localhost:5173 |
| Back-end (API) | http://localhost:3005 |
 
### Rodando separadamente (opcional)
 
Caso prefira iniciar cada parte individualmente:
 
```bash
# Back-end
cd back_end
node server.js
ou
npm run backend
 
# Front-end (em outro terminal)
cd front_end
npm run dev
ou
npm run frontend
```
 
---
 
## Estrutura do Projeto
 
```
carelevel/
├── back_end/
│   ├── server.js
│   └── src/
│       ├── config/          # Conexão com o PostgreSQL (db.js) e seed
│       ├── controllers/     # authController, dataController, adminController
│       ├── middlewares/     # authMiddleware (JWT) e roleMiddleware (RBAC)
│       ├── migrations/      # Scripts SQL de criação/ajuste de tabelas
│       └── routes/          # authRoutes, dataRoutes, adminRoutes
│
└── front_end/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── context/         # AuthContext (estado global de autenticação)
        ├── pages/
        │   ├── Admin/        # Dashboard, missões, recompensas e beneficiários (admin)
        │   ├── CareMood/     # Rastreador de humor
        │   ├── CarePoints/   # Sistema de pontos
        │   ├── Conquistas/   # Badges e conquistas
        │   ├── HomePage/     # Home, Login, Perfil
        │   ├── Jornada/      # Linha do tempo de progresso
        │   ├── Missoes/      # Missões diárias
        │   ├── Ranking/      # Ranking entre usuários
        │   └── Recompensas/  # Catálogo de recompensas
        ├── Components/      # Componentes reutilizáveis (NavBar, Footer, RoleGuard, etc.)
        └── services/        # Camada de comunicação com a API
```
 
---
 
## Rotas da Aplicação
 
| Rota | Componente | Acesso |
|------|-----------|--------|
| `/login` | Login | Público |
| `/unauthorized` | Unauthorized | Público |
| `/home` | HomePage | Beneficiário |
| `/perfil` | PerfilBeneficiario | Beneficiário |
| `/caremood` | CareMoodPage | Beneficiário |
| `/jornada` | JornadaPage | Beneficiário |
| `/missoes` | MissoesPage | Beneficiário |
| `/ranking` | RankingPage | Beneficiário |
| `/conquistas` | Conquistas | Beneficiário |
| `/recompensas` | RecompensasPage | Beneficiário |
| `/carepoints` | CarePoints | Beneficiário |
| `/carepoints/historico` | CarePointsHistorico | Beneficiário |
| `/admin/home` | AdminHome | Admin |
| `/admin/missoes` | MissoesAdmin | Admin |
| `/admin/recompensas` | RecompensasAdmin | Admin |
| `/admin/beneficiarios` | BeneficiariosAdmin | Admin |
 
---
 
## Usuários de Teste
 
Para acessar a aplicação sem precisar criar uma conta, use as credenciais abaixo:
 
**Beneficiário**
```
E-mail: user@carelevel.com.br
Senha:  usuario123@
```
 
**Administrador**
```
E-mail: admin@carelevel.com
Senha:  admin123@
```
 
---
 
## Funcionalidades
 
- **CareMood** — Registro diário de humor com gráficos de histórico e recomendações personalizadas
- **Missões** — Desafios diários e semanais com recompensas em CarePoints
- **CarePoints** — Sistema de pontuação com histórico de transações
- **Conquistas** — Badges desbloqueáveis por metas atingidas, com destaque no perfil
- **Ranking** — Pódio e classificação geral entre os beneficiários
- **Recompensas** — Catálogo de prêmios resgatáveis com os pontos acumulados
- **Perfil** — Resumo do usuário com conquistas em destaque e histórico de atividades
- **Painel Admin** — Dashboard com indicadores das equipes, CRUD de missões e recompensas, e visão detalhada dos beneficiários
 
---
 
## Equipe
 
- Camile Vitoria Silva — RM566649
- Gustavo Almeida Ferreira — RM566980
- Lucas de Oliveira Miranda Caetano — RM568036
- Marco Túlio Longo Conte — RM568373
- Sofia Souza Rodrigues — RM566708
