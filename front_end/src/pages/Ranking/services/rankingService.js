import { fetchRanking } from '../../../services/api'

const formatadores = {
  pontos: v => v.toLocaleString('pt-BR'),
  nivel:  v => `Nível ${v}`,
  streak: v => `${v} ${v === 1 ? 'dia' : 'dias'}`,
  equipe: v => v.toLocaleString('pt-BR'),
}

const MEDALHAS = ['🥇', '🥈', '🥉']

const CHAVE_MAP = {
  pontos: 'pontosVitalicio',
  nivel:  'nivel',
  streak: 'streak',
}

export async function getRanking(aba = 'nivel', usuarioId = null) {
  const { usuarios, equipes } = await fetchRanking()
  const fmt = formatadores[aba] ?? formatadores.pontos

  if (aba === 'equipe') {
    const ordenadas = [...equipes].sort((a, b) => b.carepoints - a.carepoints)

    const top3 = ordenadas.slice(0, 3).map((eq, i) => ({
      equipeId: eq.equipeId,
      nome:     eq.nome,
      valor:    fmt(eq.carepoints),
      medalha:  MEDALHAS[i],
      posicao:  i + 1,
      avatar:   'emoji',
      emoji:    eq.emoji,
    }))

    const usuario    = usuarios.find(u => u.userId === usuarioId)
    const posEquipe  = usuario ? ordenadas.findIndex(eq => eq.equipeId === usuario.equipeId) + 1 : null
    const equipeInfo = equipes.find(eq => eq.equipeId === usuario?.equipeId)

    const lista = ordenadas.slice(3, 10).map((eq, i) => ({
      pos:      i + 4,
      equipeId: eq.equipeId,
      nome:     eq.nome,
      valor:    fmt(eq.carepoints),
      isVoce:   eq.equipeId === usuario?.equipeId,
    }))

    const minhaEquipeNaTop10 = posEquipe != null && posEquipe <= 10
    const minhaEquipe = ordenadas.find(eq => eq.equipeId === usuario?.equipeId)

    const voce = minhaEquipe && !minhaEquipeNaTop10 ? {
      pos:   posEquipe,
      nome:  `Sua Equipe (${equipeInfo?.nome ?? '—'})`,
      valor: fmt(minhaEquipe.carepoints),
    } : null

    return { podio: top3, lista, voce }
  }

  const chave = CHAVE_MAP[aba] ?? 'carepoints'

  const todosOrdenados = [...usuarios].sort((a, b) => b[chave] - a[chave])
  const euIndex        = todosOrdenados.findIndex(u => u.userId === usuarioId)
  const euPosicao      = euIndex + 1
  const eu             = euIndex >= 0 ? todosOrdenados[euIndex] : null

  const top3 = todosOrdenados.slice(0, 3).map((u, i) => ({
    userId:  u.userId,
    nome:    u.userId === usuarioId ? 'Você' : u.nome,
    valor:   fmt(u[chave]),
    medalha: MEDALHAS[i],
    posicao: i + 1,
    avatar:  'letra',
    letra:   u.nome.charAt(0),
  }))

  const lista = todosOrdenados.slice(3, 10).map((u, i) => ({
    pos:    i + 4,
    userId: u.userId,
    nome:   u.userId === usuarioId ? 'Você' : u.nome,
    valor:  fmt(u[chave]),
    isVoce: u.userId === usuarioId,
  }))

  const voce = eu && euPosicao > 10 ? {
    pos:    euPosicao,
    userId: eu.userId,
    nome:   'Você',
    valor:  fmt(eu[chave]),
  } : null

  return { podio: top3, lista, voce }
}
