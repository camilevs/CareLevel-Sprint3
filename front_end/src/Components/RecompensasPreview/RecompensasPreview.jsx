import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecompensas } from '../../services/api';

const MAX_ITEMS    = 8;
const CARD_W       = 138;
const CARD_GAP     = 12;
const SCROLL_AMT   = 3 * (CARD_W + CARD_GAP);
const ANIM_MS      = 600;
const INTERVAL_MS  = 10_000;

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
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
    <section className="py-2 pb-8">
      <div className="w-[min(1100px,calc(100%-48px))] mx-auto mb-4 flex items-center justify-between">
        <h2 className="font-[var(--font-display)] text-2xl font-extrabold text-[var(--text-primary)] tracking-[4px] uppercase m-0">Recompensas</h2>
        <button
          type="button"
          className="border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full py-1.5 px-3.5 text-[0.8rem] font-bold cursor-pointer transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]"
          onClick={() => navigate('/recompensas')}
        >
          Ver todas
        </button>
      </div>

      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={trackRef} className="flex gap-3 py-1 pb-3.5 will-change-transform">
          {items.map((r, i) => (
            <button
              key={`${r.id}-${i}`}
              type="button"
              className="group flex-shrink-0 w-[138px] border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] cursor-[inherit] overflow-hidden p-0 flex flex-col text-left select-none transition-[transform,box-shadow,border-color] duration-[280ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:border-[var(--accent)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
              onClick={handleCardClick}
              aria-label={r.nome}
              draggable={false}
            >
              <div className="w-full h-24 bg-[var(--bg-tertiary)] overflow-hidden">
                <img
                  src={r.imagem}
                  alt=""
                  className="w-full h-full object-cover block transition-transform duration-300 ease-out pointer-events-none group-hover:scale-[1.06]"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  draggable={false}
                />
              </div>
              <div className="p-2.5 pb-3 flex flex-col gap-[7px] flex-1">
                <span className="text-[0.78rem] font-bold text-[var(--text-primary)] leading-[1.25] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [display:-webkit-box] overflow-hidden">
                  {r.nome}
                </span>
                <div className="flex items-center gap-1 mt-auto">
                  <img src="/512x512bb%204.svg" alt="" className="w-[13px] h-[13px] object-contain pointer-events-none" draggable={false} />
                  <span className="text-[0.78rem] font-bold text-[var(--text-secondary)]">{r.custo}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-[2] bg-gradient-to-r from-[var(--fade-bg)] to-transparent" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-[2] bg-gradient-to-l from-[var(--fade-bg)] to-transparent" aria-hidden="true" />
      </div>
    </section>
  );
}
