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

import styles from './HomePage.module.css';

const CONCLUIDAS_KEY = 'caremissoes_concluidas';
const MAX_HOME_MISSIONS = 3;

function loadConcluidas() {
  try {
    return JSON.parse(localStorage.getItem(CONCLUIDAS_KEY) || '{}');
  } catch {
    return {};
  }
}

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

  return (
    <main className={styles.main}>
      <NavBar />
      <HeroBanner />

      <section className={styles.homeTopRow}>
        <section className={styles.missionsPanel} aria-label="Missões">
          <div className={styles.missionsHeader}>
            <h2 className={styles.missionsTitle}>Missões</h2>
            <button
              type="button"
              className={styles.missionsAction}
              onClick={() => navigate('/missoes', { state: { aba: tabMissoes } })}
            >
              Ver todas
            </button>
          </div>

          <div className={styles.missionsTabs}>
            <button
              type="button"
              className={`${styles.missionTab} ${tabMissoes === 'equipe' ? styles.missionTabActive : ''}`}
              onClick={() => setTabMissoes('equipe')}
            >
              Equipe
              {tabCounts.equipe && (
                <span className={styles.tabCount}>
                  {tabCounts.equipe.done}/{tabCounts.equipe.total}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`${styles.missionTab} ${tabMissoes === 'individual' ? styles.missionTabActive : ''}`}
              onClick={() => setTabMissoes('individual')}
            >
              Individual
              {tabCounts.individual && (
                <span className={styles.tabCount}>
                  {tabCounts.individual.done}/{tabCounts.individual.total}
                </span>
              )}
            </button>
          </div>

          <div className={styles.missionsList}>
            {missionHighlights.length === 0 ? (
              <p className={styles.missionsEmpty}>Nenhuma missão pendente no momento.</p>
            ) : (
              missionHighlights.map((mission) => (
                <article
                  key={`${tabMissoes}_${mission.id}`}
                  className={styles.missionItem}
                  onClick={() => navigate('/missoes', { state: { aba: tabMissoes } })}
                >
                  <span className={styles.missionType}>
                    {tabMissoes === 'equipe' ? 'Equipe' : 'Individual'}
                  </span>
                  <h3 className={styles.missionName}>{mission.titulo}</h3>
                  <div className={styles.missionPointsRow}>
                    <img src="/512x512bb%204.svg" alt="" className={styles.pointsIcon} />
                    <span className={styles.missionPoints}>+{mission.pontos}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <StreakTracker className={styles.streakPanel} streak={user?.streak ?? 0} />

        {/* nível e XP — coluna direita, linha 2 */}
        {(() => {
          const xpAtual = user?.points ?? 0;
          const nivel   = user?.nivel  ?? 1;
          const xpMax   = nivel * 500;
          const pct     = Math.min(100, Math.round((xpAtual % xpMax) / xpMax * 100));
          return (
            <div className={styles.levelCard}>
              <div className={styles.nivelBadge}>
                <span className={styles.nivelLabel}>NÍV</span>
                <span className={styles.nivelNum}>{nivel}</span>
              </div>
              <div className={styles.xpBlock}>
                <div className={styles.xpHeader}>
                  <span className={styles.xpLabel}>Experiência</span>
                  <span className={styles.xpPct}>{pct}%</span>
                </div>
                <div className={styles.xpTrack}>
                  <div className={styles.xpBar} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.xpSub}>
                  {xpAtual.toLocaleString('pt-BR')} / {xpMax.toLocaleString('pt-BR')} XP
                </span>
              </div>
            </div>
          );
        })()}
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
