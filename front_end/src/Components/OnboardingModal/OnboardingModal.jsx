import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './OnboardingModal.module.css';

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
    <div className={`${styles.overlay} d-flex align-items-center justify-content-center`}>
      <div className={`${styles.modal} d-flex flex-column`}>

        {step === 1 && (
          <>
            <div className={`${styles.titlePill} align-self-center`}>BEM VINDO A CARELEVEL</div>

            <div className={`${styles.card} d-flex flex-column`}>
              <p className={styles.greeting}>Bem-vindo(a)!</p>
              <p className={styles.text}>
                A plataforma CareLevel foi desenvolvida para ajudá-lo a melhorar
                seu bem-estar através do acompanhamento das suas atividades diárias e humor.
              </p>
              <p className={styles.text} style={{ marginTop: 12 }}>
                Os dados serão coletados de forma anônima para personalizar sua
                experiência e oferecer recompensas.<br />
                No sistema você encontrará as seguintes áreas:
              </p>

              <ul className={`${styles.featureList} d-flex flex-column`}>
                {features.map(({ Icon, label, desc }) => (
                  <li key={label} className={`${styles.featureItem} d-flex align-items-start`}>
                    <span className={styles.featureIcon}><Icon /></span>
                    <span><strong>{label}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.footer} d-flex justify-content-end`}>
              <button className={styles.btnPrimary} onClick={() => setStep(2)}>
                SEGUINTE
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={`${styles.titlePill} align-self-center`}>TERMOS E CONDIÇÕES</div>

            <div className={`${styles.card} d-flex flex-column`}>
              <p className={styles.sectionTitle}>Consentimento LGPD</p>
              <p className={styles.text}>
                Para continuar, precisamos do seu consentimento para tratar apenas
                os dados necessários à sua jornada de bem-estar.
              </p>
              <p className={styles.text}>Por que pedimos isso?</p>
              <ul className={styles.bulletList}>
                <li>Personalizar suas missões e recompensas</li>
                <li>Registrar seu progresso</li>
                <li>(Opcional) Sincronizar dados de saúde como passos, sono e atividade física</li>
              </ul>
              <p className={styles.text}>Você decide o que compartilhar.</p>
              <p className={styles.text}>
                Tudo é opcional, transparente e pode ser alterado a qualquer momento.
              </p>
              <p className={styles.text}><strong>Seus direitos:</strong></p>
              <p className={styles.text}>
                Acessar, corrigir, excluir ou revogar consentimentos quando quiser.
              </p>
            </div>

            <div className={`${styles.footer} d-flex justify-content-end`}>
              <button className={styles.btnSecondary} onClick={() => setStep(2)}>
                RECUSAR
              </button>
              <button className={styles.btnPrimary} onClick={handleAceitar}>
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
