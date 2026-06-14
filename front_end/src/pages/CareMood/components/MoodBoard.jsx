import React, { useState } from 'react';
import './MoodBoard.css';

const STATUS_EMOJI = {
  Excelente:  '🌟',
  Normal:     '😊',
  Cansado:    '😴',
  Estressado: '😤',
};

const STATUS_LABEL_COLOR = {
  Excelente:  '#22c55e',
  Normal:     '#d4a017',
  Cansado:    '#f97316',
  Estressado: '#ef4444',
};

export default function MoodBoard({ weekData = [] }) {
  const [selected, setSelected] = useState(null);

  function handleDotClick(day) {
    if (day.isFuture && !day.status) return;
    setSelected(day);
  }

  return (
    <div className="moodboard-wrap">
      <p className="section-title center">MOODBOARD SEMANAL:</p>
      <div className="mood-bar card">
        {weekData.map((day) => {
          const { label, status, color, isToday, isFuture } = day;
          const clickable = !isFuture || !!status;
          return (
            <div
              className={`mood-day ${isToday ? 'mood-day--today' : ''}`}
              key={label}
            >
              <span className={`day-label ${isToday ? 'day-label--today' : ''}`}>{label}</span>
              <div
                className={[
                  'mood-dot',
                  isFuture && !status ? 'mood-dot--future' : '',
                  clickable ? 'mood-dot--clickable' : '',
                  selected?.label === label ? 'mood-dot--selected' : '',
                ].join(' ')}
                style={{ backgroundColor: color }}
                title={status || (isFuture ? 'Dia futuro' : 'Clique para ver detalhes')}
                onClick={() => clickable && handleDotClick(day)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && clickable && handleDotClick(day)}
              />
              {isToday && !status && (
                <span className="today-badge">hoje</span>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="mood-detail-overlay" onClick={() => setSelected(null)}>
          <div className="mood-detail-card" onClick={e => e.stopPropagation()}>
            <button className="mood-detail-close" onClick={() => setSelected(null)}>×</button>

            {selected.date && (
              <p className="mood-detail-date">
                {new Date(selected.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </p>
            )}

            {selected.status ? (
              <>
                <div
                  className="mood-detail-badge"
                  style={{
                    background: STATUS_LABEL_COLOR[selected.status] + '18',
                    border: `1.5px solid ${STATUS_LABEL_COLOR[selected.status]}`,
                  }}
                >
                  <span className="mood-detail-emoji">
                    {STATUS_EMOJI[selected.status]}
                  </span>
                  <span
                    className="mood-detail-status"
                    style={{ color: STATUS_LABEL_COLOR[selected.status] }}
                  >
                    {selected.status}
                  </span>
                </div>

                {selected.score !== null && (
                  <div className="mood-detail-score-row">
                    <span className="mood-detail-score-label">Pontuação</span>
                    <div className="mood-detail-bar-wrap">
                      <div
                        className="mood-detail-bar"
                        style={{
                          width: `${(selected.score / 5) * 100}%`,
                          background: STATUS_LABEL_COLOR[selected.status],
                        }}
                      />
                    </div>
                    <span
                      className="mood-detail-score-val"
                      style={{ color: STATUS_LABEL_COLOR[selected.status] }}
                    >
                      {selected.score?.toFixed(1)}/5
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="mood-detail-empty">
                <span className="mood-detail-empty-icon">📋</span>
                <p>Nenhum registro para <strong>{selected.label}</strong>.</p>
                <p className="mood-detail-empty-hint">
                  Complete o CareMood para registrar seu humor do dia.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
