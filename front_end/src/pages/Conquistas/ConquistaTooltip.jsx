import { createPortal } from "react-dom";

export default function ConquistaTooltip({ titulo, descricao, rodape, x, y, below }) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: below
          ? "translate(-50%, 12px)"
          : "translate(-50%, calc(-100% - 12px))",
        zIndex: 9999,
        width: 220,
        pointerEvents: "none",
        display: "flex",
        flexDirection: below ? "column-reverse" : "column",
      }}
      className="animate-fade-in"
    >
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="14" cy="4" r="2" />
              <path
                d="M7 21l3-6 2 2 3-4 3 5"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12l4-3 3 2 3-3 3 1"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[var(--text-primary)] font-bold text-sm leading-tight">{titulo}</span>
        </div>

        <p className="text-[var(--text-secondary)] text-xs px-3 pb-3 leading-[1.4] m-0">{descricao}</p>

        <div className="mx-3 mb-3 rounded-[var(--radius-sm)] px-3 py-1.5 text-center bg-[var(--accent-subtle)] border border-[rgba(103,185,159,0.2)]">
          <span className="text-[var(--accent)] text-[10px] font-bold">{rodape}</span>
        </div>
      </div>

      <div
        className="mx-auto w-3 h-3 bg-[var(--bg-secondary)]"
        style={{
          clipPath: below
            ? "polygon(50% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />
    </div>,
    document.body
  );
}
