# CareLevel — Frontend

## Como rodar

### Pré-requisitos
- Node.js 18+
- Backend rodando (pasta `back_end/`)

### Passos

```bash
# 1. Instalar dependências
cd front_end
npm install

# 2. Rodar em desenvolvimento
npm run dev
```

O app abre em **http://localhost:5173**

### Backend (em outro terminal)
```bash
cd back_end
npm install
node server.js
```

O backend roda em **http://localhost:3005**

---

## Variáveis de ambiente

Crie um `.env` na pasta `front_end/` se quiser mudar a URL do backend:

```
VITE_API_URL=http://localhost:3005
```
