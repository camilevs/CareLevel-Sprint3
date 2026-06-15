import { useState, useEffect } from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../../Components/Footer/Footer'
import RecompensaCard from './components/RecompensaCard'
import Modal from './components/Modal'
import { fetchRecompensas, resgatarRecompensa } from '../../services/api'
import { useUser } from '../../Components/UserContext/UserContext'

const GREEN      = 'var(--accent)'
const GREEN_DARK = 'var(--green-dark)'
const GREEN_GLOW = 'var(--accent-glow)'

export default function RecompensasPage() {
  const { user, setServerPoints } = useUser()
  const [pontos, setPontos] = useState(user.points)
  const [recompensas, setRecompensas] = useState([])
  const [recompensaSelecionada, setRecompensaSelecionada] = useState(null)
  const [tipoModal, setTipoModal] = useState(null)

  useEffect(() => {
    fetchRecompensas().then(setRecompensas).catch(console.error)
  }, [])

  useEffect(() => {
    setPontos(user.points)
  }, [user.points])

  function handleResgatar(recompensa) {
    setRecompensaSelecionada(recompensa)
    if (recompensa.custo > pontos) {
      setTipoModal('erro-saldo')
    } else {
      setTipoModal('confirmacao')
    }
  }

  async function handleConfirmar() {
    try {
      const resultado = await resgatarRecompensa(recompensaSelecionada.id)
      setPontos(resultado.saldo)
      setServerPoints(resultado.saldo)
      setTipoModal('sucesso')
    } catch (err) {
      const msg = err?.response?.data?.erro ?? ''
      if (msg === 'Saldo insuficiente') {
        setTipoModal('erro-saldo')
      } else {
        setTipoModal('erro-processamento')
      }
    }
  }

  function handleFecharModal() {
    setTipoModal(null)
    setRecompensaSelecionada(null)
  }

  function handleTentarNovamente() {
    setTipoModal('confirmacao')
  }

  return (
    <>
      <NavBar />
      <div className="w-full max-w-[1200px] mx-auto my-6 md:my-7 lg:my-8 px-4 md:px-6 lg:px-10 box-border grid gap-6 md:gap-7 lg:gap-8" style={{ paddingBottom: '48px', paddingTop: '48px' }}>

        {/* Header banner — verde */}
        <div
          className="relative overflow-hidden rounded-[var(--radius-lg)] px-5 py-10 sm:px-7 sm:py-12 md:px-9 md:py-14 animate-fade-in-up"
          style={{
            background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
            boxShadow: `0 8px 28px ${GREEN_GLOW}`,
            padding: '28px 36px',
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 animate-float" />
          <div className="absolute bottom-[-30px] right-24 w-24 h-24 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1.2s' }} />

          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="grid gap-1.5">
              <span className="inline-block bg-white/15 text-white text-[11px] font-extrabold tracking-[0.08em] px-3 py-1 rounded-full w-fit backdrop-blur-sm">
                LOJA DE RECOMPENSAS
              </span>
              <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight m-0">
                Resgate suas conquistas
              </h1>
              <p className="text-white/80 text-sm font-medium m-0">
                Troque seus CarePoints por prêmios e benefícios exclusivos.
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-white/12 rounded-[var(--radius-md)] px-4 py-3 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.15)] sm:justify-self-end">
              <img src="/512x512bb%204.svg" alt="CarePoints" className="w-7 h-7 object-contain animate-pulse-glow rounded-full" />
              <div className="grid">
                <span className="text-white/75 text-[11px] font-semibold uppercase tracking-[0.06em]">Seu saldo</span>
                <span className="text-white text-xl font-extrabold leading-none">{pontos.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-5 lg:gap-6">
          {recompensas.map((recompensa, i) => (
            <RecompensaCard
              key={recompensa.id}
              recompensa={recompensa}
              onResgatar={handleResgatar}
              index={i}
            />
          ))}
        </div>

        {tipoModal && (
          <Modal
            tipo={tipoModal}
            recompensa={recompensaSelecionada}
            saldoAtual={pontos}
            onCancelar={handleFecharModal}
            onConfirmar={handleConfirmar}
            onTentarNovamente={handleTentarNovamente}
            onMaisResgates={handleFecharModal}
            onVoltarMenu={handleFecharModal}
          />
        )}
      </div>
      <Footer />
    </>
  )
}
