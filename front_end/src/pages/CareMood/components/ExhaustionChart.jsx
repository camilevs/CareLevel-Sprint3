import React from 'react';
import './ExhaustionChart.css';

const TREND_ICON = {
  melhorando: '↓',
  piorando:   '↑',
  estável:    '→',
};

const TREND_LABEL = {
  melhorando: 'Melhorando',
  piorando:   'Piorando',
  estável:    'Estável',
};

export default function ExhaustionChart({ exhaustionData = [] }) {
  // Pega no máximo os 5 meses mais recentes
  const bars = exhaustionData.slice(-5);

  const lastTrend = bars.length >= 2 ? bars[bars.length - 1]?.trend : null;

  return (
    <div className="card exaust-card">
      <div className="exaust-header">
        <p className="section-title white">ANÁLISE DE EXAUSTÃO</p>
        {lastTrend && (
          <span className={`trend-badge trend-${lastTrend}`}>
            {TREND_ICON[lastTrend]} {TREND_LABEL[lastTrend]}
          </span>
        )}
      </div>

      {bars.length === 0 ? (
        <div className="exaust-empty">
          <p>Nenhum dado registrado ainda.</p>
          <p>Complete o questionário para ver a análise.</p>
        </div>
      ) : (
        <>
          <div className="bars">
            {bars.map(({ key, label, exhaustionPct }) => (
              <div className="bar-row" key={key}>
                <span className="bar-label">{label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.min(exhaustionPct, 100)}%` }}
                    title={`${exhaustionPct}% de exaustão`}
                  />
                </div>
                <span className="bar-pct">{exhaustionPct}%</span>
              </div>
            ))}
          </div>

          <div className="bar-axis">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </>
      )}
    </div>
  );
}
