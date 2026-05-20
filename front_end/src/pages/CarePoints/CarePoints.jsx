import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from '../../Components/Footer/Footer';

import { fetchCarepoints } from "../../services/api";
import { useUser } from "../../Components/UserContext/UserContext";
import styles from "./CarePoints.module.css";

const PAGE_SIZE = 4;

function Bar({ b, maxVal }) {
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);
  const BAR_MAX_PX = 110;
  const heightPx = Math.round((b.valor / maxVal) * BAR_MAX_PX);

  const handleMouseEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setTooltip({ x: r.left + r.width / 2, y: r.top });
    }
  };

  return (
    <div className={styles.barWrapper}>
      <div
        ref={ref}
        className={styles.bar}
        style={{
          height: `${heightPx}px`,
          background: b.destaque ? "var(--accent-hover)" : "var(--accent)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTooltip(null)}
      />
      <span className={styles.barLabel}>{b.mes}</span>
      {tooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, calc(-100% - 6px))",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div className={styles.barTooltip}>
              {b.valor.toLocaleString("pt-BR")} pts
            </div>
            <div className={styles.barTooltipArrow} />
          </div>,
          document.body
        )}
    </div>
  );
}

function HistoricoRow({ row }) {
  const isDebito = row.tipo === "debito";
  const isCredito = row.tipo === "credito";

  const rowClass = isCredito
    ? `${styles.historicoRow} ${styles.historicoRowCredito}`
    : isDebito
    ? `${styles.historicoRow} ${styles.historicoRowDebito}`
    : `${styles.historicoRow} ${styles.historicoRowNeutro}`;

  const iconClass = isCredito
    ? `${styles.historicoIcon} ${styles.historicoIconCredito}`
    : isDebito
    ? `${styles.historicoIcon} ${styles.historicoIconDebito}`
    : `${styles.historicoIcon} ${styles.historicoIconNeutro}`;

  const pontosClass = isCredito
    ? `${styles.historicoPontos} ${styles.historicoPontosCredito}`
    : isDebito
    ? `${styles.historicoPontos} ${styles.historicoPontosDebito}`
    : `${styles.historicoPontos} ${styles.historicoPontosNeutro}`;

  return (
    <div className={rowClass}>
      <div className={styles.historicoDate}>
        <div className={iconClass}>
          {isDebito ? "↓" : "↑"}
        </div>
        <span className={styles.historicoDateText}>{row.data}</span>
      </div>
      <span className={styles.historicoAtividade}>{row.atividade}</span>
      <div className={styles.historicoPontosWrapper}>
        <span className={pontosClass}>{row.pontos}</span>
      </div>
    </div>
  );
}

export default function CarePoints() {
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchCarepoints().then(setDados).catch(console.error);
  }, []);

  const analise = dados?.analise ?? [];

  const localMissionsHistory = (() => {
    try { return JSON.parse(localStorage.getItem('caremissions_history') || '[]'); }
    catch { return []; }
  })();

  const historico = [...localMissionsHistory, ...(dados?.historico ?? [])];
  const maxVal = analise.length > 0 ? Math.max(...analise.map((b) => b.valor)) : 1;

  const historicoFiltrado = historico.filter((row) =>
    row.atividade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.topSection}>
            <div className={styles.cardGrafico}>
              <div className={styles.cardLeft}>
                <p className={styles.cardPontos}>
                  {user.points.toLocaleString("pt-BR")}
                </p>
                <p className={styles.cardTitulo}>CarePoints</p>
                <p className={styles.cardValidade}>
                  Válidos até {dados?.validadePoints ?? "—"}
                </p>
                <button className={styles.btnResgate} onClick={() => navigate('/recompensas')}>RESGATE AQUI</button>
              </div>

              <div className={styles.cardRight}>
                <p className={styles.graficoLabel}>ANÁLISE ÚLTIMOS MESES</p>
                <div className={styles.graficoArea}>
                  {analise.map((b, i) => (
                    <Bar key={i} b={b} maxVal={maxVal} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.historicoSection}>
            <div className={styles.historicoHeader}>
              <h2 className={styles.historicoTitulo}>Histórico de CarePoints</h2>
              <div className={styles.buscaWrapper}>
                <input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={styles.buscaInput}
                />
                <span className={styles.buscaIcon}>🔍</span>
              </div>
            </div>

            <div className={styles.tabelaWrapper}>
              <div className={styles.tabelaHeader}>
                <span>Data</span>
                <span>Atividade</span>
                <span className={styles.tabelaHeaderRight}>Pontos</span>
              </div>

              <div className={styles.tabelaLinhas}>
                {historicoFiltrado.slice(0, PAGE_SIZE).map((row, i) => (
                  <HistoricoRow key={i} row={row} />
                ))}
              </div>

              <div className={styles.verMaisWrapper}>
                <button
                  onClick={() => navigate("/carepoints/historico")}
                  className={styles.btnVerMais}
                >
                  Ver tudo
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
