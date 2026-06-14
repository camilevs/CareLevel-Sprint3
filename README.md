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
- [Usuário de Teste](#usuário-de-teste)
- [Funcionalidades](#funcionalidades)
---
 
## Sobre o Projeto
 
O **CareLevel** é uma aplicação web full-stack que incentiva hábitos saudáveis no ambiente corporativo por meio de gamificação. Beneficiários podem acompanhar seu humor diário, completar missões, acumular pontos, ganhar conquistas e resgatar recompensas. Administradores têm acesso a uma visão gerencial dos dados da plataforma.
 
---
 
## Tecnologias
 
**Front-end**
- React 18 + Vite
- React Router DOM
- CSS Modules
**Back-end**
- Node.js + Express
- JSON como banco de dados (`db.json`)
- JWT para autenticação
- Controle de acesso por papéis (RBAC)
---
 
## Pré-requisitos
 
Antes de começar, certifique-se de ter instalado em sua máquina:
 
- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior
---
 
## Instalação e Execução
 
### 1. Clone o repositório
 
```bash
git clone https://github.com/seu-usuario/carelevel.git
cd carelevel
```
 
### 2. Configure as variáveis de ambiente
 

 
```env

PORT=3005
```
 
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
│       ├── config/          # Configuração do banco e seed
│       ├── controllers/     # Lógica de autenticação e dados
│       ├── data/            # db.json (banco de dados JSON)
│       ├── middlewares/     # Auth e controle de papéis (RBAC)
│       └── routes/          # Rotas da API
│
└── front_end/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── context/         # AuthContext (estado global de autenticação)
        ├── pages/
        │   ├── CareMood/    # Rastreador de humor
        │   ├── CarePoints/  # Sistema de pontos
        │   ├── Conquistas/  # Badges e conquistas
        │   ├── HomePage/    # Home, Login, Perfil
        │   ├── Missoes/     # Missões diárias
        │   ├── Ranking/     # Ranking entre usuários
        │   └── Recompensas/ # Catálogo de recompensas
        ├── Components/      # Componentes reutilizáveis (NavBar, Footer, etc.)
        └── services/        # Camada de comunicação com a API
```
 
---
 
## Rotas da Aplicação
 
| Rota | Componente | Acesso |
|------|-----------|--------|
| `/login` | Login | Público |
| `/home` | HomePage | Autenticado |
| `/perfil` | PerfilBeneficiario | Autenticado |
| `/caremood` | CareMoodPage | Autenticado |
| `/missoes` | MissoesPage | Autenticado |
| `/ranking` | RankingPage | Autenticado |
| `/recompensas` | RecompensasPage | Autenticado |

 
---
 
## Usuário de Teste
 
Para acessar a aplicação sem precisar criar uma conta, use as credenciais abaixo:
 
```
E-mail: user@carelevel.com.br
Senha:  usuario123@
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
