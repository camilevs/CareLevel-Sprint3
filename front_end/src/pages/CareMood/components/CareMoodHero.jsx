import { useUser } from '../../../Components/UserContext/UserContext';
import { getHistory, getTodayString } from '../services/moodStorage';

function formatLastParticipation(history) {
  if (!history.length) return 'Nenhuma ainda';

  const last = history[history.length - 1];
  const today = getTodayString();

  const todayDate = new Date(`${today}T12:00:00`);
  const yesterday = new Date(todayDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (last.date === today) return 'Hoje';
  if (last.date === yesterdayStr) return 'Ontem';

  const d = new Date(`${last.date}T12:00:00`);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function CareMoodHero({ jaRespondeuHoje, onIniciarMissao }) {
  const { user } = useUser();
  const history = getHistory();
  const ultimaParticipacao = formatLastParticipation(history);

  return (
    <section
      className="relative overflow-hidden flex border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-6 md:px-9 md:py-8"
      style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 70%)' }}
    >
      <div
        className="absolute top-[-90px] right-[-90px] w-[260px] h-[260px] bg-[var(--accent)] opacity-[0.18] pointer-events-none"
        style={{ borderRadius: '60% 40% 50% 70% / 50% 60% 40% 60%' }}
        aria-hidden="true"
      />

      <div className="relative z-[1] flex flex-col gap-6 w-full min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-8">

        {/* Text block */}
        <div className="flex flex-col gap-3 max-w-[560px]">
          <span className="inline-flex self-start bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent-hover)] font-extrabold text-[12px] tracking-[1px] px-3 py-1 rounded-full">
            CareMood©
          </span>
          <h1 className="text-[22px] sm:text-[28px] min-[1100px]:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.3px] m-0 leading-[1.25]">
            {jaRespondeuHoje
              ? 'Jornada de hoje concluída! ✅'
              : 'Pronto para sua Missão do Equilíbrio de hoje?'}
          </h1>
          <p className="text-sm sm:text-base font-medium text-[var(--text-secondary)] leading-[1.6] m-0">
            {jaRespondeuHoje
              ? 'Você já registrou seu humor hoje. Volte amanhã para uma nova missão e acumular mais CarePoints.'
              : 'Percorra 10 locais temáticos, descubra seu estado emocional e ganhe +500 CarePoints ao concluir!'}
          </p>

          {jaRespondeuHoje ? (
            <div className="mt-2 inline-flex items-center gap-[10px] bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.4)] text-[var(--green)] font-bold text-sm px-5 py-3 rounded-[var(--radius-md)]">
              <span className="text-[18px]">🏆</span>
              Missão concluída — volte amanhã para uma nova jornada
            </div>
          ) : (
            <button
              className="mt-2 self-start border-0 rounded-[var(--radius-md)] px-8 py-4 sm:px-10 sm:py-[18px] font-extrabold text-base sm:text-lg tracking-[1px] text-white cursor-pointer transition-[transform_0.15s,box-shadow_0.2s] hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                boxShadow: '0 8px 28px var(--accent-glow)',
              }}
              onClick={onIniciarMissao}
              type="button"
            >
              ⚔️ INICIAR MISSÃO DO EQUILÍBRIO
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full min-[900px]:grid-cols-1 min-[900px]:w-auto min-[900px]:min-w-[190px]">
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 px-3.5">
            <span className="text-[24px] leading-none shrink-0">🔥</span>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-[20px] font-extrabold text-[var(--text-primary)] leading-[1.15] whitespace-nowrap">
                {user?.streak ?? 0}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
                dias de streak
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 px-3.5">
            <span className="text-[24px] leading-none shrink-0">🪙</span>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-[20px] font-extrabold text-[var(--text-primary)] leading-[1.15] whitespace-nowrap">
                {(user?.points ?? 0).toLocaleString('pt-BR')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
                CarePoints
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 px-3.5">
            <span className="text-[24px] leading-none shrink-0">📅</span>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-[20px] font-extrabold text-[var(--text-primary)] leading-[1.15] whitespace-nowrap">
                {ultimaParticipacao}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
                última participação
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
