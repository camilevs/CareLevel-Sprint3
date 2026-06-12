import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecompensas } from '../../services/api';
import styles from './RecompensasPreview.module.css';

const MAX_ITEMS    = 8;
const CARD_W       = 138;
const CARD_GAP     = 12;
const SCROLL_AMT   = 3 * (CARD_W + CARD_GAP); // 3 cartas por swipe = 450 px
const ANIM_MS      = 600;                       // duração da animação (ms)
const INTERVAL_MS  = 10_000;                    // intervalo entre swipes (ms)

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4); // arranca rápido, desacelera bruscamente
}

export default function RecompensasPreview() {
  const navigate = useNavigate();
  const [recompensas, setRecompensas] = useState([]);

  const trackRef   = useRef(null);
  const posRef     = useRef(0);
  const halfRef    = useRef(0);
  const rafRef     = useRef(null);
  const anim       = useRef({ active: false, from: 0, to: 0, startTime: 0 });
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const startPos   = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    fetchRecompensas()
      .then((data) => setRecompensas(data.slice(0, MAX_ITEMS)))
      .catch(() => {});
  }, []);

  const applyPos = useCallback((pos) => {
    const half = halfRef.current;
    if (half > 0) {
      while (-pos >= half) pos += half;
      while (pos > 0)      pos -= half;
    }
    posRef.current = pos;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${pos}px)`;
    }
  }, []);

  useEffect(() => {
    if (recompensas.length === 0) return;
    halfRef.current = recompensas.length * (CARD_W + CARD_GAP);

    // rAF: só move o carrossel quando a animação está ativa
    const tick = (time) => {
      const a = anim.current;
      if (a.active && !dragging.current) {
        const progress = Math.min((time - a.startTime) / ANIM_MS, 1);
        applyPos(a.from + (a.to - a.from) * easeOutQuart(progress));
        if (progress >= 1) a.active = false;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // A cada 10 s dispara o swipe automático
    const triggerSwipe = () => {
      if (dragging.current) return;
      anim.current = {
        active:    true,
        from:      posRef.current,
        to:        posRef.current - SCROLL_AMT,
        startTime: performance.now(),
      };
    };

    const intervalId = setInterval(triggerSwipe, INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [recompensas, applyPos]);

  // ── drag (cancela animação em andamento) ──────────────
  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    anim.current.active = false;
    dragging.current    = true;
    hasDragged.current  = false;
    startX.current      = e.clientX;
    startPos.current    = posRef.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    applyPos(startPos.current + delta);
  }, [applyPos]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleCardClick = useCallback((e) => {
    if (hasDragged.current) { e.preventDefault(); e.stopPropagation(); return; }
    navigate('/recompensas');
  }, [navigate]);

  if (recompensas.length === 0) return null;

  const items = [...recompensas, ...recompensas];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recompensas</h2>
        <button type="button" className={styles.verTodas} onClick={() => navigate('/recompensas')}>
          Ver todas
        </button>
      </div>

      <div
        className={styles.stripWrap}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={trackRef} className={styles.track}>
          {items.map((r, i) => (
            <button
              key={`${r.id}-${i}`}
              type="button"
              className={styles.card}
              onClick={handleCardClick}
              aria-label={r.nome}
              draggable={false}
            >
              <div className={styles.imgWrap}>
                <img
                  src={r.imagem}
                  alt=""
                  className={styles.img}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  draggable={false}
                />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.nome}>{r.nome}</span>
                <div className={styles.custo}>
                  <img src="/512x512bb%204.svg" alt="" className={styles.custoIcon} draggable={false} />
                  <span className={styles.custoVal}>{r.custo}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className={styles.fadeLeft}  aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />
      </div>
    </section>
  );
}
