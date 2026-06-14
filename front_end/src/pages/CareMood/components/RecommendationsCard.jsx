import { useState } from 'react';
import { statusToColor } from '../utils/moodUtils';

const MOOD_EMOJIS = {
  Estressado: '😰',
  Cansado:    '😴',
  Normal:     '🙂',
  Excelente:  '🌟',
};

const MISSOES = {
  Estressado: [
    {
      icon: '🫁',
      tag: '⚡ Urgente',
      tagColor: '#ef4444',
      title: 'Respiração 4-4-4',
      desc: 'Inspire por 4s, segure por 4s, expire por 4s. Repita 5 vezes para acalmar o sistema nervoso.',
      reward: 50,
    },
    {
      icon: '🚶',
      tag: '🎯 Missão do Dia',
      tagColor: '#7c5cff',
      title: 'Duas Pausas Restauradoras',
      desc: 'Realize duas pausas de 10 minutos durante o expediente, longe das telas e do trabalho.',
      reward: 75,
    },
    {
      icon: '💬',
      tag: '💛 Cuidado',
      tagColor: '#f59e0b',
      title: 'Conversa de Apoio',
      desc: 'Compartilhe como está se sentindo com alguém de confiança. Apenas falar sobre o que sente já alivia.',
      reward: 100,
    },
  ],
  Cansado: [
    {
      icon: '😴',
      tag: '🌙 Esta Noite',
      tagColor: '#6366f1',
      title: 'Higiene do Sono',
      desc: 'Defina um horário para dormir e desligue telas 30 minutos antes de deitar.',
      reward: 75,
    },
    {
      icon: '☕',
      tag: '🎯 Missão do Dia',
      tagColor: '#7c5cff',
      title: 'Pausa com Intenção',
      desc: 'Faça uma pausa de 15 minutos para um café ou chá, sem multitarefa — só você e o momento.',
      reward: 50,
    },
    {
      icon: '🏃',
      tag: '💪 Energia',
      tagColor: '#22c55e',
      title: 'Movimento Suave',
      desc: 'Uma caminhada de 10 minutos ou alguns alongamentos para reativar o corpo com gentileza.',
      reward: 100,
    },
  ],
  Normal: [
    {
      icon: '🌿',
      tag: '✨ Crescimento',
      tagColor: '#22c55e',
      title: 'Momento de Gratidão',
      desc: 'Anote 3 coisas boas que aconteceram hoje. Cultivar gratidão fortalece o bem-estar.',
      reward: 75,
    },
    {
      icon: '🎯',
      tag: '🎯 Missão do Dia',
      tagColor: '#7c5cff',
      title: 'Foco Intencional',
      desc: 'Escolha sua tarefa mais importante e trabalhe nela por 25 minutos sem interrupções.',
      reward: 100,
    },
    {
      icon: '🤝',
      tag: '💙 Conexão',
      tagColor: '#0ea5e9',
      title: 'Conexão Social',
      desc: 'Envie uma mensagem positiva para um colega ou amigo. Conexões genuínas fortalecem o bem-estar.',
      reward: 50,
    },
  ],
  Excelente: [
    {
      icon: '🚀',
      tag: '🌟 Alto Impacto',
      tagColor: '#f59e0b',
      title: 'Hora de Brilhar',
      desc: 'Você está em ótima forma! Use essa energia para avançar em um desafio importante hoje.',
      reward: 100,
    },
    {
      icon: '🎓',
      tag: '💫 Liderança',
      tagColor: '#ec4899',
      title: 'Compartilhe Sua Energia',
      desc: 'Inspire alguém da equipe com seu estado positivo. Entusiasmo genuíno é contagiante.',
      reward: 75,
    },
    {
      icon: '📚',
      tag: '✨ Crescimento',
      tagColor: '#22c55e',
      title: 'Aprendizado Contínuo',
      desc: 'Reserve 20 minutos para um artigo, podcast ou vídeo que te ensine algo novo.',
      reward: 50,
    },
  ],
};

export default function RecommendationsCard({ todayResult }) {
  const status   = todayResult?.status || 'Normal';
  const dotColor = statusToColor(status);
  const emoji    = MOOD_EMOJIS[status] || '🙂';
  const missions = MISSOES[status] || MISSOES['Normal'];
  const [accepted, setAccepted] = useState([]);

  const handleAccept = (i) => {
    if (!accepted.includes(i)) setAccepted((prev) => [...prev, i]);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-5 sm:py-7 sm:px-7 min-[900px]:py-8 min-[900px]:px-8 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[36px] leading-none">{emoji}</span>
          <div className="flex flex-col gap-1.5">
            <p className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] m-0">
              Missões de Bem-estar
            </p>
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[12px] font-semibold"
              style={{
                background: dotColor + '22',
                border: `1px solid ${dotColor}55`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: dotColor }}
              />
              <span style={{ color: dotColor }}>{status}</span>
            </div>
          </div>
        </div>

        {accepted.length > 0 && (
          <div className="text-xs font-bold text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-full px-2.5 py-1 shrink-0 mt-1">
            {accepted.length}/{missions.length}
          </div>
        )}
      </div>

      {/* Mission cards */}
      <div className="flex flex-col gap-3">
        {missions.map((m, i) => {
          const isDone = accepted.includes(i);
          return (
            <div
              key={i}
              className={[
                'rounded-[var(--radius-md)] p-4 flex flex-col gap-3 transition-colors duration-200',
                isDone
                  ? 'bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.3)]'
                  : 'bg-[var(--bg-tertiary)] border border-[var(--border)]',
              ].join(' ')}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <span className="text-[24px] leading-none shrink-0 mt-0.5">{m.icon}</span>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full inline-block self-start"
                    style={{ color: m.tagColor, background: m.tagColor + '18' }}
                  >
                    {m.tag}
                  </span>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{m.title}</div>
                </div>
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <span className="text-base leading-none">🪙</span>
                  <span className="text-[11px] font-bold text-[var(--accent)]">+{m.reward}</span>
                </div>
              </div>

              <p className="text-[13px] font-medium text-[var(--text-secondary)] leading-[1.6] m-0">
                {m.desc}
              </p>

              <button
                className={[
                  'w-full py-2.5 px-4 rounded-[var(--radius-sm)] text-sm font-bold cursor-pointer transition-all duration-150',
                  isDone
                    ? 'bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.4)] text-[var(--green)] cursor-default'
                    : 'bg-[var(--accent)] border-0 text-white shadow-[0_4px_14px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:-translate-y-px active:scale-[0.98]',
                ].join(' ')}
                onClick={() => handleAccept(i)}
                type="button"
                disabled={isDone}
              >
                {isDone ? '✅ Missão aceita!' : '🎯 Aceitar missão'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
