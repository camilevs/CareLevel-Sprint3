import {
  Clock,
  SmilePlus,
  BarChart2,
  Gift,
  Medal,
  Activity,
} from 'lucide-react';

import styles from './ServicesGrid.module.css';
import ServiceCard from '../ServiceCard/ServiceCard';

const services = [
  { id: 'missoes',     label: 'Missões',     icon: Clock },
  { id: 'caremood',   label: 'CareMood',    icon: SmilePlus },
  { id: 'ranking',    label: 'Ranking',     icon: BarChart2 },
  { id: 'recompensas',label: 'Recompensas', icon: Gift },
  { id: 'conquistas', label: 'Conquistas',  icon: Medal },
  { id: 'pontos',     label: 'CarePoints',  icon: Activity },
];

export default function ServicesGrid({ onNavigate }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Serviços</h2>
        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              label={service.label}
              onClick={() => onNavigate?.(service.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}