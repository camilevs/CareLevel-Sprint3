import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from '../../Components/Footer/Footer';
import { fetchCarepoints } from "../../services/api";
import { useUser } from "../../Components/UserContext/UserContext";

const PAGE_SIZE = 4;

function Bar({ b, maxVal }) {
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);
  const BAR_MAX_PX = 110;
  const heightPx = Math.round((b.valor / maxVal) * BAR_MAX_PX);

  const handleMouseEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setTooltip({ x: r.left + r.width / 2, y: r.top });
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={ref}
        className="w-8 min-[500px]:w-10 rounded-t-[4px] cursor-pointer transition-opacity duration-150 hover:opacity-80"
        style={{
          height: `${heightPx}px`,
          background: b.destaque ? "var(--accent-hover)" : "rgba(255,255,255,0.55)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTooltip(null)}
      />
      <span className="text-[10px] min-[500px]:text-[11px] font-semibold text-white/80">{b.mes}</span>
      {tooltip && createPortal(
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, calc(-100% - 6px))",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-sm)] py-1.5 px-3 text-xs font-bold text-[var(--text-primary)] shadow-[var(--shadow-md)] whitespace-nowrap">
            {b.valor.toLocaleString("pt-BR")} pts
          </div>
          <div className="w-2 h-2 bg-[var(--bg-elevated)] border-r border-b border-[var(--border)] rotate-45 mx-auto -mt-1" />
        </div>,
        document.body
      )}
    </div>
  );
}

function HistoricoRow({ row }) {
  const isDebito  = row.tipo === "debito";
  const isCredito = row.tipo === "credito";
  const rowCls = ['flex items-center gap-3 py-[11px] px-4 border-l-4 transition-[background] duration-150 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-t-[var(--border)]', isCredito ? 'border-l-[#22c55e] hover:bg-[rgba(34,197,94,0.04)]' : isDebito ? 'border-l-[#ef4444] hover:bg-[rgba(239,68,68,0.04)]' : 'border-l-[var(--border)] hover:bg-[var(--bg-elevated)]'].join(' ');
  const iconCls = ['w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', isCredito ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' : isDebito ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'].join(' ');
  const pontosCls = ['text-sm font-bold flex-shrink-0', isCredito ? 'text-[#22c55e]' : isDebito ? 'text-[#ef4444]' : 'text-[var(--text-muted)]'].join(' ');
  return (
    <div className={rowCls}>
      <div className="flex items-center gap-2 w-[110px] flex-shrink-0">
        <div className={iconCls}>{isDebito ? "↓" : "↑"}</div>
        <span className="text-xs text-[var(--text-muted)]">{row.data}</span>
      </div>
      <span className="flex-1 text-sm text-[var(--text-primary)] truncate min-w-0">{row.atividade}</span>
      <span className={pontosCls}>{row.pontos}</span>
    </div>
  );
}

export default function CarePoints() {
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchCarepoints().then(setDados).catch(console.error);
  }, []);

  const analise = dados?.analise ?? [];
  const historico = dados?.historico ?? [];
  const maxVal = analise.length > 0 ? Math.max(...analise.map((b) => b.valor)) : 1;
  const historicoFiltrado = historico.filter((row) =>
    row.atividade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <NavBar />
      <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-[900px] mx-auto flex flex-col gap-5 sm:gap-6">

          {/* Top card - gradient with bar chart */}
          <div className="flex flex-col min-[500px]:flex-row min-[500px]:h-[260px] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]" style={{background:'linear-gradient(135deg,var(--accent) 0%,#4A9A82 100%)'}}>
            <div className="flex flex-col justify-center gap-2 py-6 px-6 sm:px-8 flex-1 min-w-0">
              <p className="text-[36px] sm:text-[44px] font-extrabold text-white leading-none">{user.points.toLocaleString("pt-BR")}</p>
              <p className="text-[15px] font-bold text-white/80 tracking-[0.5px]">CarePoints</p>
              <p className="text-xs text-white/65">Válidos até {dados?.validadePoints ?? "—"}</p>
              <button
                className="mt-2 self-start bg-white text-[var(--accent)] border-0 rounded-[var(--radius-sm)] py-2.5 px-5 text-sm font-extrabold cursor-pointer transition-[opacity,transform] duration-150 hover:opacity-90 hover:-translate-y-px"
                onClick={() => navigate('/recompensas')}
              >RESGATE AQUI</button>
            </div>

            <div className="flex flex-col justify-end py-4 px-4 sm:px-6 min-[500px]:w-[200px] sm:w-[240px] flex-shrink-0">
              <p className="text-[11px] font-bold text-white/70 tracking-[0.5px] mb-2">ANÁLISE ÚLTIMOS MESES</p>
              <div className="flex items-end gap-1 sm:gap-2 h-[110px]">
                {analise.map((b, i) => <Bar key={i} b={b} maxVal={maxVal} />)}
              </div>
            </div>
          </div>

          {/* Histórico section */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-3 px-4 py-4 sm:px-6 sm:py-5 border-b border-[var(--border)]">
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] m-0">Histórico de CarePoints</h2>
              <div className="relative flex-shrink-0">
                <input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-sm)] py-2 pl-8 pr-3 text-sm text-[var(--text-primary)] outline-none transition-[border-color] duration-200 focus:border-[var(--accent)] placeholder:text-[var(--text-muted)] w-[160px] sm:w-[200px]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 px-4 py-2.5 sm:px-6 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)]">
              <span>Data</span>
              <span className="flex-1">Atividade</span>
              <span>Pontos</span>
            </div>

            <div>
              {historicoFiltrado.slice(0, PAGE_SIZE).map((row, i) => <HistoricoRow key={i} row={row} />)}
            </div>

            <div className="flex justify-center py-3 border-t border-[var(--border)]">
              <button
                onClick={() => navigate("/carepoints/historico")}
                className="bg-transparent border border-[var(--border)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] py-2 px-6 text-sm font-semibold cursor-pointer transition-[background,border-color,color] duration-150 hover:bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >Ver tudo</button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
