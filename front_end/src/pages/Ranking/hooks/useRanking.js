import { useState, useEffect } from 'react'
import { getRanking } from '../services/rankingService'

export function useRanking() {
  const [abaAtual, setAbaAtual]         = useState('nivel')
  const [dados, setDados]               = useState({})
  const [loading, setLoading]           = useState(true)
  const [rankingAtivo, setRankingAtivo] = useState(true)

  useEffect(() => {
    if (!rankingAtivo) return

    setLoading(true)

    getRanking(abaAtual, 'usr_logado')
      .then(setDados)
      .catch(err => console.error('[useRanking]', err))
      .finally(() => setLoading(false))
  }, [abaAtual, rankingAtivo])

  function toggleRanking() {
    setRankingAtivo(prev => !prev)
  }

  return {
    abaAtual,
    setAbaAtual,
    podio:        dados.podio ?? [],
    lista:        dados.lista ?? [],
    voce:         dados.voce  ?? null,
    loading,
    rankingAtivo,
    toggleRanking,
  }
}
