import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STORAGE_KEY = 'carelevel-onboarding';

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  );
}
function MoodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function RankingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
      <line x1="4" y1="17" x2="14" y2="17" strokeLinecap="round" />
      <circle cx="2.5" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function RecompensaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ConquistaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="9" r="5" />
      <path d="M8 14l-2 6h12l-2-6" strokeLinejoin="round" />
    </svg>
  );
}
function PointsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" strokeLinecap="round" />
    </svg>
  );
}

const features = [
  { Icon: ClockIcon,      label: 'Missões',     desc: 'Tarefas e objetivos a serem cumpridos.' },
  { Icon: MoodIcon,       label: 'CareMood',    desc: 'Monitoramento de humor e sugestões de atividades.' },
  { Icon: RankingIcon,    label: 'Ranking',     desc: 'Comparação de seu desempenho com outros usuários.' },
  { Icon: RecompensaIcon, label: 'Recompensas', desc: 'Prêmios oferecidos pelo seu progresso.' },
  { Icon: ConquistaIcon,  label: 'Conquistas',  desc: 'Insígnias obtidas por completar desafios.' },
  { Icon: PointsIcon,     label: 'CarePoints',  desc: 'Acumulados ao completar missões e desafios.' },
];

const pillCls = "self-center bg-[var(--accent)] text-white text-[11px] font-black tracking-[2px] px-4 py-2 rounded-full mt-6";
const cardCls = "bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-lg)] mx-5 mt-4 p-5 flex flex-col gap-3";
const textCls = "text-sm text-[var(--text-secondary)] leading-relaxed m-0";
const btnPrimary = "bg-[var(--accent)] text-white border-0 rounded-[var(--radius-sm)] py-2.5 px-6 text-sm font-bold cursor-pointer hover:bg-[var(--accent-hover)] transition-colors";
const btnSecondary = "bg-transparent text-[var(--text-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] py-2.5 px-6 text-sm font-bold cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors";

export default function OnboardingModal({ onDone }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  function handleAceitar() {
    if (user?.id) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, 'done');
    }
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 [backdrop-filter:blur(4px)] p-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] flex flex-col overflow-hidden pb-2">

        {step === 1 && (
          <>
            <div className={pillCls}>BEM VINDO A CARELEVEL</div>

            <div className={cardCls}>
              <p className="text-lg font-bold text-[var(--text-primary)] m-0">Bem-vindo(a)!</p>
              <p className={textCls}>
                A plataforma CareLevel foi desenvolvida para ajudá-lo a melhorar
                seu bem-estar através do acompanhamento das suas atividades diárias e humor.
              </p>
              <p className={textCls}>
                Os dados serão coletados de forma anônima para personalizar sua
                experiência e oferecer recompensas.<br />
                No sistema você encontrará as seguintes áreas:
              </p>

              <ul className="flex flex-col gap-2 mt-1 list-none p-0 m-0">
                {features.map(({ Icon, label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[var(--accent)] flex-shrink-0"><Icon /></span>
                    <span className="text-sm text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">{label}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end px-5 py-4">
              <button className={btnPrimary} onClick={() => setStep(2)}>
                SEGUINTE
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={pillCls}>TERMOS E CONDIÇÕES</div>

            <div className={cardCls}>
              <p className="text-sm font-bold text-[var(--text-primary)] m-0">Consentimento LGPD</p>
              <p className={textCls}>
                Para continuar, precisamos do seu consentimento para tratar apenas
                os dados necessários à sua jornada de bem-estar.
              </p>
              <p className={textCls}>Por que pedimos isso?</p>
              <ul className="list-disc list-inside flex flex-col gap-1 pl-1">
                <li className="text-sm text-[var(--text-secondary)]">Personalizar suas missões e recompensas</li>
                <li className="text-sm text-[var(--text-secondary)]">Registrar seu progresso</li>
                <li className="text-sm text-[var(--text-secondary)]">(Opcional) Sincronizar dados de saúde como passos, sono e atividade física</li>
              </ul>
              <p className={textCls}>Você decide o que compartilhar.</p>
              <p className={textCls}>
                Tudo é opcional, transparente e pode ser alterado a qualquer momento.
              </p>
              <p className={textCls}><strong>Seus direitos:</strong></p>
              <p className={textCls}>
                Acessar, corrigir, excluir ou revogar consentimentos quando quiser.
              </p>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4">
              <button className={btnSecondary} onClick={() => setStep(2)}>
                RECUSAR
              </button>
              <button className={btnPrimary} onClick={handleAceitar}>
                ACEITAR
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export function shouldShowOnboarding(userId) {
  if (!userId) return false;
  return !localStorage.getItem(`${STORAGE_KEY}-${userId}`);
}
