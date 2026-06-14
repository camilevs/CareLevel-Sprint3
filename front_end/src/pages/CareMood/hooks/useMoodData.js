/**
 * useMoodData.js
 * Hook central que gerencia e expõe todos os dados de humor.
 * Carrega do localStorage e fornece função de refresh.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTodayResult,
  getWeekHistory,
  getMonthHistory,
  getHistory,
} from '../services/moodStorage';
import {
  calcDonutData,
  getPredominantStatus,
  calcExhaustionData,
  getTodayIsoIndex,
  WEEK_DAYS,
  statusToColor,
} from '../utils/moodUtils';

export function useMoodData() {
  const [todayResult,    setTodayResult]    = useState(null);
  const [weekData,       setWeekData]       = useState([]);
  const [donutData,      setDonutData]      = useState([]);
  const [predominant,    setPredominant]    = useState(null);
  const [exhaustionData, setExhaustionData] = useState([]);
  const [lastUpdated,    setLastUpdated]    = useState(Date.now());

  const refresh = useCallback(() => {
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    // 1. Resultado de hoje
    const today = getTodayResult();
    setTodayResult(today);

    // 2. Semana — monta array de 7 dias com status de cada um
    const weekHistory = getWeekHistory();
    const todayIdx = getTodayIsoIndex();
    const weekMapped = WEEK_DAYS.map(({ label, isoIndex }) => {
      // Encontra o registro cujo dia da semana corresponde ao isoIndex
      const entry = weekHistory.find((e) => {
        const d = new Date(e.date + 'T12:00:00');
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        return idx === isoIndex;
      });
      return {
        label,
        isoIndex,
        status:   entry?.status || null,
        score:    entry?.score  ?? null,
        date:     entry?.date   ?? null,
        color:    statusToColor(entry?.status || null),
        isToday:  isoIndex === todayIdx,
        isFuture: isoIndex > todayIdx,
      };
    });
    setWeekData(weekMapped);

    // 3. Donut — mês atual
    const now = new Date();
    const monthHistory = getMonthHistory(now.getFullYear(), now.getMonth());
    setDonutData(calcDonutData(monthHistory));
    setPredominant(getPredominantStatus(monthHistory));

    // 4. Exaustão — histórico completo
    setExhaustionData(calcExhaustionData(getHistory()));
  }, [lastUpdated]);

  return {
    todayResult,
    weekData,
    donutData,
    predominant,
    exhaustionData,
    refresh,
  };
}
