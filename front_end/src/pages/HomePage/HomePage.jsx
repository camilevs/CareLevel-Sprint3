import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../Components/UserContext/UserContext';
import { fetchMissoes } from '../../services/api';
import HeroBanner from '../../Components/HeroBanner/HeroBanner';
import ServicesGrid from '../../Components/ServicesGrid/ServicesGrid';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import StreakTracker from '../../Components/StreakTracker/StreakTracker';
import RecompensasPreview from '../../Components/RecompensasPreview/RecompensasPreview';
import OnboardingModal, { shouldShowOnboarding } from '../../Components/OnboardingModal/OnboardingModal';

const CONCLUIDAS_KEY = 'caremissoes_concluidas';
const MAX_HOME_MISSIONS = 3;

function loadConcluidas() {
  try {
    return JSON.parse(localStorage.getItem(CONCLUIDAS_KEY) || '{}');
  } catch {
    return {};
  }
}

const missionItemCls = "bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[18px] p-3.5 py-3 flex flex-col items-center text-center gap-2.5 cursor-pointer transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[0_0_0_2px_var(--accent-subtle)] max-[900px]:justify-start";

export default function HomePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(() => shouldShowOnboarding(authUser?.id));
  const [missoes, setMissoes] = useState(null);
  const [concluidas] = useState(loadConcluidas);
  const [tabMissoes, setTabMissoes] = useState('equipe');

  useEffect(() => {
    fetchMissoes().then(setMissoes).catch(() => setMissoes(null));
  }, []);

  const missionHighlights = useMemo(() => {
    if (!missoes) return [];
    const itens = missoes?.[tabMissoes]?.itens ?? [];
    return itens
      .filter((item) => !concluidas[`${tabMissoes}_${item.id}`])
      .slice(0, MAX_HOME_MISSIONS);
  }, [missoes, concluidas, tabMissoes]);

  const tabCounts = useMemo(() => {
    if (!missoes) return { equipe: null, individual: null };
    const count = (tipo) => {
      const itens = missoes?.[tipo]?.itens ?? [];
      const done = itens.filter((m) => concluidas[`${tipo}_${m.id}`]).length;
      return { done, total: itens.length };
    };
    return { equipe: count('equipe'), individual: count('individual') };
  }, [missoes, concluidas]);

  const handleNavigate = (serviceId) => {
    const routes = {
      missoes: '/missoes',
      caremood: '/caremood',
      ranking: '/ranking',
      recompensas: '/recompensas',
      conquistas: '/conquistas',
      pontos: '/carepoints',
    };
    if (routes[serviceId]) navigate(routes[serviceId]);
  };

  const xpAtual = user?.points ?? 0;
  const nivel = user?.nivel ?? 1;
  const xpMax = nivel * 500;
  const pct = Math.min(100, Math.round(((xpAtual % xpMax) / xpMax) * 100));

  return (
    <main className="flex-1 flex flex-col">
      <NavBar />
      <HeroBanner />

      <section
        className="w-[min(1100px,calc(100%-48px))] mx-auto mt-5 mb-2.5 grid grid-cols-[1.3fr_1fr] grid-rows-[auto_auto] gap-4 items-start max-[900px]:grid-cols-1 max-[900px]:grid-rows-[auto] max-[900px]:gap-3 max-[900px]:w-[min(1100px,calc(100%-20px))]"
        aria-label="Missões"
      >
        <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[22px] p-[18px] shadow-[var(--shadow-md)] [grid-row:1/3] self-stretch flex flex-col max-[900px]:[grid-row:auto] max-[900px]:self-start">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <h2 className="m-0 font-[var(--font-display)] text-[1.02rem] font-extrabold text-[var(--text-primary)]">Missões</h2>
            <button
              type="button"
              className="border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full py-1.5 px-3 text-[0.8rem] font-bold cursor-pointer transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-subtle)]"
              onClick={() => navigate('/missoes', { state: { aba: tabMissoes } })}
            >
              Ver todas
            </button>
          </div>

          <div className="flex gap-1.5 mb-3.5">
            {['equipe', 'individual'].map((tab) => {
              const label = tab === 'equipe' ? 'Equipe' : 'Individual';
              const counts = tabCounts[tab];
              const isActive = tabMissoes === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTabMissoes(tab)}
                  className={[
                    'flex-1 border rounded-full px-2.5 py-1.5 text-[0.78rem] font-bold cursor-pointer transition-all',
                    isActive
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                  ].join(' ')}
                >
                  {label}
                  {counts && (
                    <span className="inline-flex items-center text-[0.62rem] font-bold opacity-80 bg-black/15 rounded-full px-1.5 ml-1 leading-[1.5]">
                      {counts.done}/{counts.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[1fr] gap-3 flex-1 items-stretch max-[900px]:grid-cols-1 max-[900px]:grid-rows-[auto] max-[900px]:flex-none">
            {missionHighlights.length === 0 ? (
              <p className="my-1 text-[0.86rem] text-[var(--text-secondary)]">Nenhuma missão pendente no momento.</p>
            ) : (
              missionHighlights.map((mission) => (
                <article
                  key={`${tabMissoes}_${mission.id}`}
                  className={missionItemCls}
                  onClick={() => navigate('/missoes', { state: { aba: tabMissoes } })}
                >
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="flex justify-center">
                      <span className="text-[0.72rem] font-bold text-[var(--accent)] tracking-[0.03em] uppercase">
                        {tabMissoes === 'equipe' ? 'Equipe' : 'Individual'}
                      </span>
                    </div>
                    <h3 className="m-0 text-[0.9rem] font-bold text-[var(--text-primary)] leading-[1.2]">{mission.titulo}</h3>
                    <div className="inline-flex items-center gap-[5px]">
                      <img src="/512x512bb%204.svg" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span className="text-[0.82rem] text-[var(--text-secondary)] font-semibold">+{mission.pontos}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <StreakTracker streak={user?.streak ?? 0} />

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[22px] p-4 px-5 shadow-[var(--shadow-md)] flex items-center gap-4">
          <div className="flex-shrink-0 flex flex-col items-center bg-[var(--accent-subtle)] border-[1.5px] border-[var(--accent)] rounded-[12px] py-2 px-4 min-w-[3.75rem]">
            <span className="text-[0.58rem] font-bold text-[var(--accent)] tracking-[0.1em] uppercase">NÍV</span>
            <span className="font-[var(--font-display)] text-2xl font-black text-[var(--text-primary)] leading-none">{nivel}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[0.72rem] font-bold text-[var(--text-secondary)] uppercase tracking-[0.04em]">Experiência</span>
              <span className="text-[0.72rem] font-bold text-[var(--color-highlight)]">{pct}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-elevated)] rounded-[3px] overflow-hidden">
              <div
                className="h-full bg-[var(--color-highlight)] rounded-[3px] transition-[width] duration-[600ms] ease-in-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[0.66rem] text-[var(--text-muted)]">
              {xpAtual.toLocaleString('pt-BR')} / {xpMax.toLocaleString('pt-BR')} XP
            </span>
          </div>
        </div>
      </section>

      <RecompensasPreview />
      <ServicesGrid onNavigate={handleNavigate} />
      <Footer />
      {showOnboarding && (
        <OnboardingModal onDone={() => setShowOnboarding(false)} />
      )}
    </main>
  );
}
