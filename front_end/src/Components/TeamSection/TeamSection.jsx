const TEAM = [
  { name: 'Lucas',   role: 'Back-end Developer',  avatar: 'https://i.pravatar.cc/100?img=12', emoji: '⚙️' },
  { name: 'Marco',   role: 'Full Stack Developer', avatar: 'https://i.pravatar.cc/100?img=15', emoji: '🚀' },
  { name: 'Sofia',   role: 'UI/UX Designer',       avatar: 'https://i.pravatar.cc/100?img=47', emoji: '🎨' },
  { name: 'Gustavo', role: 'Front-end Developer',  avatar: 'https://i.pravatar.cc/100?img=33', emoji: '💻' },
  { name: 'Você',    role: 'TI (Você)',            avatar: 'https://i.pravatar.cc/100?img=68', emoji: '🧑‍💻', isYou: true },
];

export default function TeamSection() {
  return (
    <section className="py-10 px-4 bg-[var(--bg-primary)]">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-center font-[var(--font-display)] text-3xl font-bold text-[var(--text-primary)] mb-2">Nossa Equipe</h2>
        <p className="text-center text-sm text-[var(--text-muted)] mb-8">As pessoas por trás do CareLevel</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className={`relative flex flex-col items-center gap-3 p-4 w-full rounded-[var(--radius-lg)] border bg-[var(--bg-secondary)] transition-[border-color,box-shadow] duration-200 ${member.isYou ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-subtle)]' : 'border-[var(--border)] hover:border-[var(--accent)]'}`}
            >
              {member.isYou && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-[10px] font-black px-2.5 py-[3px] rounded-full whitespace-nowrap">Você</div>
              )}
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                <span className="absolute -bottom-1 -right-1 text-lg leading-none">{member.emoji}</span>
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-[var(--text-primary)]">{member.name}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
