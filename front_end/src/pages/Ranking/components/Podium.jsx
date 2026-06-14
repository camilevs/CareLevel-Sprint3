import styles from './Podium.module.css'

function Avatar({ item }) {
  if (item.avatar === 'foto' && item.img) {
    return <img src={item.img} alt={item.nome} className={styles.avatarImg} />
  }
  if (item.avatar === 'emoji') {
    return (
      <div className={styles.avatarPlaceholder}>
        <span>{item.emoji}</span>
      </div>
    )
  }
  
  return (
    <div className={styles.avatarPlaceholder}>
      {item.letra ?? item.nome.charAt(0)}
    </div>
  )
}

export default function Podium({ top3 = [], showIcon = false }) {
  if (top3.length === 0) return null


  const [segundo, primeiro, terceiro] = top3

  const renderItem = (item) => (
    <div className={styles.item} key={item.nome}>
      <div className={styles.avatarWrap}>
        <Avatar item={item} />
        <span className={styles.medalha}>{item.medalha}</span>
      </div>
      <span className={styles.nome}>{item.nome}</span>
      <span className={styles.valor} style={showIcon ? { display: 'flex', alignItems: 'center', gap: 3 } : {}}>
        {showIcon && <img src="/512x512bb%204.svg" alt="" width={12} height={12} style={{ flexShrink: 0 }} />}
        {item.valor}
      </span>
    </div>
  )

  return (
    <div className={styles.lista}>
      {segundo  && renderItem(segundo)}
      {primeiro && renderItem(primeiro)}
      {terceiro && renderItem(terceiro)}
    </div>
  )
}
