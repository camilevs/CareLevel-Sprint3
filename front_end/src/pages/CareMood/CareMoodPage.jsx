import { useState, useCallback } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import RecommendationsCard from './components/RecommendationsCard';
import CareMoodColumn from './components/CareMoodColumn';
import MoodBoard from './components/MoodBoard';
import DonutChart from './components/DonutChart';
import ExhaustionChart from './components/ExhaustionChart';
import Quiz from './Quiz';
import { useMoodData } from './hooks/useMoodData';
import './CareMoodLayout.css';
import './styles/tokens.css';

export default function CareMoodPage() {
  const [pagina, setPagina] = useState('caremood');
  const mood = useMoodData();

  const handleQuizComplete = useCallback(() => {
    mood.refresh();
    setPagina('caremood');
  }, [mood]);

  const { todayResult, weekData, donutData, predominant, exhaustionData } = mood;

  return (
    <>
      <NavBar />
      {pagina === 'quiz' ? (
        <Quiz
          onVoltar={() => setPagina('caremood')}
          onComplete={handleQuizComplete}
        />
      ) : (
        <main className="page cm-page">
          <div className="top-row">
            <RecommendationsCard todayResult={todayResult} />
            <CareMoodColumn onQuestionario={() => setPagina('quiz')} jaRespondeuHoje={!!todayResult} />
          </div>

          <MoodBoard weekData={weekData} />

          <div className="bottom-row">
            <DonutChart donutData={donutData} predominant={predominant} />
            <ExhaustionChart exhaustionData={exhaustionData} />
          </div>
        </main>
      )}
      <Footer />
    </>
  );
}
