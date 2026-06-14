import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from '../../Components/Footer/Footer';

import ConquistaTooltip from "./ConquistaTooltip";
import AlterarDestaqueModal from "./AlterarDestaqueModal";
import { fetchConquistas, salvarDestaque } from "../../services/api";
import { useUser } from "../../Components/UserContext/UserContext";

function EmblemaItem({ label, index }) {
  const [tooltip, setTooltip] = useState(null);
  const [visible, setVisible] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120 + index * 50);
    return () => clearTimeout(t);
  }, [index]);

  const handleMouseEnter = () => {
    if (spanRef.current && spanRef.current.scrollWidth > spanRef.current.clientWidth) {
      const r = spanRef.current.getBoundingClientRect();
      setTooltip({ x: r.left + r.width / 2, y: r.top });
    }
  };

  return (
    <div
      className={[
        'grid grid-cols-[26px_1fr] items-center gap-2',
        'bg-[var(--bg-elevated)] rounded-[var(--radius-sm)]',
        'px-3 py-2 cursor-pointer',
        'transition-[background,transform] duration-200',
        'hover:bg-[var(--accent-subtle)] hover:translate-x-1',
      ].join(' ')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltip(null)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-10px)',
        transition: `opacity 0.3s ease ${120 + index * 50}ms, transform 0.3s ease ${120 + index * 50}ms`,
      }}
    >
      <div className="w-[26px] h-[26px] rounded-full bg-[var(--accent-subtle)] flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7dd4b5" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <span ref={spanRef} className="text-xs text-[var(--text-primary)] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      {tooltip && createPortal(
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y, transform: "translate(-50%, calc(-100% - 8px))", zIndex: 9999, pointerEvents: "none" }}>
          <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] px-3 py-1.5 shadow-[var(--shadow-md)] text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">
            {label}
          </div>
          <div className="mx-auto w-2.5 h-2.5 bg-[var(--bg-secondary)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </div>,
        document.body
      )}
    </div>
  );
}

function MedalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7dd4b5" strokeWidth="2">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function CircleProgress({ pct, animate }) {
  const percent = parseFloat(pct);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = animate ? circ * (1 - percent / 100) : circ;

  return (
    <svg
      width="44" height="44" viewBox="0 0 44 44"
      className="flex-shrink-0"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle cx="22" cy="22" r={r} fill="none" stroke="#2e7a5e" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke="#7dd4b5" strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease 0.3s' }}
      />
    </svg>
  );
}

function Medal({ faded = false, tooltipData, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, below: false });
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + index * 70);
    return () => clearTimeout(t);
  }, [index]);

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
      className="relative grid justify-center gap-0.5 cursor-pointer group"
      style={{
        opacity: visible ? (faded ? 0.35 : 1) : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(6px)',
        transition: `opacity 0.35s ease ${80 + index * 70}ms, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) ${80 + index * 70}ms`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && tooltipData && (
        <ConquistaTooltip
          titulo={tooltipData.titulo}
          descricao={tooltipData.descricao}
          rodape={tooltipData.rodape}
          x={pos.x} y={pos.y} below={pos.below}
        />
      )}
      <div
        className={[
          'w-[30px] h-[30px] rounded-full bg-[var(--bg-elevated)]',
          'flex items-center justify-center',
          'transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'group-hover:scale-[1.2] group-hover:shadow-[0_0_12px_var(--accent-glow)]',
        ].join(' ')}
      >
        <MedalIcon />
      </div>
      <div className="mx-auto w-2.5 h-2.5 bg-[var(--border)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </div>
  );
}

function ConquistaCard({ c, index }) {
  const [visible, setVisible] = useState(false);
  const [animatePct, setAnimatePct] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100 + index * 80);
    const t2 = setTimeout(() => setAnimatePct(true), 400 + index * 80);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [index]);

  return (
    <div
      className={[
        'grid grid-cols-[72px_1fr] md:grid-cols-[80px_1fr]',
        'bg-[var(--bg-tertiary)] rounded-[var(--radius-md)]',
        'overflow-hidden min-h-[80px] md:h-[90px] md:min-h-0',
        'transition-[transform,box-shadow] duration-200',
        'hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]',
      ].join(' ')}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.4s ease ${100 + index * 80}ms, transform 0.4s ease ${100 + index * 80}ms`,
      }}
    >
      <div className="bg-[var(--accent-subtle)] border-r border-[rgba(103,185,159,0.2)] grid place-items-center gap-1 p-2">
        <span className="text-2xl leading-none animate-float" style={{ animationDelay: `${index * 200}ms` }}>★</span>
        <span className="text-[9px] text-[var(--accent)] font-bold text-center leading-[1.3]">{c.nome}<br />{c.sub}</span>
      </div>
      <div className="flex items-center justify-center gap-3 px-3">
        <CircleProgress pct={c.pct} animate={animatePct} />
        <span className="text-[15px] font-bold text-[var(--text-primary)]">{c.pct}%</span>
      </div>
    </div>
  );
}

export default function Conquistas() {
  const { user } = useUser();
  const [dados, setDados] = useState(null);
  const [destaque, setDestaque] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    fetchConquistas()
      .then((d) => {
        setDados(d);
        setDestaque(d.destaqueAtual ?? "");
      })
      .catch(console.error);
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSaveDestaque(novo) {
    const novoUpper = novo.toUpperCase();
    setDestaque(novoUpper);
    try { await salvarDestaque(novoUpper); }
    catch (e) { console.error("Erro ao salvar destaque", e); }
  }

  const emblemas = dados?.emblemas ?? [];
  const medalhas = dados?.medalhas ?? [];
  const detalhes = dados?.detalhes ?? [];
  const opcoesDestaque = dados?.opcoesDestaque ?? [];

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen flex flex-col font-[var(--font-body)] overflow-x-hidden">
      {modalAberto && (
        <AlterarDestaqueModal
          atual={destaque}
          opcoes={opcoesDestaque}
          onClose={() => setModalAberto(false)}
          onSave={handleSaveDestaque}
        />
      )}

      <NavBar />

      <main className="flex-1 flex justify-center items-start p-5 md:p-7 md:px-8 xl:p-9 xl:px-16 box-border">
        <div
          className="grid grid-cols-1 md:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden w-full max-w-[980px] shadow-[var(--shadow-lg)]"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
          }}
        >
          {/* SIDEBAR */}
          <div className="bg-[var(--bg-tertiary)] border-r border-[var(--border)] grid justify-items-center content-start gap-2 p-6 md:p-7 md:px-5">
            <div
              className="w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full bg-[var(--bg-elevated)] border-[3px] border-[var(--accent)] grid place-items-center mb-3.5 flex-shrink-0 transition-shadow duration-300 animate-trophy-pulse"
            >
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <polygon
                  points="32,8 40,28 60,28 44,40 50,60 32,48 14,60 20,40 4,28 24,28"
                  fill="white" opacity="0.9"
                />
                <rect x="26" y="52" width="12" height="6" rx="2" fill="white" opacity="0.7" />
                <rect x="20" y="57" width="24" height="4" rx="2" fill="white" opacity="0.6" />
              </svg>
            </div>

            <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-md)] grid justify-items-center gap-1.5 px-4 py-3 w-[85%] mb-2.5">
              {user.nivel != null && (
                <span className="bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-extrabold tracking-[0.06em] px-4 py-1 rounded-full">
                  NÍVEL {user.nivel}
                </span>
              )}
              <span className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[10px] font-bold px-3 py-1 rounded-[var(--radius-sm)] tracking-[0.04em] text-center">
                {destaque}
              </span>
            </div>

            <button
              className="bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-semibold px-5 py-1.5 rounded-[var(--radius-sm)] cursor-pointer mb-5 font-inherit transition-[background,transform,color] duration-150 hover:bg-[var(--accent)] hover:text-white hover:-translate-y-px"
              onClick={() => setModalAberto(true)}
            >
              Alterar
            </button>

            <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.05em] mb-2 self-start pl-1 uppercase">
              EMBLEMAS:
            </p>

            <div className="grid gap-2 w-full">
              {emblemas.map((label, i) => (
                <EmblemaItem key={i} label={label} index={i} />
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid gap-3.5 md:gap-[18px] p-4 md:p-6 min-w-0">

            {/* Medalhas Section */}
            <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4">
              <p className="text-[13px] text-[var(--text-secondary)] font-bold mb-3 uppercase tracking-[0.05em]">Alcançadas</p>
              <div className="flex gap-2.5 flex-wrap">
                {detalhes.map((data, i) => (
                  <Medal key={i} tooltipData={data} index={i} />
                ))}
              </div>
              <hr className="border-none border-t border-[var(--border)] my-2.5" />
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-3">Conquistas para alcançar</p>
              <div className="flex gap-2.5 flex-wrap">
                {detalhes.map((data, i) => (
                  <Medal key={i} faded tooltipData={data} index={i} />
                ))}
              </div>
            </div>

            {/* Conquistas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3.5">
              {medalhas.map((c, i) => (
                <ConquistaCard key={i} c={c} index={i} />
              ))}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
