import React from 'react';
import './RecommendationsCard.css';
import { statusToColor, getRecommendationText } from '../utils/moodUtils';

const MOOD_EMOJIS = {
  Estressado: '😰',
  Cansado: '😴',
  Normal: '🙂',
  Excelente: '😄',
};

export default function RecommendationsCard({ todayResult }) {
  const status = todayResult?.status || 'Normal';
  const dotColor = statusToColor(status);
  const { p1, p2 } = getRecommendationText(status);
  const emoji = MOOD_EMOJIS[status] || '🙂';

  return (
    <div className="card rec-card">
      <p className="rec-title">RECOMENDAÇÕES:</p>
      <div className="rec-divider" />

      <div className="rec-layout">
        <div className="rec-avatar-col">
          <div className="avatar-green-ring">
            <div className="avatar-photo">
              <img
                src="https://i.pravatar.cc/138?img=68"
                alt="Avatar"
              />
            </div>

            <div
              className="avatar-status-dot"
              style={{ backgroundColor: dotColor }}
              title={`Status: ${status}`}
            />
          </div>

          <div className="status-box">
            <span className="status-label">STATUS:</span>
            <div
              className="status-colored-pill"
              style={{ backgroundColor: dotColor }}
            >
              <span className="status-value">{status.toUpperCase()}</span>
            </div>
          </div>

          <div className="mood-emoji-display" title={status}>
            {emoji}
          </div>
        </div>

        <div className="rec-texts-col">
          <p>{p1}</p>
          <p>{p2}</p>
        </div>
      </div>
    </div>
  );
}
