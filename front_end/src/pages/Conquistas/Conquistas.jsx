import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from '../../Components/Footer/Footer';

import ConquistaTooltip from "./ConquistaTooltip";
import AlterarDestaqueModal from "./AlterarDestaqueModal";
import { fetchConquistas, salvarDestaque } from "../../services/api";
import { useUser } from "../../Components/UserContext/UserContext";
import styles from "./Conquistas.module.css";

function EmblemaItem({ label }) {
  const [tooltip, setTooltip] = useState(null);
  const spanRef = useRef(null);

  const handleMouseEnter = () => {
    if (
      spanRef.current &&
      spanRef.current.scrollWidth > spanRef.current.clientWidth
    ) {
      const r = spanRef.current.getBoundingClientRect();
      setTooltip({ x: r.left + r.width / 2, y: r.top });
    }
  };

  return (
    <div
      className={styles.emblemaItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltip(null)}
    >
      <div className={styles.emblemaIconWrapper}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7dd4b5"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <span ref={spanRef} className={styles.emblemaLabel}>
        {label}
      </span>
      {tooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, calc(-100% - 8px))",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div className={styles.emblemaTooltip}>{label}</div>
            <div className={styles.emblemaTooltipArrow} />
          </div>,
          document.body
        )}
    </div>
  );
}

function MedalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7dd4b5"
      strokeWidth="2"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function CircleProgress({ pct }) {
  const percent = parseFloat(pct);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      className={styles.circleProgressSvg}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle cx="22" cy="22" r={r} fill="none" stroke="#2e7a5e" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="#7dd4b5"
        strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Medal({ faded = false, tooltipData }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, below: false });
  const ref = useRef(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const below = r.top < 250;
      setPos({ x: r.left + r.width / 2, y: below ? r.bottom : r.top, below });
    }
    setHovered(true);
  };

  return (
    <div
      ref={ref}
      className={styles.medal}
      style={{ opacity: faded ? 0.35 : 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && tooltipData && (
        <ConquistaTooltip
          titulo={tooltipData.titulo}
          descricao={tooltipData.descricao}
          rodape={tooltipData.rodape}
          x={pos.x}
          y={pos.y}
          below={pos.below}
        />
      )}
      <div className={styles.medalCircle}>
        <MedalIcon />
      </div>
      <div className={styles.medalArrow} />
    </div>
  );
}

export default function Conquistas() {
  const { user } = useUser();
  const [dados, setDados] = useState(null);
  const [destaque, setDestaque] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    fetchConquistas()
      .then((d) => {
        setDados(d);
        setDestaque(d.destaqueAtual ?? "");
      })
      .catch(console.error);
  }, []);

  async function handleSaveDestaque(novo) {
    const novoUpper = novo.toUpperCase();
    setDestaque(novoUpper);
    try {
      await salvarDestaque(novoUpper);
    } catch (e) {
      console.error("Erro ao salvar destaque", e);
    }
  }

  const emblemas = dados?.emblemas ?? [];
  const medalhas = dados?.medalhas ?? [];
  const detalhes = dados?.detalhes ?? [];
  const opcoesDestaque = dados?.opcoesDestaque ?? [];

  return (
    <div className={styles.page}>
      {modalAberto && (
        <AlterarDestaqueModal
          atual={destaque}
          opcoes={opcoesDestaque}
          onClose={() => setModalAberto(false)}
          onSave={handleSaveDestaque}
        />
      )}

      <NavBar />

      <main className={styles.main}>
        <div className={styles.layout}>

          <div className={styles.sidebar}>
            <div className={styles.trofeuWrapper}>
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <polygon
                  points="32,8 40,28 60,28 44,40 50,60 32,48 14,60 20,40 4,28 24,28"
                  fill="white"
                  opacity="0.9"
                />
                <rect x="26" y="52" width="12" height="6" rx="2" fill="white" opacity="0.7" />
                <rect x="20" y="57" width="24" height="4" rx="2" fill="white" opacity="0.6" />
              </svg>
            </div>

            <div className={styles.destaqueBox}>
              {user.nivel != null && (
                <span className={styles.nivelBadge}>NÍVEL {user.nivel}</span>
              )}
              <span className={styles.destaqueBadge}>{destaque}</span>
            </div>

            <button
              className={styles.btnAlterar}
              onClick={() => setModalAberto(true)}
            >
              Alterar
            </button>

            <p className={styles.emblemasLabel}>EMBLEMAS:</p>

            <div className={styles.emblemasList}>
              {emblemas.map((label, i) => (
                <EmblemaItem key={i} label={label} />
              ))}
            </div>
          </div>

          <div className={styles.content}>

            <div className={styles.medalhasSection}>
              <p className={styles.medalhasSectionTitulo}>Alcançadas</p>
              <div className={styles.medalhasRow}>
                {detalhes.map((data, i) => (
                  <Medal key={i} tooltipData={data} />
                ))}
              </div>
              <hr className={styles.divider} />
              <p className={styles.medalhasSubtitulo}>Conquistas para alcançar</p>
              <div className={styles.medalhasRow}>
                {detalhes.map((data, i) => (
                  <Medal key={i} faded tooltipData={data} />
                ))}
              </div>
            </div>

            <div className={styles.conquistasGrid}>
              {medalhas.map((c, i) => (
                <div key={i} className={styles.conquistaCard}>
                  <div className={styles.conquistaCardLeft}>
                    <span className={styles.conquistaStar}>★</span>
                    <span className={styles.conquistaInfo}>
                      {c.nome}
                      <br />
                      {c.sub}
                    </span>
                  </div>
                  <div className={styles.conquistaCardRight}>
                    <CircleProgress pct={c.pct} />
                    <span className={styles.conquistaPct}>{c.pct}%</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
