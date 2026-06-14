import { useState, useCallback } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import CareMoodHero from './components/CareMoodHero';
import { RewardCard, PrivacyCard } from './components/InfoCards';
import EvolutionCard from './components/EvolutionCard';
import RecommendationsCard from './components/RecommendationsCard';
import MentalHelpCard from './components/MentalHelpCard';
import MoodBoard from './components/MoodBoard';
import DonutChart from './components/DonutChart';
import ExhaustionChart from './components/ExhaustionChart';
import Quiz from './Quiz';
import { useMoodData } from './hooks/useMoodData';

export default function CareMoodPage() {
  const [pagina, setPagina] = useState('caremood');
  const mood = useMoodData();

  const handleQuizComplete = useCallback(() => {
    mood.refresh();
    setPagina('caremood');
  }, [mood]);

  const { todayResult, weekData, donutData, predominant, exhaustionData } = mood;
  const jaRespondeuHoje = !!todayResult;

  return (
    <>
      <NavBar />
      {pagina === 'quiz' ? (
        <Quiz
          onVoltar={() => setPagina('caremood')}
          onComplete={handleQuizComplete}
        />
      ) : (
        <main className="max-w-[1320px] mx-auto px-4 pt-6 pb-10 flex flex-col gap-5 bg-[var(--bg-primary)] min-h-[calc(100vh-64px)] md:px-8 md:pt-10 md:pb-[60px] md:gap-7 min-[1100px]:px-[60px] min-[1100px]:pt-12 min-[1100px]:pb-[60px] min-[1100px]:gap-8">

          <CareMoodHero
            jaRespondeuHoje={jaRespondeuHoje}
            onIniciarMissao={() => setPagina('quiz')}
          />

          {/* Info row: Reward + Privacy */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <RewardCard />
            <PrivacyCard />
          </div>

          {/* Top row: Missions | Evolution + Mental Help */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_0.95fr] md:gap-7 md:items-stretch">
            <RecommendationsCard todayResult={todayResult} />
            <div className="flex flex-col gap-4 sm:gap-5 h-full">
              <EvolutionCard predominant={predominant} exhaustionData={exhaustionData} />
              <MentalHelpCard />
            </div>
          </div>

          <MoodBoard weekData={weekData} />

          {/* Bottom row: Donut | Exhaustion */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 md:items-start">
            <DonutChart donutData={donutData} predominant={predominant} />
            <ExhaustionChart exhaustionData={exhaustionData} />
          </div>

        </main>
      )}
      <Footer />
    </>
  );
}
