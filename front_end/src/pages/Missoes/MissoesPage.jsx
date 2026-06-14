import { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { fetchMissoes } from '../../services/api';
import { useUser } from '../../Components/UserContext/UserContext';

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
    <div className="py-1">
      <div className="grid grid-cols-2 items-center mb-1.5">
        <span className="text-[13px] font-semibold text-[var(--text-secondary)] justify-self-start">
          Progresso geral
        </span>
        <span className="text-[13px] font-extrabold text-[var(--text-primary)] justify-self-end">
          {value}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MissionItem({ missao, concluida, onToggle, locked, index }) {
  const [justDone, setJustDone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    if (concluida || locked) return;
    setJustDone(true);
    setTimeout(() => setJustDone(false), 600);
    onToggle(missao);
  };

  return (
    <div
      className={[
        'grid grid-cols-[32px_1fr_auto] sm:grid-cols-[34px_1fr_auto] md:grid-cols-[36px_1fr_auto]',
        'items-center gap-3 sm:gap-3.5 md:gap-3.5',
        'bg-[var(--bg-tertiary)] rounded-[18px] sm:rounded-[20px]',
        'p-3 sm:p-[13px_15px] md:p-[14px_16px]',
        'cursor-pointer select-none',
        'transition-[background,transform,opacity] duration-150 ease-out',
        !concluida && !locked ? 'hover:bg-[var(--bg-elevated)]' : '',
        concluida ? 'bg-[var(--bg-elevated)] opacity-75 cursor-default' : '',
        locked ? 'cursor-default pointer-events-none opacity-50' : '',
        justDone ? 'scale-[0.97]' : '',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      ].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${index * 60}ms` }}
      onClick={handleClick}
      title={concluida ? 'Missão concluída' : locked ? '' : 'Clique para marcar como concluída'}
    >
      <div
        className={[
          'w-8 h-8 sm:w-[34px] sm:h-[34px] md:w-9 md:h-9',
          'rounded-[10px] sm:rounded-[11px] md:rounded-xl',
          'flex items-center justify-center flex-shrink-0',
          'text-sm sm:text-[15px] md:text-base font-bold text-white',
          'bg-[var(--accent)]',
          'transition-[background,transform] duration-300',
          concluida ? 'bg-[var(--green)]' : '',
          justDone ? 'animate-check-bounce' : '',
        ].filter(Boolean).join(' ')}
      >
        {concluida ? '✓' : missao.id}
      </div>

      <div className="min-w-0 grid gap-1">
        <span
          className={[
            'text-sm md:text-[15px] font-semibold text-[var(--text-primary)]',
            concluida ? 'line-through opacity-60' : '',
          ].filter(Boolean).join(' ')}
        >
          {missao.titulo}
        </span>
        <span className="flex items-center gap-1.5 text-xs md:text-[13px] font-medium text-[var(--text-secondary)]">
          <img src="/512x512bb%204.svg" alt="" className="w-3.5 h-3.5 object-contain flex-shrink-0" />
          {missao.pontos}
        </span>
      </div>

      <div
        className={[
          'text-xl flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          justDone ? 'scale-150 rotate-12' : '',
        ].filter(Boolean).join(' ')}
      >
        {concluida ? '🏆' : '⭕'}
      </div>
    </div>
  );
}

function CongratulacoesPopup({ tipo, onFechar }) {
  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[500] grid place-items-center p-5 animate-fade-in"
      onClick={onFechar}
    >
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-9 px-7 pb-7 max-w-[340px] w-full text-center shadow-[var(--shadow-lg),0_0_40px_var(--accent-glow)] animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl leading-none mb-3 animate-trophy-bounce" style={{ animationDelay: '150ms' }}>
          🏆
        </div>
        <h2 className="text-[22px] font-extrabold text-[var(--text-primary)] mb-2.5">Parabéns!</h2>
        <p className="text-[15px] font-semibold text-[var(--text-secondary)] mb-1.5">
          Você concluiu todas as missões {tipo === 'equipe' ? 'da equipe' : 'individuais'}!
        </p>
        <p className="text-[13px] text-[var(--text-muted)] mb-6">
          Seus CarePoints foram adicionados. Continue assim!
        </p>
        <button
          className="bg-[var(--accent)] text-white border-none rounded-full px-8 py-2.5 text-sm font-bold cursor-pointer shadow-[0_4px_14px_var(--accent-glow)] transition-[background,transform] duration-150 hover:bg-[var(--accent-hover)] hover:-translate-y-px font-inherit"
          onClick={onFechar}
        >
          Ver missões
        </button>
      </div>
    </div>
  );
}

export default function MissoesPage() {
  const [aba, setAba] = useState('equipe');
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
    if (todasConcluidas && !popupVisto[aba]) setPopup(true);
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

      <div className="grid grid-rows-[auto_1fr] justify-items-center items-start gap-5 px-4 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12 xl:px-10 xl:py-14 min-h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        {/* Tabs */}
        <div className="grid grid-cols-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[25px] p-1 gap-0.5 w-full max-w-[520px] shadow-[var(--shadow-sm)]">
          {['equipe', 'individual'].map(tab => (
            <button
              key={tab}
              className={[
                'border-none rounded-[22px] px-4 py-2.5 sm:px-6 sm:py-2.5 md:px-8',
                'font-[var(--font)] text-sm sm:text-[15px] md:text-base font-semibold whitespace-nowrap',
                'cursor-pointer transition-[background,color] duration-[180ms]',
                aba === tab
                  ? 'bg-[var(--accent)] text-white shadow-[0_2px_8px_var(--accent-glow)]'
                  : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
              onClick={() => setAba(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Card principal */}
        <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3.5 sm:gap-[15px] md:gap-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[22px] md:rounded-[28px] p-[18px_18px_22px] sm:p-5 md:p-6 w-full max-w-[520px] shadow-[var(--shadow-md)]">
          <div className="flex items-center gap-2.5 pb-1">
            <span className="text-sm sm:text-[15px] font-semibold text-[var(--text-secondary)]">Tempo restante</span>
            <span className="bg-[var(--accent-subtle)] text-[var(--accent)] rounded-[20px] px-3 py-[3px] text-[13px] sm:text-sm font-bold">
              {dados?.tempo ?? '—'}
            </span>
          </div>

          <LinearProgress value={progresso} />

          <div className="grid grid-cols-1 gap-2.5">
            {itens.map((m, i) => (
              <MissionItem
                key={m.id}
                missao={m}
                concluida={!!concluidas[`${aba}_${m.id}`]}
                onToggle={completarMissao}
                locked={todasFeitas}
                index={i}
              />
            ))}
          </div>

          <div className="text-center text-[13px] font-semibold text-[var(--text-secondary)] pt-1 border-t border-[var(--border)]">
            {totalConcluidas} de {itens.length} missões concluídas
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
