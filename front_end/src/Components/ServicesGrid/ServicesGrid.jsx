import {
  SmilePlus,
  Gift,
  Activity,
  Map,
} from 'lucide-react';

import ServiceCard from '../ServiceCard/ServiceCard';

const services = [
  { id: 'caremood',    label: 'CareMood',    icon: SmilePlus },
  { id: 'jornada',    label: 'Jornada',     icon: Map },
  { id: 'recompensas', label: 'Recompensas', icon: Gift },
  { id: 'pontos',      label: 'CarePoints',  icon: Activity },
];

export default function ServicesGrid({ onNavigate }) {
  return (
    <section className="py-2 pb-8">
      <div className="w-[min(1100px,calc(100%-48px))] mx-auto mb-4">
        <h2 className="font-[var(--font-display)] text-2xl font-extrabold text-[var(--text-primary)] tracking-[4px] uppercase m-0">Serviços</h2>
      </div>

      <div className="w-[min(1100px,calc(100%-48px))] mx-auto">
        {services.map((service, index) => (
          <div key={service.id}>
            <ServiceCard
              icon={service.icon}
              label={service.label}
              onClick={() => onNavigate?.(service.id)}
            />
            {index < services.length - 1 && (
              <div className="border-b border-[var(--border)]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
