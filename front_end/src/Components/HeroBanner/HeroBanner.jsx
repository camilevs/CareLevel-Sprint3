import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../Logo/Logo';

const SLIDES_DARK = [
  { id: 'slide-1', headlineParts: ['Eleve seu ', 'bem-estar', ' todos os dias'],   imageSrc: '/banner_ideia_darkmode.png',  imageAlt: 'Pessoa praticando yoga' },
  { id: 'slide-2', headlineParts: ['', 'Conquiste', ' suas metas de saúde'],        imageSrc: '/banner_ideia_darkmode2.png', imageAlt: 'Pessoa se exercitando' },
  { id: 'slide-3', headlineParts: ['', 'Cuide', ' de você com propósito'],          imageSrc: '/banner_ideia_darkmode3.png', imageAlt: 'Pessoa meditando' },
];

const SLIDES_LIGHT = [
  { id: 'slide-1', headlineParts: ['Eleve seu ', 'bem-estar', ' todos os dias'],   imageSrc: '/banner_idea.png',  imageAlt: 'Pessoa praticando yoga' },
  { id: 'slide-2', headlineParts: ['', 'Conquiste', ' suas metas de saúde'],        imageSrc: '/banner_idea2.png', imageAlt: 'Pessoa se exercitando' },
  { id: 'slide-3', headlineParts: ['', 'Cuide', ' de você com propósito'],          imageSrc: '/banner_idea3.png', imageAlt: 'Pessoa meditando' },
];

const NAV_BTN = "absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center border border-[var(--border)] bg-[rgba(26,29,36,0.85)] rounded-full [backdrop-filter:blur(8px)] cursor-pointer transition-[background,transform,border-color] duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:scale-110";

function getIsDark() {
  try { return localStorage.getItem('care-theme') !== 'light'; } catch { return true; }
}

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const slides = isDark ? SLIDES_DARK : SLIDES_LIGHT;

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[activeIndex];

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--border)]"
      style={{ background: isDark ? 'linear-gradient(135deg,#0d1a18 0%,#0F1115 45%,#0d1a0f 100%)' : 'transparent', minHeight: 'min(520px,47vw)' }}
    >
      <div
        className="absolute -top-[60px] -right-[60px] w-[260px] h-[260px] bg-[var(--accent)] opacity-[0.18] pointer-events-none z-0"
        style={{ borderRadius: '60% 40% 50% 70% / 50% 60% 40% 60%' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] bg-[var(--color-highlight)] opacity-[0.1] pointer-events-none z-0"
        style={{ borderRadius: '40% 60% 70% 50% / 60% 40% 60% 40%' }}
        aria-hidden="true"
      />

      <div className="relative z-[1]" style={{ minHeight: 'min(520px,47vw)' }}>
        <div className="relative flex items-center" style={{ minHeight: 'min(520px,47vw)' }}>
          {slide.imageSrc ? (
            <img
              src={slide.imageSrc}
              alt={slide.imageAlt}
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
            />
          ) : (
            <div
              className="absolute inset-0 z-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0d1a18 0%,#0d1a0d 60%,#0F1115 100%)' }}
              aria-label={slide.imageAlt}
            >
              <span className="text-[0.85rem] text-[var(--text-muted)] text-center p-4">{slide.imageAlt}</span>
            </div>
          )}

          {isDark && (
            <div
              className="absolute inset-0 z-[1]"
              aria-hidden="true"
              style={{ background: 'linear-gradient(100deg,rgba(15,17,21,0.94) 0%,rgba(15,17,21,0.60) 45%,rgba(15,17,21,0.12) 100%)' }}
            />
          )}

          <div
            className="relative z-[2] w-full max-w-[1200px] flex flex-col"
            style={{
              padding: 'clamp(24px,4vw,56px) clamp(20px,3.5vw,40px) clamp(48px,7vw,88px)',
              gap: 'clamp(12px,1.8vw,22px)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Logo size={36} />
              <span
                className="font-[var(--font-display)] font-black tracking-[-0.5px] text-[var(--accent)]"
                style={{ fontSize: 'clamp(0.9rem,1.4vw,1.5rem)' }}
              >
                CareLevel
              </span>
            </div>
            <h1
              className="font-[var(--font-display)] font-black text-[var(--text-primary)] leading-[1.15] tracking-[-1px] m-0"
              style={{ fontSize: 'clamp(1.5rem,3.8vw,3.6rem)', maxWidth: 'min(500px,40%)', wordBreak: 'break-word' }}
            >
              {slide.headlineParts[0]}
              <span className="font-black text-[var(--color-highlight)]">{slide.headlineParts[1]}</span>
              {slide.headlineParts[2]}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Slide anterior"
          className={NAV_BTN}
          style={{ left: 'clamp(6px,4vw,50px)', width: 'clamp(32px,4vw,48px)', height: 'clamp(32px,4vw,48px)' }}
        >
          <ChevronLeft size={32} color="#ffffff" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Próximo slide"
          className={NAV_BTN}
          style={{ right: 'clamp(6px,4vw,50px)', width: 'clamp(32px,4vw,48px)', height: 'clamp(32px,4vw,48px)' }}
        >
          <ChevronRight size={32} color="#ffffff" />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {slides.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`h-1.5 rounded-[3px] border-0 cursor-pointer transition-[width,background-color] duration-300 ${index === activeIndex ? 'w-12 bg-[var(--accent)]' : 'w-8 bg-[var(--bg-elevated)]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
