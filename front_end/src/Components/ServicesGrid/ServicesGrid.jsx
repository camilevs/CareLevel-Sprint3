import {
  Clock,
  SmilePlus,
  BarChart2,
  Gift,
  Medal,
  Activity,
} from 'lucide-react';

import ServiceCard from '../ServiceCard/ServiceCard';

const services = [
  { id: 'missoes',      label: 'Missões',     icon: Clock },
  { id: 'caremood',    label: 'CareMood',    icon: SmilePlus },
  { id: 'ranking',     label: 'Ranking',     icon: BarChart2 },
  { id: 'recompensas', label: 'Recompensas', icon: Gift },
  { id: 'conquistas',  label: 'Conquistas',  icon: Medal },
  { id: 'pontos',      label: 'CarePoints',  icon: Activity },
];

export default function ServicesGrid({ onNavigate }) {
  return (
    <section className="py-2 pb-8">
      <div className="w-[min(1100px,calc(100%-48px))] mx-auto mb-4">
        <h2 className="font-[var(--font-display)] text-2xl font-extrabold text-[var(--text-primary)] tracking-[4px] uppercase m-0">Serviços</h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-3 px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1 pb-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              label={service.label}
              onClick={() => onNavigate?.(service.id)}
            />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--fade-bg)] to-transparent pointer-events-none z-[2]" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--fade-bg)] to-transparent pointer-events-none z-[2]" aria-hidden="true" />
      </div>
    </section>
  );
}
