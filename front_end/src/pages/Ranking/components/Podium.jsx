function Avatar({ item }) {
  const cls = "w-full h-full object-cover block rounded-full"
  if (item.avatar === 'foto' && item.img) {
    return <img src={item.img} alt={item.nome} className={cls} />
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--text-primary)]">
      {item.avatar === 'emoji' ? item.emoji : (item.letra ?? item.nome.charAt(0))}
    </div>
  )
}

export default function Podium({ top3 = [], showIcon = false }) {
  if (top3.length === 0) return null
  const [segundo, primeiro, terceiro] = top3

  const renderItem = (item) => item && (
    <div key={item.nome} className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-14 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
        <Avatar item={item} />
        <span className="absolute -bottom-0.5 -right-0.5 text-lg leading-none">{item.medalha}</span>
      </div>
      <span className="text-[13px] font-semibold text-[var(--text-primary)] text-center max-w-[80px] truncate">{item.nome}</span>
      <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
        {showIcon && <img src="/512x512bb%204.svg" alt="" width={12} height={12} className="flex-shrink-0" />}
        {item.valor}
      </span>
    </div>
  )

  return (
    <div className="flex items-end justify-center gap-6 py-2">
      {renderItem(segundo)}
      <div className="flex flex-col items-center gap-2 -mb-2">
        <div className="relative w-[72px] h-[72px] rounded-full bg-[var(--bg-elevated)] border-[3px] border-[var(--accent)] overflow-hidden shadow-[0_0_16px_var(--accent-glow)]">
          <Avatar item={primeiro} />
          <span className="absolute -bottom-0.5 -right-0.5 text-xl leading-none">{primeiro?.medalha}</span>
        </div>
        <span className="text-sm font-bold text-[var(--text-primary)] text-center max-w-[88px] truncate">{primeiro?.nome}</span>
        <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
          {showIcon && <img src="/512x512bb%204.svg" alt="" width={12} height={12} className="flex-shrink-0" />}
          {primeiro?.valor}
        </span>
      </div>
      {renderItem(terceiro)}
    </div>
  )
}
