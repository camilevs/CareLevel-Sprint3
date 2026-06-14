import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

export default function RecompensaCard({ recompensa, onResgatar, index = 0 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + index * 70)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div
      className="group relative overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.4s ease ${80 + index * 70}ms, transform 0.4s cubic-bezier(0.34,1.2,0.64,1) ${80 + index * 70}ms`,
      }}
    >
      {/* Badge PREMIUM */}
      {recompensa.custo >= 500 && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-linear-to-br from-[#f59e0b] to-[#fbbf24] text-[#1a1200] text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
          <Star size={10} fill="#1a1200" strokeWidth={0} />
          PREMIUM
        </div>
      )}

      {/* Imagem */}
      <div className="relative w-full overflow-hidden bg-(--bg-tertiary)" style={{ aspectRatio: '4/3' }}>
        <img
          src={recompensa.imagem}
          alt={recompensa.nome}
          className="w-full h-full object-cover transition-transform duration-450 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
          style={{ display: 'block', verticalAlign: 'bottom' }}
        />

        {/* Banner inferior sobreposto */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-4 py-3 bg-green-600/90 backdrop-blur-sm">
          <p className="text-[13px] font-bold text-white leading-snug m-0">{recompensa.nome}</p>

          <div className="flex items-center gap-1.5">
            <img
              src="/512x512bb%204.svg"
              alt="CarePoints"
              className="w-4 h-4 object-contain shrink-0"
            />
            <span className="text-[13px] font-extrabold text-white tracking-[0.02em]">{recompensa.custo}</span>
          </div>

          <button
            className="flex items-center justify-center w-full px-4 py-2 text-xs font-bold tracking-[0.08em] bg-white/20 hover:bg-white/35 active:scale-[0.97] cursor-pointer text-white font-inherit transition-[transform,background] duration-150"
            style={{ borderRadius: '9999px', border: 'none' }}
            onClick={() => onResgatar(recompensa)}
          >
            RESGATAR
          </button>
        </div>
      </div>
    </div>
  )
}
