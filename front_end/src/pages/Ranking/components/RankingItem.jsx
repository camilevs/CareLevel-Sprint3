import styles from './RankingItem.module.css'

export default function RankingItem({ posicao, nome, valor, destaque = false, showIcon = false }) {
  return (
    <div className={`${styles.item} ${destaque ? styles.voce : ''}`}>
      <span className={styles.pos}>{posicao}</span>
      <span className={styles.nome}>{nome}</span>
      <span className={styles.valor} style={showIcon ? { display: 'flex', alignItems: 'center', gap: 4 } : {}}>
        {showIcon && <img src="/512x512bb%204.svg" alt="" width={13} height={13} style={{ flexShrink: 0 }} />}
        {valor}
      </span>
    </div>
  )
}
