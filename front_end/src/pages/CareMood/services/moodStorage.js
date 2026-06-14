/**
 * moodStorage.js
 * Serviço de persistência de dados de humor no localStorage.
 * Responsável por salvar, recuperar e gerenciar o histórico de resultados.
 */

const STORAGE_KEY = 'caremood_history';

/**
 * Retorna todos os registros do histórico.
 * @returns {Array<{date: string, status: string, score: number}>}
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva um novo resultado. Se já existe um resultado para hoje, substitui.
 * @param {string} status - 'Estressado' | 'Cansado' | 'Normal' | 'Excelente'
 * @param {number} score  - média das respostas (1–5)
 */
export function saveResult(status, score) {
  const history = getHistory();
  const today = getTodayString();

  // Remove entrada existente do mesmo dia (upsert)
  const filtered = history.filter((entry) => entry.date !== today);

  filtered.push({
    date: today,
    status,
    score: parseFloat(score.toFixed(2)),
  });

  // Ordena por data ascendente
  filtered.sort((a, b) => a.date.localeCompare(b.date));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('CareMood: erro ao salvar resultado', e);
  }

  return filtered;
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD.
 */
export function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Retorna o resultado de hoje, ou null se não houver.
 */
export function getTodayResult() {
  const today = getTodayString();
  return getHistory().find((e) => e.date === today) || null;
}

/**
 * Retorna apenas os registros do mês/ano especificados.
 * @param {number} year
 * @param {number} month - 0-based (igual ao Date.getMonth())
 */
export function getMonthHistory(year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return getHistory().filter((e) => e.date.startsWith(prefix));
}

/**
 * Retorna os registros da semana atual (Seg–Dom baseado na data de hoje).
 */
export function getWeekHistory() {
  const today = new Date();
  // Ajusta domingo (0) para índice 6, e segunda (1) para índice 0
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayIndex);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return getHistory().filter((e) => {
    const d = new Date(e.date + 'T12:00:00');
    return d >= monday && d <= sunday;
  });
}

/**
 * Limpa todo o histórico.
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
