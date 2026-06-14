import { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { useRanking } from './hooks/useRanking';
import Podium from './components/Podium';
import RankingItem from './components/RankingItem';

const ABAS = [
  { id: 'pontos',  label: 'Pontos\nTotais' },
  { id: 'nivel',   label: 'Nível'          },
  { id: 'streak',  label: 'Streak'         },
  { id: 'equipe',  label: 'Equipe'         },
];

function ModalConfirmar({ tipo, onConfirmar, onCancelar }) {
  const ativando = tipo === 'ativar';
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[300] [backdrop-filter:blur(4px)] animate-[fadeIn_0.2s]">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] py-8 px-8 max-w-[380px] w-[90%] text-center shadow-[var(--shadow-lg)] flex flex-col items-center gap-5 animate-[modalIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
        <p className="text-lg font-extrabold text-[var(--text-primary)] m-0">{ativando ? 'Ativar Ranking' : 'Desativar Ranking'}</p>
        <div className="opacity-70">
          {ativando
            ? <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="36" height="48" rx="6" stroke="var(--accent)" strokeWidth="3"/><path d="M30 32h18M38 24l10 8-10 8" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="20" y="8" width="36" height="48" rx="6" stroke="var(--accent)" strokeWidth="3"/><path d="M34 32H16M24 24L14 32l10 8" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </div>
        <p className="text-[15px] font-semibold text-[var(--text-primary)] m-0">
          {ativando ? 'Você Deseja Ativar o Ranking?' : 'Você Deseja Desativar o Ranking?'}
        </p>
        <p className="text-sm text-[var(--text-secondary)] m-0">
          {ativando ? 'Suas estatísticas estarão públicas a partir deste momento' : 'Você poderá reativar a qualquer momento'}
        </p>
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 bg-transparent border border-[var(--border)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] py-[11px] text-sm font-bold cursor-pointer font-[var(--font-body)] transition-[background,border-color] duration-150 hover:bg-[var(--bg-elevated)] hover:border-[var(--accent)]"
            onClick={onCancelar}
          >CANCELAR</button>
          <button
            className="flex-1 bg-[var(--accent)] border-0 text-white rounded-[var(--radius-sm)] py-[11px] text-sm font-bold cursor-pointer font-[var(--font-body)] transition-[background,transform] duration-150 shadow-[0_4px_12px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:-translate-y-px"
            onClick={onConfirmar}
          >{ativando ? 'ATIVAR' : 'DESATIVAR'}</button>
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const {
    abaAtual, setAbaAtual,
    podio, lista, voce,
    loading,
    rankingAtivo, toggleRanking,
  } = useRanking();

  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal() { setModalAberto(true); }
  function fecharModal() { setModalAberto(false); }
  function confirmar() { toggleRanking(); setModalAberto(false); }

  if (!rankingAtivo) {
    return (
      <>
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 px-6 bg-[var(--bg-primary)] min-h-[calc(100vh-64px)]">
          <p className="text-lg font-semibold text-[var(--text-secondary)] text-center leading-relaxed">
            Ative o Ranking para ver<br />estatísticas
          </p>
          <button
            className="bg-[var(--accent)] text-white border-0 rounded-[var(--radius-sm)] py-3 px-8 text-sm font-bold cursor-pointer font-[var(--font-body)] transition-[background,transform] duration-150 shadow-[0_4px_16px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:-translate-y-px"
            onClick={abrirModal}
          >
            Ativar ranking...
          </button>
        </div>
        {modalAberto && <ModalConfirmar tipo="ativar" onConfirmar={confirmar} onCancelar={fecharModal} />}
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="flex-1 flex flex-col md:flex-row md:items-start gap-5 p-5 md:p-8 bg-[var(--bg-primary)] max-w-[1200px] mx-auto w-full">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4 md:w-[340px] flex-shrink-0">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de ranking">
            {ABAS.map(aba => (
              <button
                key={aba.id}
                className={`py-2 px-4 rounded-[var(--radius-sm)] text-sm font-bold border cursor-pointer font-[var(--font-body)] transition-all duration-200 text-center leading-tight ${abaAtual === aba.id ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_4px_12px_var(--accent-glow)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
                onClick={() => setAbaAtual(aba.id)}
              >
                {aba.label.split('\n').map((linha, i) => (
                  <span key={i}>{linha}{i === 0 && aba.label.includes('\n') && <br />}</span>
                ))}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 flex items-end justify-center gap-2 h-[100px] overflow-hidden" aria-label="Gráfico de desempenho">
            <div className="w-10 bg-[var(--accent)] opacity-60 rounded-t-[4px]" style={{height:'45%'}} />
            <div className="w-10 bg-[var(--accent)] opacity-80 rounded-t-[4px]" style={{height:'70%'}} />
            <div className="w-10 bg-[var(--accent)] rounded-t-[4px]" style={{height:'100%'}} />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
            {loading
              ? <p className="text-sm text-[var(--text-muted)] text-center py-4">Carregando...</p>
              : <Podium top3={podio} showIcon={abaAtual === 'pontos'} />
            }
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            {loading ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">Carregando...</p>
            ) : (
              <>
                {lista.map(item => (
                  <RankingItem
                    key={item.pos}
                    posicao={item.pos}
                    nome={item.nome}
                    valor={item.valor}
                    destaque={item.isVoce}
                    showIcon={abaAtual === 'pontos'}
                  />
                ))}
                {voce && (
                  <>
                    <div className="border-t border-dashed border-[var(--border)] mx-3 my-1" />
                    <RankingItem
                      posicao={voce.pos}
                      nome={voce.nome}
                      valor={voce.valor}
                      destaque
                      showIcon={abaAtual === 'pontos'}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <button
            className="self-end bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded-[var(--radius-sm)] py-2 px-4 text-sm cursor-pointer font-[var(--font-body)] transition-all duration-200 hover:border-[var(--red)] hover:text-[#fca5a5]"
            onClick={abrirModal}
          >
            Desativar ranking...
          </button>
        </div>

      </main>

      {modalAberto && <ModalConfirmar tipo="desativar" onConfirmar={confirmar} onCancelar={fecharModal} />}
      <Footer />
    </>
  );
}
