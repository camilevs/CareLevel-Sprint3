import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { fetchMissoes } from '../../services/api';
import { useUser } from '../../Components/UserContext/UserContext';
import './MissoesPage.css';

const CONCLUIDAS_KEY = 'caremissoes_concluidas';
const HISTORY_KEY = 'caremissions_history';

function loadConcluidas() {
  try { return JSON.parse(localStorage.getItem(CONCLUIDAS_KEY) || '{}'); }
  catch { return {}; }
}

function saveConcluidas(c) {
  try { localStorage.setItem(CONCLUIDAS_KEY, JSON.stringify(c)); } catch {}
}

function addMissionHistory(missao, pts) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const d = new Date();
    const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    history.unshift({ data: date, atividade: `Missão: ${missao.titulo}`, pontos: `+${pts}`, tipo: 'credito' });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

function parsePontos(pontos) {
  if (typeof pontos === 'number') return pontos;
  return parseInt(String(pontos).replace(/[^0-9]/g, ''), 10) || 0;
}

function LinearProgress({ value }) {
  return (
    <div className="linear-progress-wrap">
      <div className="linear-progress-header">
        <span className="linear-progress-label">Progresso geral</span>
        <span className="linear-progress-pct">{value}%</span>
      </div>
      <div className="linear-progress-track">
        <div className="linear-progress-bar" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MissionItem({ missao, concluida, onToggle, locked }) {
  const handleClick = () => {
    if (concluida || locked) return;
    onToggle(missao);
  };

  return (
    <div
      className={`mission-item ${concluida ? 'mission-done' : ''} ${locked ? 'mission-locked' : ''}`}
      onClick={handleClick}
      title={concluida ? 'Missão concluída' : locked ? '' : 'Clique para marcar como concluída'}
    >
      <div className="mission-check">
        {concluida ? '✓' : missao.id}
      </div>
      <div className="mission-info">
        <span className={`mission-title ${concluida ? 'mission-title-done' : ''}`}>{missao.titulo}</span>
        <span className="mission-points">
          <img src="/512x512bb%204.svg" alt="" className="caremood-icon" />
          {missao.pontos}
        </span>
      </div>
      <div className="mission-status-icon">
        {concluida ? '🏆' : '⭕'}
      </div>
    </div>
  );
}

function CongratulacoesPopup({ tipo, onFechar }) {
  return (
    <div className="missoes-popup-overlay" onClick={onFechar}>
      <div className="missoes-popup" onClick={e => e.stopPropagation()}>
        <div className="missoes-popup-trofeu">🏆</div>
        <h2 className="missoes-popup-titulo">Parabéns!</h2>
        <p className="missoes-popup-texto">
          Você concluiu todas as missões {tipo === 'equipe' ? 'da equipe' : 'individuais'}!
        </p>
        <p className="missoes-popup-sub">
          Seus CarePoints foram adicionados. Continue assim!
        </p>
        <button className="missoes-popup-btn" onClick={onFechar}>
          Ver missões
        </button>
      </div>
    </div>
  );
}

export default function MissoesPage() {
  const location = useLocation();
  const initialAba = location.state?.aba === 'individual' ? 'individual' : 'equipe';
  const [aba, setAba] = useState(initialAba);
  const [missoes, setMissoes] = useState(null);
  const [concluidas, setConcluidas] = useState(loadConcluidas);
  const [popup, setPopup] = useState(false);
  const [popupVisto, setPopupVisto] = useState({ equipe: false, individual: false });
  const { updatePoints } = useUser();

  useEffect(() => {
    fetchMissoes().then(setMissoes).catch(console.error);
  }, []);

  const dados = missoes?.[aba];
  const itens = dados?.itens ?? [];

  const completarMissao = (missao) => {
    const key = `${aba}_${missao.id}`;
    if (concluidas[key]) return;

    const pts = parsePontos(missao.pontos);
    const novas = { ...concluidas, [key]: true };

    setConcluidas(novas);
    saveConcluidas(novas);
    updatePoints(pts);
    addMissionHistory(missao, pts);

    const todasConcluidas = itens.length > 0 && itens.every(m => novas[`${aba}_${m.id}`]);
    if (todasConcluidas && !popupVisto[aba]) {
      setPopup(true);
    }
  };

  const fecharPopup = () => {
    setPopup(false);
    setPopupVisto(prev => ({ ...prev, [aba]: true }));
  };

  const totalConcluidas = itens.filter(m => concluidas[`${aba}_${m.id}`]).length;
  const progresso = itens.length > 0 ? Math.round((totalConcluidas / itens.length) * 100) : 0;
  const todasFeitas = itens.length > 0 && totalConcluidas === itens.length;

  return (
    <>
      <NavBar />
      {popup && <CongratulacoesPopup tipo={aba} onFechar={fecharPopup} />}
      <div className="missoes-page">
        <div className="tabs">
          <button
            className={`tab-btn ${aba === 'equipe' ? 'active' : ''}`}
            onClick={() => setAba('equipe')}
          >
            Equipe
          </button>
          <button
            className={`tab-btn ${aba === 'individual' ? 'active' : ''}`}
            onClick={() => setAba('individual')}
          >
            Individual
          </button>
        </div>

        <div className="missions-card">
          <div className="tempo-row">
            <span className="tempo-label">Tempo restante</span>
            <span className="tempo-value">{dados?.tempo ?? '—'}</span>
          </div>

          <LinearProgress value={progresso} />

          <div className="missions-list">
            {itens.map(m => (
              <MissionItem
                key={m.id}
                missao={m}
                concluida={!!concluidas[`${aba}_${m.id}`]}
                onToggle={completarMissao}
                locked={todasFeitas}
              />
            ))}
          </div>

          <div className="missions-summary">
            {totalConcluidas} de {itens.length} missões concluídas
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
