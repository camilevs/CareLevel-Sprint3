import { X, Check, Gift } from 'lucide-react'

const R = '16px'

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

  const btnSecondary = {
    borderRadius: R,
    flex: 1,
    padding: '10px 16px',
    fontSize: '11px',
    fontWeight: 600,
    border: '1px solid var(--border)',
    cursor: 'pointer',
    background: 'var(--bg-elevated)',
    color: 'var(--text-secondary)',
    fontFamily: 'inherit',
    transition: 'background 0.15s, transform 0.15s',
  }

  const btnPrimary = {
    borderRadius: R,
    flex: 1,
    padding: '10px 16px',
    fontSize: '11px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    background: 'var(--accent)',
    color: '#fff',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px var(--accent-glow)',
    transition: 'background 0.15s, transform 0.15s',
  }

  return (
    <div
      className="fixed inset-0 bg-black/65 grid place-items-center z-1000 p-4 box-border backdrop-blur-sm animate-fade-in"
      onClick={onCancelar}
    >
      <div
        className="w-full overflow-hidden bg-(--bg-secondary) shadow-(--shadow-lg) animate-pop-in"
        style={{ maxWidth: '400px', borderRadius: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── CONFIRMAÇÃO ─────────────────────────────────────────── */}
        {tipo === 'confirmacao' && (
          <>
            <div className="px-5 py-4 bg-[linear-gradient(to_bottom_right,var(--green-medium),var(--green-dark))]">
              <h2 className="text-[11px] font-black text-white tracking-[0.08em] text-center m-0">
                RESGATE DE RECOMPENSAS
              </h2>
            </div>

            <div className="p-5 grid gap-4">
              <div className="grid grid-cols-[80px_1fr] gap-3.5 items-start">
                <img
                  src={recompensa.imagem}
                  alt={recompensa.nome}
                  style={{ borderRadius: '12px' }}
                  className="w-20 h-20 object-cover shrink-0"
                />
                <div className="grid gap-2 min-w-0">
                  <p className="text-[13px] font-bold text-(--text-primary) leading-snug">
                    {recompensa.nome}
                  </p>
                  <table className="border-collapse w-full text-xs text-(--text-secondary)">
                    <tbody>
                      <tr>
                        <td className="py-0.5">Seu Saldo</td>
                        <td className="text-right font-bold text-(--text-primary)">
                          {saldoAtual.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-0.5"></td>
                        <td className="text-right font-bold text-red-300">
                          -{recompensa.custo}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-semibold text-(--text-primary)">Saldo Final</td>
                        <td className="text-right font-bold text-(--text-primary)">
                          {saldoFinal.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-(--text-muted) leading-[1.4]">
                    Você deseja resgatar esta recompensa?
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button onClick={onCancelar} style={btnSecondary}>CANCELAR</button>
                <button
                  onClick={onConfirmar}
                  style={{ ...btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
          <div style={{ padding: '32px', display: 'grid', justifyItems: 'center', gap: '20px', textAlign: 'center' }}>
            <div className="w-16 h-16 rounded-full grid place-items-center shrink-0 bg-red-500/10 border border-red-500/35 text-red-300">
              <X size={26} strokeWidth={3} />
            </div>
            <div className="grid gap-2">
              <h2 className="text-sm font-black text-(--text-primary) tracking-[0.03em] m-0">
                SALDO INSUFICIENTE
              </h2>
              <p className="text-xs text-(--text-secondary) leading-normal">
                Continue cumprindo suas metas e tente novamente em seguida.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button onClick={onCancelar} style={{ ...btnSecondary, padding: '12px 16px' }}>CANCELAR</button>
              <button onClick={onVoltarMenu} style={{ ...btnPrimary, padding: '12px 16px' }}>VOLTAR AO MENU</button>
            </div>
          </div>
        )}

        {/* ── ERRO: PROCESSAMENTO ──────────────────────────────────── */}
        {tipo === 'erro-processamento' && (
          <div className="p-6 grid justify-items-center gap-3.5 text-center">
            <div className="w-14 h-14 rounded-full grid place-items-center shrink-0 bg-red-500/10 border border-red-500/35 text-red-300">
              <X size={22} strokeWidth={3} />
            </div>
            <div className="grid gap-1">
              <h2 className="text-sm font-black text-(--text-primary) tracking-[0.03em] m-0">
                ERRO AO PROCESSAR RESGATE
              </h2>
              <p className="text-xs text-(--text-secondary) leading-normal">
                Tente novamente ou volte a aba anterior.
              </p>
            </div>
            <div className="flex gap-2.5 w-full mt-1">
              <button onClick={onCancelar} style={btnSecondary}>CANCELAR</button>
              <button onClick={onTentarNovamente} style={btnPrimary}>TENTAR NOVAMENTE</button>
            </div>
          </div>
        )}

        {/* ── SUCESSO ──────────────────────────────────────────────── */}
        {tipo === 'sucesso' && (
          <div style={{ padding: '32px', display: 'grid', justifyItems: 'center', gap: '20px', textAlign: 'center' }}>
            <div className="w-16 h-16 rounded-full grid place-items-center shrink-0 animate-pop-in bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]">
              <Check size={26} strokeWidth={3} />
            </div>
            <div className="grid gap-2">
              <h2 className="text-sm font-black text-(--text-primary) tracking-[0.03em] m-0">
                RESGATE CONCLUÍDO COM SUCESSO
              </h2>
              <p className="text-xs text-(--text-secondary) leading-normal">
                Fale com o RH da sua empresa para obter a recompensa resgatada.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button onClick={onMaisResgates} style={{ ...btnSecondary, padding: '12px 16px' }}>MAIS RESGATES</button>
              <button onClick={onVoltarMenu} style={{ ...btnPrimary, padding: '12px 16px' }}>VOLTAR AO MENU</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
