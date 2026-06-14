import React from 'react';
import './CareMoodColumn.css';

export default function CareMoodColumn({ onQuestionario, jaRespondeuHoje }) {
  return (
    <div className="cm-col">
      <div className="cm-title-bar">CareMood©</div>

      <div className="card cm-card">
        <p className="cm-subtitle">
          {jaRespondeuHoje
            ? 'Você já respondeu o questionário hoje, volte amanhã para atualizar os resultados.'
            : 'Responda o questionário para avaliar seus sentimentos e impressões do dia de hoje!'}
        </p>
        {!jaRespondeuHoje && (
          <button className="btn-quest" onClick={onQuestionario}>
            QUESTIONÁRIO
          </button>
        )}
      </div>

      <a
        href="https://www.careplus.com.br/assets/documents/mental-health.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="card cm-mental-card cm-mental-link"
      >
        <span className="mental-help-icon">🧠</span>
        <span className="mental-help-text">MENTAL HELP</span>
        <span className="mental-help-arrow">→</span>
      </a>
    </div>
  );
}
