import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  const token = data.token
  const decoded = token ? jwtDecode(token) : null
  const user = data.user ?? (decoded ? { id: decoded.id, role: decoded.role } : null)

  if (!user?.role) {
    throw new Error('Usuário sem role definida')
  }

  return { token, user }
}

export async function getProfile() {
  const { data } = await api.get('/auth/me')
  return data?.user
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/auth/me', payload)
  return data
}

// ── Dados do app ────────────────────────────────────────────────

const MOCK_MISSOES = {
  equipe: {
    tempo: '2d 14h',
    itens: [
      { id: 1, titulo: 'Completar 3 check-ins de bem-estar', pontos: '+50' },
      { id: 2, titulo: 'Participar de uma atividade em grupo', pontos: '+80' },
      { id: 3, titulo: 'Compartilhar uma dica de saúde', pontos: '+30' },
    ],
  },
  individual: {
    tempo: '18h 32m',
    itens: [
      { id: 1, titulo: 'Registrar seu humor hoje', pontos: '+20' },
      { id: 2, titulo: 'Fazer 15 minutos de exercício', pontos: '+40' },
      { id: 3, titulo: 'Beber 2 litros de água', pontos: '+15' },
      { id: 4, titulo: 'Meditar por 5 minutos', pontos: '+25' },
    ],
  },
}

const MOCK_CONQUISTAS = {
  destaqueAtual: 'GUARDIÃO DO BEM-ESTAR',
  emblemas: ['Primeiro Login', 'Streak de 7 dias', 'Mestre das Missões', 'Top 10 Ranking'],
  opcoesDestaque: [
    { grupo: 'Bem-estar', itens: ['GUARDIÃO DO BEM-ESTAR', 'MENTE ZEN', 'EQUILÍBRIO TOTAL'] },
    { grupo: 'Equipe', itens: ['LÍDER DE EQUIPE', 'COLABORADOR DO MÊS'] },
  ],
  detalhes: [
    { titulo: 'Primeiro Login', descricao: 'Você acessou a plataforma pela primeira vez.', rodape: '+10 CarePoints' },
    { titulo: 'Streak de 7 dias', descricao: 'Você fez check-in por 7 dias consecutivos.', rodape: '+50 CarePoints' },
    { titulo: 'Mestre das Missões', descricao: 'Concluiu 10 missões individuais.', rodape: '+100 CarePoints' },
    { titulo: 'Top 10 Ranking', descricao: 'Ficou entre os 10 primeiros do ranking geral.', rodape: '+150 CarePoints' },
  ],
  medalhas: [
    { nome: 'Bem-Estar', sub: 'Nível 3', pct: 75 },
    { nome: 'Equipe', sub: 'Nível 2', pct: 50 },
    { nome: 'Constância', sub: 'Nível 4', pct: 90 },
    { nome: 'Saúde', sub: 'Nível 1', pct: 30 },
  ],
}

const MOCK_RECOMPENSAS = [
  { id: 1, nome: 'Ingressos para cinema', custo: 500, imagem: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=400&fit=crop' },
  { id: 2, nome: 'Snacks saudáveis', custo: 300, imagem: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop' },
  { id: 3, nome: 'Cesta de frutas frescas', custo: 800, imagem: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop' },
  { id: 4, nome: 'Vale-refeição', custo: 400, imagem: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop' },
  { id: 5, nome: 'Day off adicional', custo: 1000, imagem: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop' },
  { id: 6, nome: 'Sessão de massagem', custo: 700, imagem: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop' },
]

export async function fetchUsuario() {
  try {
    const { data } = await api.get('/api/usuario')
    return data
  } catch {
    return { streak: 5, carepoints: 2175, nivel: 12, nome: 'Visitante', avatar: null }
  }
}

export async function fetchRanking() {
  const { data } = await api.get('/api/ranking')
  return data
}

export async function fetchMissoes() {
  try {
    const { data } = await api.get('/api/missoes')
    return data
  } catch {
    return MOCK_MISSOES
  }
}

export async function fetchRecompensas() {
  try {
    const { data } = await api.get('/api/recompensas')
    return data
  } catch {
    return MOCK_RECOMPENSAS
  }
}

export async function resgatarRecompensa(id) {
  try {
    const { data } = await api.post(`/api/recompensas/resgatar/${id}`)
    return data
  } catch {
    const recompensa = MOCK_RECOMPENSAS.find((r) => r.id === id)
    return { saldo: 2175 - (recompensa?.custo ?? 0) }
  }
}

export async function fetchCarepoints() {
  const { data } = await api.get('/api/carepoints')
  return data
}

export async function fetchConquistas() {
  try {
    const { data } = await api.get('/api/conquistas')
    return data
  } catch {
    return MOCK_CONQUISTAS
  }
}

export async function salvarDestaque(destaque) {
  try {
    const { data } = await api.patch('/api/conquistas/destaque', { destaque })
    return data
  } catch {
    return { destaque }
  }
}

export async function fetchCaremoodPerguntas() {
  const { data } = await api.get('/api/caremood/perguntas')
  return data
}

export async function fetchAdmin() {
  const { data } = await api.get('/api/admin')
  return data
}

export default api
