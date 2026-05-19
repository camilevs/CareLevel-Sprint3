import { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { fetchMissoes, fetchConquistas } from '../../services/api';
import { useUser } from '../../Components/UserContext/UserContext';
import styles from './JornadaPage.module.css';

// ── helpers ────────────────────────────────────────────────────
const CONCLUIDAS_KEY = 'caremissoes_concluidas';
const HISTORY_KEY    = 'caremissions_history';

function loadConcluidas() {
  try { return JSON.parse(localStorage.getItem(CONCLUIDAS_KEY) || '{}'); }
  catch { return {}; }
}
function saveConcluidas(c) {
  try { localStorage.setItem(CONCLUIDAS_KEY, JSON.stringify(c)); } catch {}
}
function addMissionHistory(missao, pts) {
  try {
    const raw     = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const d       = new Date();
    const date    = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    history.unshift({ data: date, atividade: `Missão: ${missao.titulo}`, pontos: `+${pts}`, tipo: 'credito' });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}
function parsePontos(p) {
  if (typeof p === 'number') return p;
  return parseInt(String(p).replace(/[^0-9]/g, ''), 10) || 0;
}

const FRASES = [
  'Cada passo conta. Continue sua jornada! 🌱',
  'Você está construindo algo incrível. 💫',
  'Pequenas ações, grandes transformações. ✨',
  'Seu bem-estar é sua maior conquista. 🏆',
  'Cuide de você — o mundo precisa do seu melhor. 💚',
];

const MEDAL_COLORS = {
  0: { color: '#F59E0B', glow: 'rgba(245,158,11,0.4)', label: '1º', emoji: '🥇' },
  1: { color: '#94A3B8', glow: 'rgba(148,163,184,0.3)', label: '2º', emoji: '🥈' },
  2: { color: '#CD7F32', glow: 'rgba(205,127,50,0.3)',  label: '3º', emoji: '🥉' },
};

const ABAS_RANKING = [
  { id: 'nivel',  label: 'Nível' },
  { id: 'pontos', label: 'Pontos' },
  { id: 'streak', label: 'Streak' },
  { id: 'equipe', label: 'Equipe' },
];

// ── sub-components ─────────────────────────────────────────────

function JornadaHeader({ user }) {
  const xpAtual = user.points ?? 0;
  const nivel   = user.nivel  ?? 1;
  const xpMax   = nivel * 500;
  const pct     = Math.min(100, Math.round((xpAtual % xpMax) / xpMax * 100));
  const frase   = FRASES[Math.floor(Date.now() / 86400000) % FRASES.length];

  return (
    <div className={styles.headerCard}>
      <div className={styles.headerBg} aria-hidden />
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <div className={styles.nivelBadge}>
            <span className={styles.nivelLabel}>NÍVEL</span>
            <span className={styles.nivelNum}>{nivel}</span>
          </div>
          <div>
            <h1 className={styles.headerTitle}>Sua Jornada</h1>
            <p className={styles.headerFrase}>{frase}</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.streakBadge}>
            <span className={styles.streakFire}>🔥</span>
            <div>
              <div className={styles.streakNum}>{user.streak ?? 0}</div>
              <div className={styles.streakLabel}>dias</div>
            </div>
          </div>
          <div className={styles.xpBlock}>
            <div className={styles.xpRow}>
              <span className={styles.xpLabel}>XP</span>
              <span className={styles.xpVal}>{xpAtual.toLocaleString('pt-BR')}</span>
            </div>
            <div className={styles.xpTrack}>
              <div className={styles.xpBar} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.xpSub}>{pct}% para o próximo nível</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissoesSection({ missoes, concluidas, onConcluir }) {
  const [aba, setAba] = useState('equipe');
  const dados = missoes?.[aba];
  const itens = dados?.itens ?? [];
  const totalConcluidas = itens.filter(m => concluidas[`${aba}_${m.id}`]).length;
  const progresso = itens.length ? Math.round(totalConcluidas / itens.length * 100) : 0;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⚡</span>
          Missões Diárias
        </h2>
        <div className={styles.abaToggle}>
          {['equipe', 'individual'].map(a => (
            <button
              key={a}
              className={`${styles.abaBtn} ${aba === a ? styles.abaBtnActive : ''}`}
              onClick={() => setAba(a)}
            >
              {a === 'equipe' ? 'Equipe' : 'Individual'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.missaoProgress}>
        <div className={styles.missaoProgressRow}>
          <span className={styles.missaoProgressLabel}>
            {totalConcluidas} / {itens.length} concluídas
          </span>
          <span className={styles.missaoProgressPct}>{progresso}%</span>
        </div>
        <div className={styles.missaoProgressTrack}>
          <div className={styles.missaoProgressBar} style={{ width: `${progresso}%` }} />
        </div>
        {dados?.tempo && (
          <div className={styles.missaoTempo}>⏱ Tempo restante: {dados.tempo}</div>
        )}
      </div>

      {missoes === null ? (
        <div className={styles.loading}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <div className={styles.missoesList}>
          {itens.map(m => {
            const key  = `${aba}_${m.id}`;
            const done = !!concluidas[key];
            return (
              <MissaoCard
                key={m.id}
                missao={m}
                done={done}
                onConcluir={() => onConcluir(aba, m)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function MissaoCard({ missao, done, onConcluir }) {
  const [anim, setAnim] = useState(false);

  const handleClick = () => {
    if (done) return;
    setAnim(true);
    setTimeout(() => { setAnim(false); onConcluir(); }, 350);
  };

  return (
    <div
      className={`${styles.missaoCard} ${done ? styles.missaoCardDone : ''} ${anim ? styles.missaoCardAnim : ''}`}
    >
      <div className={`${styles.missaoCheck} ${done ? styles.missaoCheckDone : ''}`}>
        {done ? '✓' : <span className={styles.missaoId}>{missao.id}</span>}
      </div>
      <div className={styles.missaoInfo}>
        <span className={`${styles.missaoTitulo} ${done ? styles.missaoTituloStrike : ''}`}>
          {missao.titulo}
        </span>
        {missao.descricao && (
          <span className={styles.missaoDesc}>{missao.descricao}</span>
        )}
        <span className={styles.missaoXp}>
          <img src="/512x512bb%204.svg" alt="" width={12} height={12} />
          {missao.pontos}
        </span>
      </div>
      {!done ? (
        <button className={styles.missaoBtn} onClick={handleClick}>
          Concluir
        </button>
      ) : (
        <div className={styles.missaoDoneBadge}>✓ Feito</div>
      )}
    </div>
  );
}

function ConquistasSection({ conquistas }) {
  const detalhes = conquistas?.detalhes ?? [];
  const medalhas = conquistas?.medalhas ?? [];

  const allBadges = [
    ...detalhes.map(d => ({ ...d, unlocked: true })),
    ...Array(Math.max(0, 6 - detalhes.length)).fill(null).map((_, i) => ({
      titulo:   `Conquista ${i + detalhes.length + 1}`,
      descricao: 'Continue explorando para desbloquear',
      unlocked: false,
    })),
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🏅</span>
          Conquistas
        </h2>
        {conquistas && (
          <span className={styles.sectionCount}>
            {detalhes.length} desbloqueadas
          </span>
        )}
      </div>

      {conquistas === null ? (
        <div className={styles.loading}>
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={styles.skeletonBadge} />)}
        </div>
      ) : (
        <>
          <div className={styles.badgesGrid}>
            {allBadges.map((b, i) => (
              <BadgeCard key={i} badge={b} />
            ))}
          </div>

          {medalhas.length > 0 && (
            <div className={styles.progressList}>
              <h3 className={styles.progressTitle}>Progresso</h3>
              {medalhas.map((c, i) => (
                <div key={i} className={styles.progressItem}>
                  <div className={styles.progressItemLeft}>
                    <span className={styles.progressStar}>★</span>
                    <div>
                      <div className={styles.progressNome}>{c.nome}</div>
                      <div className={styles.progressSub}>{c.sub}</div>
                    </div>
                  </div>
                  <div className={styles.progressItemRight}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressBar} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className={styles.progressPct}>{c.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function BadgeCard({ badge }) {
  const icons = ['🎯', '🌟', '💎', '🔥', '⚡', '🌙', '🎖', '🦋', '🌊', '🎨', '🚀', '💫'];
  const icon  = icons[Math.abs(badge.titulo?.charCodeAt(0) ?? 0) % icons.length];

  return (
    <div className={`${styles.badgeCard} ${badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}>
      <div className={styles.badgeIconWrap}>
        <span className={styles.badgeIcon}>{badge.unlocked ? icon : '🔒'}</span>
        {badge.unlocked && <div className={styles.badgeGlow} />}
      </div>
      <div className={styles.badgeName}>{badge.titulo}</div>
      <div className={styles.badgeDesc}>{badge.descricao}</div>
      {badge.unlocked && <div className={styles.badgeUnlockedDot} />}
    </div>
  );
}

function RankingSection({ rankingData, abaAtual, setAbaAtual, loading, rankingAtivo, onToggle }) {
  const podio = rankingData?.podio ?? [];
  const lista = rankingData?.lista ?? [];
  const voce  = rankingData?.voce  ?? null;

  if (!rankingAtivo) {
    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🏆</span>
            Ranking
          </h2>
        </div>
        <div className={styles.rankingOff}>
          <div className={styles.rankingOffIcon}>👁️‍🗨️</div>
          <p className={styles.rankingOffText}>Seu ranking está desativado</p>
          <p className={styles.rankingOffSub}>Ative para ver e participar do ranking</p>
          <button className={styles.rankingToggleBtn} onClick={onToggle}>Ativar Ranking</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🏆</span>
          Ranking
        </h2>
        <button className={styles.rankingDesativarBtn} onClick={onToggle}>
          Desativar
        </button>
      </div>

      <div className={styles.rankingAbas}>
        {ABAS_RANKING.map(a => (
          <button
            key={a.id}
            className={`${styles.rankingAbaBtn} ${abaAtual === a.id ? styles.rankingAbaBtnActive : ''}`}
            onClick={() => setAbaAtual(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <>
          {podio.length > 0 && (
            <div className={styles.podio}>
              {[podio[1], podio[0], podio[2]].filter(Boolean).map((item, visualIdx) => {
                const realIdx = visualIdx === 0 ? 1 : visualIdx === 1 ? 0 : 2;
                const m = MEDAL_COLORS[realIdx] || MEDAL_COLORS[0];
                return (
                  <div
                    key={item.nome}
                    className={`${styles.podioItem} ${realIdx === 0 ? styles.podioFirst : ''}`}
                  >
                    <div className={styles.podioAvatarWrap} style={{ '--medal-glow': m.glow }}>
                      <div className={styles.podioAvatar}>
                        {item.emoji || item.letra || item.nome?.charAt(0)}
                      </div>
                      <div className={styles.podioMedalha} style={{ color: m.color }}>{m.emoji}</div>
                    </div>
                    <div className={styles.podioNome}>{item.nome}</div>
                    <div className={styles.podioValor}>{item.valor}</div>
                    {realIdx === 0 && <div className={styles.podioCrown}>👑</div>}
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.rankingList}>
            {lista.map(item => (
              <div
                key={item.pos}
                className={`${styles.rankingRow} ${item.isVoce ? styles.rankingRowVoce : ''}`}
              >
                <span className={styles.rankingPos}>{item.pos}</span>
                <div className={styles.rankingAvatar}>{item.nome?.charAt(0)}</div>
                <span className={styles.rankingNome}>{item.nome}</span>
                <span className={styles.rankingValor}>{item.valor}</span>
              </div>
            ))}
            {voce && (
              <>
                <div className={styles.rankingDivider} />
                <div className={`${styles.rankingRow} ${styles.rankingRowVoce}`}>
                  <span className={styles.rankingPos}>{voce.pos}</span>
                  <div className={styles.rankingAvatar}>{voce.nome?.charAt(0)}</div>
                  <span className={styles.rankingNome}>Você</span>
                  <span className={styles.rankingValor}>{voce.valor}</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

// ── main component ──────────────────────────────────────────────
const RANKING_ATIVO_KEY = 'jornada_ranking_ativo';

export default function JornadaPage() {
  const { user, updatePoints } = useUser();
  const [missoes,        setMissoes]        = useState(null);
  const [concluidas,     setConcluidas]     = useState(loadConcluidas);
  const [conquistas,     setConquistas]     = useState(null);
  const [rankingData,    setRankingData]    = useState({});
  const [abaRanking,     setAbaRanking]     = useState('nivel');
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingAtivo,   setRankingAtivo]   = useState(
    () => localStorage.getItem(RANKING_ATIVO_KEY) !== 'false'
  );
  const [popup, setPopup] = useState(null);

  useEffect(() => { fetchMissoes().then(setMissoes).catch(console.error); }, []);
  useEffect(() => { fetchConquistas().then(setConquistas).catch(console.error); }, []);

  useEffect(() => {
    if (!rankingAtivo) return;
    setRankingLoading(true);
    import('../Ranking/services/rankingService')
      .then(m => m.getRanking(abaRanking, 'usr_logado'))
      .then(setRankingData)
      .catch(console.error)
      .finally(() => setRankingLoading(false));
  }, [abaRanking, rankingAtivo]);

  const handleConcluir = (aba, missao) => {
    const key = `${aba}_${missao.id}`;
    if (concluidas[key]) return;
    const pts  = parsePontos(missao.pontos);
    const novas = { ...concluidas, [key]: true };
    setConcluidas(novas);
    saveConcluidas(novas);
    updatePoints(pts);
    addMissionHistory(missao, pts);
    const dados = missoes?.[aba];
    const itens = dados?.itens ?? [];
    if (itens.length && itens.every(m => novas[`${aba}_${m.id}`])) {
      setPopup({ tipo: aba });
    }
  };

  const toggleRanking = () => {
    setRankingAtivo(prev => {
      const next = !prev;
      localStorage.setItem(RANKING_ATIVO_KEY, String(next));
      return next;
    });
  };

  return (
    <>
      <NavBar />

      {popup && (
        <div className={styles.popupOverlay} onClick={() => setPopup(null)}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <div className={styles.popupEmoji}>🏆</div>
            <h2 className={styles.popupTitulo}>Parabéns!</h2>
            <p className={styles.popupTexto}>
              Você concluiu todas as missões {popup.tipo === 'equipe' ? 'da equipe' : 'individuais'}!
            </p>
            <p className={styles.popupSub}>Seus CarePoints foram adicionados. Continue assim!</p>
            <button className={styles.popupBtn} onClick={() => setPopup(null)}>Continuar</button>
          </div>
        </div>
      )}

      <div className={styles.page}>
        <div className={styles.container}>
          <JornadaHeader user={user} />

          <div className={styles.grid}>
            <div className={styles.colMain}>
              <MissoesSection
                missoes={missoes}
                concluidas={concluidas}
                onConcluir={handleConcluir}
              />
              <ConquistasSection conquistas={conquistas} />
            </div>
            <div className={styles.colSide}>
              <RankingSection
                rankingData={rankingData}
                abaAtual={abaRanking}
                setAbaAtual={setAbaRanking}
                loading={rankingLoading}
                rankingAtivo={rankingAtivo}
                onToggle={toggleRanking}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
