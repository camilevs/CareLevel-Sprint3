export default function RankingItem({ posicao, nome, valor, destaque = false, showIcon = false }) {
  return (
    <div className={`flex items-center gap-3 py-[10px] px-3 rounded-[var(--radius-sm)] [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[var(--border)] transition-[background] duration-150 ${destaque ? 'bg-[var(--accent-subtle)] border border-[var(--accent)] !border-t-[var(--accent)]' : 'hover:bg-[var(--bg-elevated)]'}`}>
      <span className="text-sm font-bold text-[var(--text-muted)] w-6 text-center flex-shrink-0">{posicao}</span>
      <span className="flex-1 text-sm font-semibold text-[var(--text-primary)] truncate">{nome}</span>
      <span className={`text-sm font-bold flex items-center gap-1 flex-shrink-0 ${destaque ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
        {showIcon && <img src="/512x512bb%204.svg" alt="" width={13} height={13} className="flex-shrink-0" />}
        {valor}
      </span>
      <span className="text-[var(--text-muted)] text-sm leading-none">›</span>
    </div>
  )
}
