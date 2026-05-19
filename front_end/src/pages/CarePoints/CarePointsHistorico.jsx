import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { fetchCarepoints } from "../../services/api";
import styles from "./CarePointsHistorico.module.css";

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

export default function CarePointsHistorico() {
  const [busca, setBusca] = useState("");
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarepoints()
      .then((dados) => {
        const localHistory = (() => {
          try { return JSON.parse(localStorage.getItem('caremissions_history') || '[]'); }
          catch { return []; }
        })();
        setHistorico([...localHistory, ...(dados.historico ?? [])]);
      })
      .catch(console.error);
  }, []);

  const historicoFiltrado = historico.filter((row) =>
    row.atividade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                onClick={() => navigate("/carepoints")}
                className={styles.btnVoltar}
              >
                ←
              </button>
              <h2 className={styles.titulo}>Histórico de CarePoints</h2>
            </div>

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

          {/* Legenda */}
          <div className={styles.legenda}>
            <span className={styles.legendaItem}>
              <span className={`${styles.legendaDot} ${styles.legendaDotCredito}`} />
              Crédito (pontos ganhos)
            </span>
            <span className={styles.legendaItem}>
              <span className={`${styles.legendaDot} ${styles.legendaDotDebito}`} />
              Débito (pontos gastos)
            </span>
          </div>

          {/* Tabela */}
          <div className={styles.tabelaWrapper}>
            <div className={styles.tabelaHeader}>
              <span>Data</span>
              <span>Atividade</span>
              <span className={styles.tabelaHeaderRight}>Pontos</span>
            </div>

            <div className={styles.tabelaLinhas}>
              {historicoFiltrado.length > 0 ? (
                historicoFiltrado.map((row, i) => <HistoricoRow key={i} row={row} />)
              ) : (
                <p className={styles.semResultados}>
                  Nenhum resultado encontrado.
                </p>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
