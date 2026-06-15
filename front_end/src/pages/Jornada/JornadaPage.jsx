import { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { fetchMissoes, fetchConquistas, fetchMissaoProgresso, concluirMissaoItem } from '../../services/api';
import { useUser } from '../../Components/UserContext/UserContext';

const HISTORY_KEY = 'caremissions_history';

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
  0: { color: '#F59E0B', glow: 'rgba(245,158,11,0.4)', emoji: '🥇' },
  1: { color: '#94A3B8', glow: 'rgba(148,163,184,0.3)', emoji: '🥈' },
  2: { color: '#CD7F32', glow: 'rgba(205,127,50,0.3)',  emoji: '🥉' },
};

const ABAS_RANKING = [
  { id: 'nivel',  label: 'Nível' },
  { id: 'pontos', label: 'Pontos' },
  { id: 'streak', label: 'Streak' },
  { id: 'equipe', label: 'Equipe' },
];

const sectionCls = 'bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6';
const sectionHeaderCls = 'flex items-center justify-between mb-5 flex-wrap gap-[10px]';
const sectionTitleCls = 'flex items-center gap-2 font-[var(--font-display)] text-[1.1rem] font-bold text-[var(--text-primary)] m-0';

function Skeleton({ cls }) {
  return <div className={`rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] animate-[shimmer_1.5s_infinite] ${cls}`} />;
}

function JornadaHeader({ user }) {
  const xpAtual = user.points ?? 0;
  const nivel   = user.nivel  ?? 1;
  const xpMax   = nivel * 500;
  const pct     = Math.min(100, Math.round((xpAtual % xpMax) / xpMax * 100));
  const frase   = FRASES[Math.floor(Date.now() / 86400000) % FRASES.length];

  return (
    <div className="relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] p-8 overflow-hidden max-[600px]:p-5">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(103,185,159,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(103,185,159,0.08) 0%, transparent 50%)' }}
      />
      <div className="relative flex items-center justify-between gap-6 flex-wrap max-[600px]:flex-col max-[600px]:items-start">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center bg-[var(--accent-subtle)] border-[1.5px] border-[var(--accent)] rounded-[14px] py-3 px-4 min-w-[70px] shadow-[0_0_20px_var(--accent-glow)]">
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-[0.1em]">NÍVEL</span>
            <span className="font-[var(--font-display)] text-[28px] font-extrabold text-[var(--text-primary)] leading-none">{nivel}</span>
          </div>
          <div>
            <h1 className="font-[var(--font-display)] text-[clamp(1.4rem,3vw,2rem)] font-extrabold text-[var(--text-primary)] m-0">Sua Jornada</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{frase}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5 flex-wrap max-[600px]:w-full">
          <div className="flex items-center gap-[10px] bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] rounded-[14px] py-3 px-4">
            <span className="text-[22px]">🔥</span>
            <div>
              <div className="font-[var(--font-display)] text-[22px] font-extrabold text-[#F97316] leading-none">{user.streak ?? 0}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">dias</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px] max-[600px]:flex-1 max-[600px]:min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-[var(--accent)] tracking-[0.08em]">XP</span>
              <span className="font-[var(--font-display)] text-[15px] font-bold text-[var(--text-primary)]">{xpAtual.toLocaleString('pt-BR')}</span>
            </div>
            <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[linear-gradient(90deg,var(--accent),var(--accent-hover))] rounded-full transition-[width] duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_0_8px_var(--accent-glow)]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">{pct}% para o próximo nível</div>
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
    <section className={sectionCls}>
      <div className={sectionHeaderCls}>
        <h2 className={sectionTitleCls}>
          <span>⚡</span> Missões Diárias
        </h2>
        <div className="flex gap-1 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] p-[3px]">
          {['equipe', 'individual'].map(a => (
            <button
              key={a}
              className={`py-[6px] px-[14px] border-0 rounded-[8px] text-[13px] font-semibold cursor-pointer font-[var(--font-body)] transition-all duration-200 ${aba === a ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)]'}`}
              onClick={() => setAba(a)}
            >
              {a === 'equipe' ? 'Equipe' : 'Individual'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-[13px] text-[var(--text-secondary)]">{totalConcluidas} / {itens.length} concluídas</span>
          <span className="text-[13px] font-bold text-[var(--accent)]">{progresso}%</span>
        </div>
        <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-[linear-gradient(90deg,var(--accent),var(--accent-hover))] rounded-full transition-[width] duration-[600ms] ease-out shadow-[0_0_6px_var(--accent-glow)]"
            style={{ width: `${progresso}%` }}
          />
        </div>
        {dados?.tempo && (
          <div className="text-xs text-[var(--text-muted)]">⏱ Tempo restante: {dados.tempo}</div>
        )}
      </div>

      {missoes === null ? (
        <div className="flex flex-col gap-[10px]">
          {[1, 2, 3].map(i => <Skeleton key={i} cls="h-16" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {itens.map(m => {
            const key  = `${aba}_${m.id}`;
            const done = !!concluidas[key];
            return <MissaoCard key={m.id} missao={m} done={done} onConcluir={() => onConcluir(aba, m)} />;
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
      className={[
        'flex items-center gap-[14px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] py-[14px] px-4 transition-all duration-200 max-[600px]:flex-wrap',
        done
          ? 'opacity-60 cursor-default'
          : 'cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)] hover:translate-x-1',
        anim ? 'animate-[missionComplete_0.35s_ease]' : '',
      ].join(' ')}
    >
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] flex-shrink-0 transition-all duration-200 ${done ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
        {done ? '✓' : <span className="text-[11px] font-bold">{missao.id}</span>}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <span className={`text-sm font-semibold text-[var(--text-primary)] ${done ? 'line-through' : ''}`}>{missao.titulo}</span>
        {missao.descricao && <span className="text-xs text-[var(--text-secondary)]">{missao.descricao}</span>}
        <span className="text-xs text-[var(--accent)] font-semibold flex items-center gap-1 mt-0.5">
          <img src="/512x512bb%204.svg" alt="" width={12} height={12} />
          +{missao.pontos}
        </span>
      </div>
      {!done ? (
        <button
          className="bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)] rounded-[var(--radius-sm)] py-[7px] px-[14px] text-xs font-bold cursor-pointer flex-shrink-0 font-[var(--font-body)] transition-[background,transform] duration-200 hover:bg-[var(--accent)] hover:text-white hover:scale-[1.03]"
          onClick={handleClick}
        >
          Concluir
        </button>
      ) : (
        <div className="text-xs text-[var(--green)] font-bold flex-shrink-0 whitespace-nowrap">✓ Feito</div>
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
      titulo:    `Conquista ${i + detalhes.length + 1}`,
      descricao: 'Continue explorando para desbloquear',
      unlocked:  false,
    })),
  ];

  return (
    <section className={sectionCls}>
      <div className={sectionHeaderCls}>
        <h2 className={sectionTitleCls}>
          <span>🏅</span> Conquistas
        </h2>
        {conquistas && (
          <span className="text-xs text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] py-1 px-[10px] rounded-full">
            {detalhes.length} desbloqueadas
          </span>
        )}
      </div>

      {conquistas === null ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} cls="h-[120px]" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] max-[900px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[600px]:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 mb-6">
            {allBadges.map((b, i) => <BadgeCard key={i} badge={b} />)}
          </div>

          {medalhas.length > 0 && (
            <div className="flex flex-col gap-[10px]">
              <h3 className="text-[13px] font-bold text-[var(--text-secondary)] tracking-[0.05em] mb-3 uppercase">
                Progresso
              </h3>
              {medalhas.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-[10px] flex-1 min-w-0">
                    <span className="text-base flex-shrink-0">★</span>
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--text-primary)]">{c.nome}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{c.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px] flex-shrink-0">
                    <div className="w-20 h-[5px] bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[linear-gradient(90deg,var(--accent),var(--accent-hover))] rounded-full transition-[width] duration-[600ms] ease-out"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[var(--accent)] w-8 text-right">{c.pct}%</span>
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
    <div className={[
      'bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] py-4 px-3 flex flex-col items-center gap-2 text-center transition-all duration-[250ms] relative cursor-default',
      badge.unlocked
        ? 'border-[rgba(103,185,159,0.3)] bg-[linear-gradient(135deg,var(--bg-tertiary),rgba(103,185,159,0.06))] hover:border-[var(--accent)] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(103,185,159,0.2)]'
        : 'opacity-45 [filter:grayscale(0.6)]',
    ].join(' ')}>
      <div className="relative">
        <span className="text-[2rem] block">{badge.unlocked ? icon : '🔒'}</span>
        {badge.unlocked && (
          <div className="absolute inset-[-8px] bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)] rounded-full pointer-events-none opacity-60 animate-[badgePulse_2.5s_ease-in-out_infinite]" />
        )}
      </div>
      <div className="text-xs font-bold text-[var(--text-primary)] leading-[1.3]">{badge.titulo}</div>
      <div className="text-[11px] text-[var(--text-secondary)] leading-[1.4]">{badge.descricao}</div>
      {badge.unlocked && (
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] absolute top-[10px] right-[10px] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
      )}
    </div>
  );
}

function RankingSection({ rankingData, abaAtual, setAbaAtual, loading, rankingAtivo, onToggle }) {
  const podio = rankingData?.podio ?? [];
  const lista = rankingData?.lista ?? [];
  const voce  = rankingData?.voce  ?? null;

  if (!rankingAtivo) {
    return (
      <section className={sectionCls}>
        <div className={sectionHeaderCls}>
          <h2 className={sectionTitleCls}><span>🏆</span> Ranking</h2>
        </div>
        <div className="text-center py-8 px-4">
          <div className="text-[2.5rem] mb-3 opacity-45">👁️‍🗨️</div>
          <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-1.5">Seu ranking está desativado</p>
          <p className="text-[13px] text-[var(--text-secondary)] mb-5">Ative para ver e participar do ranking</p>
          <button
            className="bg-[var(--accent)] text-white border-0 rounded-[var(--radius-sm)] py-[10px] px-6 text-sm font-bold cursor-pointer font-[var(--font-body)] transition-[background,transform] duration-200 shadow-[0_4px_16px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:-translate-y-px"
            onClick={onToggle}
          >
            Ativar Ranking
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls}>
      <div className={sectionHeaderCls}>
        <h2 className={sectionTitleCls}><span>🏆</span> Ranking</h2>
        <button
          className="bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded-[var(--radius-sm)] py-[5px] px-3 text-xs cursor-pointer font-[var(--font-body)] transition-all duration-200 hover:border-[var(--red)] hover:text-[#fca5a5]"
          onClick={onToggle}
        >
          Desativar
        </button>
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {ABAS_RANKING.map(a => (
          <button
            key={a.id}
            className={`py-[6px] px-[14px] border rounded-full text-xs font-semibold cursor-pointer font-[var(--font-body)] transition-all duration-200 ${abaAtual === a.id ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] bg-transparent text-[var(--text-secondary)]'}`}
            onClick={() => setAbaAtual(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-[10px]">
          {[1, 2, 3].map(i => <Skeleton key={i} cls="h-16" />)}
        </div>
      ) : (
        <>
          {podio.length > 0 && (
            <div className="flex items-end justify-center gap-3 max-[600px]:gap-2 mb-6 py-4 px-2 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)]">
              {[podio[1], podio[0], podio[2]].filter(Boolean).map((item, visualIdx) => {
                const realIdx = visualIdx === 0 ? 1 : visualIdx === 1 ? 0 : 2;
                const m = MEDAL_COLORS[realIdx] || MEDAL_COLORS[0];
                const isFirst = realIdx === 0;
                return (
                  <div key={item.nome} className="flex flex-col items-center gap-1.5 relative transition-transform duration-200 hover:-translate-y-1">
                    <div className="relative">
                      {isFirst && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-base animate-[crownFloat_2s_ease-in-out_infinite]">👑</div>
                      )}
                      <div
                        className={`${isFirst ? 'w-[52px] h-[52px] text-xl' : 'w-11 h-11 text-lg'} rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-primary)]`}
                        style={{ boxShadow: `0 0 16px ${m.glow}` }}
                      >
                        {item.emoji || item.letra || item.nome?.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 text-base">{m.emoji}</div>
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)] text-center max-w-[72px] overflow-hidden text-ellipsis whitespace-nowrap">{item.nome}</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{item.valor}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {lista.map(item => (
              <div
                key={item.pos}
                className={`flex items-center gap-[10px] py-[10px] px-3 rounded-[var(--radius-sm)] transition-[background] duration-200 ${item.isVoce ? 'bg-[var(--accent-subtle)] border border-[var(--accent)]' : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)]'}`}
              >
                <span className="text-[13px] font-bold text-[var(--text-muted)] w-6 text-center flex-shrink-0">{item.pos}</span>
                <div className="w-[30px] h-[30px] rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] flex-shrink-0">
                  {item.nome?.charAt(0)}
                </div>
                <span className="flex-1 text-[13px] font-semibold text-[var(--text-primary)]">{item.nome}</span>
                <span className="text-xs font-bold text-[var(--accent)]">{item.valor}</span>
              </div>
            ))}
            {voce && (
              <>
                <div className="border-t border-dashed border-[var(--border)] my-1" />
                <div className="flex items-center gap-[10px] py-[10px] px-3 rounded-[var(--radius-sm)] bg-[var(--accent-subtle)] border border-[var(--accent)]">
                  <span className="text-[13px] font-bold text-[var(--text-muted)] w-6 text-center flex-shrink-0">{voce.pos}</span>
                  <div className="w-[30px] h-[30px] rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] flex-shrink-0">
                    {voce.nome?.charAt(0)}
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-[var(--text-primary)]">Você</span>
                  <span className="text-xs font-bold text-[var(--accent)]">{voce.valor}</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

const RANKING_ATIVO_KEY = 'jornada_ranking_ativo';

export default function JornadaPage() {
  const { user, updatePoints } = useUser();
  const [missoes,        setMissoes]        = useState(null);
  const [concluidas,     setConcluidas]     = useState({});
  const [conquistas,     setConquistas]     = useState(null);
  const [rankingData,    setRankingData]    = useState({});
  const [abaRanking,     setAbaRanking]     = useState('nivel');
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingAtivo,   setRankingAtivo]   = useState(
    () => localStorage.getItem(RANKING_ATIVO_KEY) !== 'false'
  );
  const [popup, setPopup] = useState(null);

  useEffect(() => { fetchMissoes().then(setMissoes).catch(console.error); }, []);
  useEffect(() => { fetchMissaoProgresso().then(setConcluidas).catch(console.error); }, []);
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

  const handleConcluir = async (aba, missao) => {
    const key = `${aba}_${missao.id}`;
    if (concluidas[key]) return;
    const pts   = parsePontos(missao.pontos);
    const novas = { ...concluidas, [key]: true };
    setConcluidas(novas);
    updatePoints(pts);
    addMissionHistory(missao, pts);
    const itens = missoes?.[aba]?.itens ?? [];
    if (itens.length && itens.every(m => novas[`${aba}_${m.id}`])) {
      setPopup({ tipo: aba });
    }
    try {
      await concluirMissaoItem(aba, missao.id);
    } catch (err) {
      console.error('[jornada] Erro ao salvar progresso:', err.message);
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
        <div
          className="fixed inset-0 bg-black/65 flex items-center justify-center z-[200] [backdrop-filter:blur(4px)] animate-[fadeIn_0.2s]"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] py-10 px-8 text-center max-w-[360px] w-[90%] shadow-[var(--shadow-lg),0_0_60px_var(--accent-glow)] animate-[popupIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[3rem] mb-3">🏆</div>
            <h2 className="font-[var(--font-display)] text-[1.5rem] font-extrabold text-[var(--text-primary)] mb-2">Parabéns!</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-1">
              Você concluiu todas as missões {popup.tipo === 'equipe' ? 'da equipe' : 'individuais'}!
            </p>
            <p className="text-[var(--text-muted)] text-[13px] mb-6">Seus CarePoints foram adicionados. Continue assim!</p>
            <button
              className="bg-[var(--accent)] text-white border-0 rounded-[var(--radius-sm)] py-3 px-8 text-sm font-bold cursor-pointer font-[var(--font-body)] transition-[background,transform] duration-200 shadow-[0_4px_16px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:-translate-y-px"
              onClick={() => setPopup(null)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] py-8 px-6 max-[600px]:py-4 max-[600px]:px-3">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          <JornadaHeader user={user} />

          <div className="grid grid-cols-[1fr_380px] max-[900px]:grid-cols-1 gap-6 items-start">
            <div className="flex flex-col gap-6">
              <MissoesSection missoes={missoes} concluidas={concluidas} onConcluir={handleConcluir} />
              <ConquistasSection conquistas={conquistas} />
            </div>
            <div className="sticky top-20 flex flex-col gap-6 max-[900px]:static">
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
