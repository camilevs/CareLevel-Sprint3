import { useState, useEffect } from 'react'
import { Gift, Star } from 'lucide-react'

const GREEN       = '#22c55e'
const GREEN_HOVER = '#16a34a'
const GREEN_GLOW  = 'rgba(34,197,94,0.35)'

export default function RecompensaCard({ recompensa, onResgatar, index = 0 }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + index * 70)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div
      className="group relative grid grid-rows-[auto_1fr] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] transition-[transform,box-shadow,border-color] duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.4s ease ${80 + index * 70}ms, transform 0.4s cubic-bezier(0.34,1.2,0.64,1) ${80 + index * 70}ms`,
      }}
      onMouseEnter={e => {
        setHovered(true)
        e.currentTarget.style.borderColor = GREEN
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.45)'
      }}
      onMouseLeave={e => {
        setHovered(false)
        setPressed(false)
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Badge PREMIUM */}
      {recompensa.custo >= 500 && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-[#1a1200] text-[10px] font-black tracking-[0.05em] px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
          <Star size={10} fill="#1a1200" strokeWidth={0} />
          PREMIUM
        </div>
      )}

      {/* Imagem */}
      <div className="relative w-full aspect-video overflow-hidden bg-[var(--bg-tertiary)]">
        <img
          src={recompensa.imagem}
          alt={recompensa.nome}
          className="w-full h-full object-cover block"
          style={{
            transform: hovered ? 'scale(1.10)' : 'scale(1)',
            transition: 'transform 450ms cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[rgba(10,10,20,0.6)] pointer-events-none" />

        {/* Custo */}
        <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-md rounded-full px-2.5 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <img src="/512x512bb%204.svg" alt="CarePoints" className="w-3.5 h-3.5 object-contain flex-shrink-0" />
          <span className="text-[13px] font-extrabold text-white tracking-[0.02em]">{recompensa.custo}</span>
        </div>
      </div>

      {/* Rodapé */}
      <div className="grid gap-3 p-3.5">
        <p className="text-[13px] font-bold text-[var(--text-primary)] leading-snug">
          {recompensa.nome}
        </p>

        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold tracking-[0.06em] border-none cursor-pointer text-white font-inherit transition-transform duration-150"
          style={{
            background: GREEN,
            boxShadow: `0 4px 12px ${GREEN_GLOW}`,
            transform: pressed ? 'scale(0.97)' : '',
          }}
          onMouseOver={e => { e.currentTarget.style.background = GREEN_HOVER; e.currentTarget.style.boxShadow = `0 6px 18px ${GREEN_GLOW}` }}
          onMouseOut={e => { e.currentTarget.style.background = GREEN; e.currentTarget.style.boxShadow = `0 4px 12px ${GREEN_GLOW}` }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onClick={() => onResgatar(recompensa)}
        >
          <Gift size={13} strokeWidth={2.5} />
          RESGATAR
        </button>
      </div>
    </div>
  )
}
