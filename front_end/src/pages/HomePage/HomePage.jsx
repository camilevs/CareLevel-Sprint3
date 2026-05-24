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
import OnboardingModal, { shouldShowOnboarding } from '../../Components/OnboardingModal/OnboardingModal';

import styles from './HomePage.module.css';

const CONCLUIDAS_KEY = 'caremissoes_concluidas';

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

  useEffect(() => {
    fetchMissoes().then(setMissoes).catch(() => setMissoes(null));
  }, []);

  const missionHighlights = useMemo(() => {
    if (!missoes) return [];

    const tipos = [
      { key: 'individual', label: 'Individual' },
      { key: 'equipe', label: 'Equipe' },
    ];

    return tipos
      .flatMap(({ key, label }) => {
        const itens = missoes?.[key]?.itens ?? [];
        return itens.map((item, index) => {
          const progress = Math.max(0, Math.min(100, Number(item.progresso) || 0));
          const done = Boolean(concluidas[`${key}_${item.id}`] || progress >= 100);
          return {
            id: `${key}_${item.id}`,
            key,
            tipo: label,
            titulo: item.titulo,
            pontos: item.pontos,
            progresso: progress,
            done,
            ordem: index,
          };
        });
      })
      .filter((item) => !item.done)
      .sort((a, b) => {
        if (b.progresso !== a.progresso) return b.progresso - a.progresso;
        if (a.ordem !== b.ordem) return a.ordem - b.ordem;
        return Number(b.pontos || 0) - Number(a.pontos || 0);
      })
      .slice(0, 3);
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
        <section className={styles.missionsPanel} aria-label="Missoes proximas de concluir">
          <div className={styles.missionsHeader}>
            <h2 className={styles.missionsTitle}>Missoes quase concluidas</h2>
            <button
              type="button"
              className={styles.missionsAction}
              onClick={() => navigate('/missoes')}
            >
              Ver todas
            </button>
          </div>

          <div className={styles.missionsList}>
            {missionHighlights.length === 0 ? (
              <p className={styles.missionsEmpty}>Nenhuma missao pendente perto de concluir no momento.</p>
            ) : (
              missionHighlights.map((mission) => (
                <article key={mission.id} className={styles.missionItem}>
                  <div className={styles.missionTopRow}>
                    <span className={styles.missionType}>{mission.tipo}</span>
                    <span className={styles.missionProgress}>{mission.progresso}%</span>
                  </div>

                  <h3 className={styles.missionName}>{mission.titulo}</h3>

                  <div className={styles.progressTrack} aria-hidden="true">
                    <span className={styles.progressFill} style={{ width: `${mission.progresso}%` }} />
                  </div>

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
      </section>

      <ServicesGrid onNavigate={handleNavigate} />
      <Footer />
      {showOnboarding && (
        <OnboardingModal onDone={() => setShowOnboarding(false)} />
      )}
    </main>
  );
}
