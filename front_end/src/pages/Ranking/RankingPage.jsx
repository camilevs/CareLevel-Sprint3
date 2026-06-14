import { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

import { useRanking } from './hooks/useRanking';
import Podium from './components/Podium';
import RankingItem from './components/RankingItem';
import styles from './Ranking.module.css';

const ABAS = [
  { id: 'pontos',  label: 'Pontos\nTotais' },
  { id: 'nivel',   label: 'Nível'          },
  { id: 'streak',  label: 'Streak'         },
  { id: 'equipe',  label: 'Equipe'         },
];

function ModalConfirmar({ tipo, onConfirmar, onCancelar }) {
  const ativando = tipo === 'ativar';
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p className={styles.modalTitulo}>{ativando ? 'Ativar Ranking' : 'Desativar Ranking'}</p>
        <div className={styles.modalIcone}>
          {ativando
            ? <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="8" y="8" width="36" height="48" rx="6" stroke="#2d5240" strokeWidth="3"/><path d="M30 32h18M38 24l10 8-10 8" stroke="#2d5240" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="20" y="8" width="36" height="48" rx="6" stroke="#2d5240" strokeWidth="3"/><path d="M34 32H16M24 24L14 32l10 8" stroke="#2d5240" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </div>
        <p className={styles.modalPergunta}>
          {ativando ? 'Você Deseja Ativar o Ranking?' : 'Você Deseja Desativar o Ranking?'}
        </p>
        <p className={styles.modalDescricao}>
          {ativando
            ? 'Suas estatísticas estarão públicas a partir deste momento'
            : 'Você poderá reativar a qualquer momento'}
        </p>
        <div className={styles.modalBotoes}>
          <button className={styles.btnCancelar} onClick={onCancelar}>CANCELAR</button>
          <button className={styles.btnConfirmar} onClick={onConfirmar}>
            {ativando ? 'ATIVAR' : 'DESATIVAR'}
          </button>
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
  function confirmar() {
    toggleRanking();
    setModalAberto(false);
  }

  if (!rankingAtivo) {
    return (
      <>
        <NavBar />
        <div className={styles.telaDesativado}>
          <p className={styles.textoDesativado}>
            Ative o Ranking para ver<br />estatísticas
          </p>
          <button className={styles.btnAtivar} onClick={abrirModal}>
            Ativar ranking...
          </button>
        </div>
        {modalAberto && (
          <ModalConfirmar tipo="ativar" onConfirmar={confirmar} onCancelar={fecharModal} />
        )}
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className={styles.main}>

        <div className={styles.colunaEsquerda}>

          <div className={styles.filtros} role="group" aria-label="Filtros de ranking">
            {ABAS.map(aba => (
              <button
                key={aba.id}
                className={`${styles.filtroBtn} ${abaAtual === aba.id ? styles.ativo : ''}`}
                onClick={() => setAbaAtual(aba.id)}
              >
                {aba.label.split('\n').map((linha, i) => (
                  <span key={i}>{linha}{i === 0 && aba.label.includes('\n') && <br />}</span>
                ))}
              </button>
            ))}
          </div>

          <div className={styles.graficoCard} aria-label="Gráfico de desempenho">
            <div className={styles.graficoBarras}>
              <div className={`${styles.barra} ${styles.barra1}`} />
              <div className={`${styles.barra} ${styles.barra2}`} />
              <div className={`${styles.barra} ${styles.barra3}`} />
            </div>
          </div>

          <div className={styles.podioCard}>
            {loading
              ? <p className={styles.carregando}>Carregando...</p>
              : <Podium top3={podio} showIcon={abaAtual === 'pontos'} />
            }
          </div>

        </div>

        <div className={styles.colunaDireita}>

          <div className={styles.rankingCard}>
            {loading ? (
              <p className={styles.carregando}>Carregando...</p>
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
                    <div style={{ borderTop: '1px dashed rgba(0,0,0,0.15)', margin: '4px 0' }} />
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

          <button className={styles.btnDesativar} onClick={abrirModal}>
            Desativar ranking...
          </button>

        </div>
      </main>

      {modalAberto && (
        <ModalConfirmar tipo="desativar" onConfirmar={confirmar} onCancelar={fecharModal} />
      )}
      <Footer />
    </>
  );
}
