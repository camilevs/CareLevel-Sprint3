export const STATUS_LIST = ['Estressado', 'Cansado', 'Normal', 'Excelente'];

export function statusToColor(status) {
  const map = {
    Estressado: '#FE0000',
    Cansado:    '#FF9D00',
    Normal:     '#F5C800',
    Excelente:  '#55F400',
  };
  return map[status] || '#D9D9D9';
}

export function statusToClass(status) {
  const map = {
    Estressado: 'dot-estressado',
    Cansado:    'dot-cansado',
    Normal:     'dot-normal',
    Excelente:  'dot-excelente',
  };
  return map[status] || 'dot-vazio';
}

export const WEEK_DAYS = [
  { label: 'Seg', isoIndex: 0 },
  { label: 'Ter', isoIndex: 1 },
  { label: 'Qua', isoIndex: 2 },
  { label: 'Qui', isoIndex: 3 },
  { label: 'Sex', isoIndex: 4 },
  { label: 'Sáb', isoIndex: 5 },
  { label: 'Dom', isoIndex: 6 },
];

export function getTodayIsoIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function calcDonutData(entries) {
  if (!entries.length) return [];

  const counts = {};
  STATUS_LIST.forEach((s) => (counts[s] = 0));
  entries.forEach((e) => {
    if (counts[e.status] !== undefined) counts[e.status]++;
  });

  const total = entries.length;
  return STATUS_LIST
    .filter((s) => counts[s] > 0)
    .map((s) => ({
      status: s,
      count:  counts[s],
      pct:    parseFloat(((counts[s] / total) * 100).toFixed(1)),
      color:  statusToColor(s),
    }));
}

export function getPredominantStatus(entries) {
  if (!entries.length) return null;
  const data = calcDonutData(entries);
  return data.sort((a, b) => b.count - a.count)[0]?.status || null;
}

export function calcExhaustionData(history) {
  if (!history.length) return [];

  const grouped = {};
  history.forEach(({ date, score }) => {
    const key = date.slice(0, 7);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(score);
  });

  const MONTH_LABELS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const months = Object.keys(grouped).sort();
  const result = months.map((key) => {
    const scores = grouped[key];
    const avg = scores.reduce((a, v) => a + v, 0) / scores.length;
    const exhaustionPct = parseFloat((((5 - avg) / 4) * 100).toFixed(1));
    const [year, month] = key.split('-');
    return {
      key,
      label: `${MONTH_LABELS[parseInt(month, 10) - 1]}/${year.slice(2)}`,
      exhaustionPct,
      avgScore: avg,
    };
  });

  const trend = (() => {
    if (result.length < 2) return 'estável';
    const diff = result[result.length - 1].exhaustionPct - result[result.length - 2].exhaustionPct;
    if (diff < -5) return 'melhorando';
    if (diff > 5)  return 'piorando';
    return 'estável';
  })();

  return result.map((r, i) => ({
    ...r,
    trend: i === result.length - 1 ? trend : null,
  }));
}

export function getRecommendationText(status) {
  const texts = {
    Estressado: {
      p1: 'Seu estado emocional indica alto nível de estresse hoje. É fundamental desacelerar, fazer respirações profundas e evitar acumular mais responsabilidades por agora. Priorize o que é essencial.',
      p2: 'Considere pausas mais longas, hidratação frequente e, se possível, uma conversa com alguém de confiança. Você não precisa resolver tudo hoje — cuidar de si é a tarefa mais importante.',
    },
    Cansado: {
      p1: 'Você está apresentando sinais de cansaço acumulado. É importante respeitar seus limites e não tentar forçar produtividade além do que seu corpo e mente permitem hoje.',
      p2: 'Tente reservar momentos de pausa real ao longo do dia — sem tela, sem tarefas. Uma caminhada curta ou alguns minutos de silêncio podem fazer diferença significativa.',
    },
    Normal: {
      p1: 'Seu estado emocional está estável hoje, e isso é um ótimo sinal. Aproveite esse equilíbrio para organizar seu dia com calma, manter boas práticas de autocuidado e evitar sobrecarga.',
      p2: 'Você está se sentindo dentro da normalidade, o que indica bom controle emocional. Continue priorizando hábitos que sustentem esse bem-estar ao longo da semana.',
    },
    Excelente: {
      p1: 'Parabéns! Você está em um ótimo estado emocional hoje. Aproveite esse momento de energia e clareza para avançar em projetos importantes e se conectar com pessoas ao redor.',
      p2: 'Esse é um dia ideal para enfrentar desafios, tomar decisões e celebrar pequenas conquistas. Mantenha os hábitos saudáveis que estão contribuindo para esse bem-estar.',
    },
  };
  return texts[status] || texts['Normal'];
}
