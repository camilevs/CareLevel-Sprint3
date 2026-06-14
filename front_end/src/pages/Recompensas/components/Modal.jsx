import { X, Check, Gift } from 'lucide-react'

const GREEN       = '#22c55e'
const GREEN_HOVER = '#16a34a'
const GREEN_DARK  = '#15803d'
const GREEN_GLOW  = 'rgba(34,197,94,0.35)'
const GREEN_SUB   = 'rgba(34,197,94,0.10)'
const GREEN_BDR   = 'rgba(34,197,94,0.45)'

export default function Modal({
  tipo,
  recompensa,
  saldoAtual,
  onCancelar,
  onConfirmar,
  onTentarNovamente,
  onMaisResgates,
  onVoltarMenu,
}) {
  const saldoFinal = saldoAtual - (recompensa?.custo ?? 0)

  const btnSecondary =
    'flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-semibold ' +
    'border border-[var(--border)] cursor-pointer bg-[var(--bg-elevated)] ' +
    'text-[var(--text-secondary)] font-inherit transition-[background,transform] ' +
    'duration-150 hover:bg-[var(--bg-tertiary)] hover:-translate-y-px'

  const shell =
    'w-full max-w-[400px] rounded-[var(--radius-xl)] overflow-hidden ' +
    'bg-[var(--bg-secondary)] border border-[var(--border)] ' +
    'shadow-[var(--shadow-lg)] animate-pop-in'

  return (
    <div
      className="fixed inset-0 bg-black/65 grid place-items-center z-[1000] p-4 box-border backdrop-blur-sm animate-fade-in"
      onClick={onCancelar}
    >
      <div className={shell} onClick={(e) => e.stopPropagation()}>

        {/* ── CONFIRMAÇÃO ─────────────────────────────────────────── */}
        {tipo === 'confirmacao' && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` }} className="px-5 py-4">
              <h2 className="text-[11px] font-black text-white tracking-[0.08em] text-center m-0">
                RESGATE DE RECOMPENSAS
              </h2>
            </div>

            <div className="p-5 grid gap-4">
              <div className="grid grid-cols-[80px_1fr] gap-3.5 items-start">
                <img
                  src={recompensa.imagem}
                  alt={recompensa.nome}
                  className="w-[80px] h-[80px] rounded-[var(--radius-sm)] object-cover flex-shrink-0"
                />
                <div className="grid gap-2 min-w-0">
                  <p className="text-[13px] font-bold text-[var(--text-primary)] leading-snug">
                    {recompensa.nome}
                  </p>
                  <table className="border-collapse w-full text-xs text-[var(--text-secondary)]">
                    <tbody>
                      <tr>
                        <td className="py-0.5">Seu Saldo</td>
                        <td className="text-right font-bold text-[var(--text-primary)]">
                          {saldoAtual.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-0.5"></td>
                        <td className="text-right font-bold text-[#fca5a5]">
                          -{recompensa.custo}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-semibold text-[var(--text-primary)]">Saldo Final</td>
                        <td className="text-right font-bold text-[var(--text-primary)]">
                          {saldoFinal.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-[var(--text-muted)] leading-[1.4]">
                    Você deseja resgatar esta recompensa?
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button onClick={onCancelar} className={btnSecondary}>CANCELAR</button>
                <button
                  onClick={onConfirmar}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold border-none cursor-pointer text-white font-inherit transition-[background,transform] duration-150 hover:-translate-y-px"
                  style={{ background: GREEN, boxShadow: `0 4px 12px ${GREEN_GLOW}` }}
                  onMouseOver={e => e.currentTarget.style.background = GREEN_HOVER}
                  onMouseOut={e => e.currentTarget.style.background = GREEN}
                >
                  <Gift size={13} strokeWidth={2.5} />
                  RESGATAR
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ERRO: SALDO INSUFICIENTE ─────────────────────────────── */}
        {tipo === 'erro-saldo' && (
          <div className="p-6 grid justify-items-center gap-3.5 text-center">
            <div
              className="w-[56px] h-[56px] rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}
            >
              <X size={22} strokeWidth={3} />
            </div>
            <div className="grid gap-1">
              <h2 className="text-sm font-black text-[var(--text-primary)] tracking-[0.03em] m-0">
                SALDO INSUFICIENTE
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-[1.5]">
                Continue cumprindo suas metas e tente novamente em seguida.
              </p>
            </div>
            <div className="flex gap-2.5 w-full mt-1">
              <button onClick={onCancelar} className={btnSecondary}>CANCELAR</button>
              <button
                onClick={onVoltarMenu}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold border-none cursor-pointer text-white font-inherit transition-[background,transform] duration-150 hover:-translate-y-px"
                style={{ background: GREEN, boxShadow: `0 4px 12px ${GREEN_GLOW}` }}
                onMouseOver={e => e.currentTarget.style.background = GREEN_HOVER}
                onMouseOut={e => e.currentTarget.style.background = GREEN}
              >
                VOLTAR AO MENU
              </button>
            </div>
          </div>
        )}

        {/* ── ERRO: PROCESSAMENTO ──────────────────────────────────── */}
        {tipo === 'erro-processamento' && (
          <div className="p-6 grid justify-items-center gap-3.5 text-center">
            <div
              className="w-[56px] h-[56px] rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}
            >
              <X size={22} strokeWidth={3} />
            </div>
            <div className="grid gap-1">
              <h2 className="text-sm font-black text-[var(--text-primary)] tracking-[0.03em] m-0">
                ERRO AO PROCESSAR RESGATE
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-[1.5]">
                Tente novamente ou volte a aba anterior.
              </p>
            </div>
            <div className="flex gap-2.5 w-full mt-1">
              <button onClick={onCancelar} className={btnSecondary}>CANCELAR</button>
              <button
                onClick={onTentarNovamente}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold border-none cursor-pointer text-white font-inherit transition-[background,transform] duration-150 hover:-translate-y-px"
                style={{ background: GREEN, boxShadow: `0 4px 12px ${GREEN_GLOW}` }}
                onMouseOver={e => e.currentTarget.style.background = GREEN_HOVER}
                onMouseOut={e => e.currentTarget.style.background = GREEN}
              >
                TENTAR NOVAMENTE
              </button>
            </div>
          </div>
        )}

        {/* ── SUCESSO ──────────────────────────────────────────────── */}
        {tipo === 'sucesso' && (
          <div className="p-6 grid justify-items-center gap-3.5 text-center">
            <div
              className="w-[56px] h-[56px] rounded-full grid place-items-center flex-shrink-0 animate-pop-in"
              style={{
                background: GREEN_SUB,
                border: `1px solid ${GREEN_BDR}`,
                color: GREEN,
                boxShadow: `0 0 20px ${GREEN_GLOW}`,
              }}
            >
              <Check size={24} strokeWidth={3} />
            </div>
            <div className="grid gap-1">
              <h2 className="text-sm font-black text-[var(--text-primary)] tracking-[0.03em] m-0">
                RESGATE CONCLUÍDO COM SUCESSO
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-[1.5]">
                Fale com o RH da sua empresa para obter a recompensa resgatada.
              </p>
            </div>
            <div className="flex gap-2.5 w-full mt-1">
              <button onClick={onMaisResgates} className={btnSecondary}>MAIS RESGATES</button>
              <button
                onClick={onVoltarMenu}
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold border-none cursor-pointer text-white font-inherit transition-[background,transform] duration-150 hover:-translate-y-px"
                style={{ background: GREEN, boxShadow: `0 4px 12px ${GREEN_GLOW}` }}
                onMouseOver={e => e.currentTarget.style.background = GREEN_HOVER}
                onMouseOut={e => e.currentTarget.style.background = GREEN}
              >
                VOLTAR AO MENU
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
