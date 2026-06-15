import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { fetchCarepoints } from "../../services/api";

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

export default function CarePointsHistorico() {
  const [busca, setBusca] = useState("");
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarepoints()
      .then((dados) => setHistorico(dados.historico ?? []))
      .catch(console.error);
  }, []);

  const historicoFiltrado = historico.filter((row) =>
    row.atividade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <NavBar />
      <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-[860px] mx-auto flex flex-col gap-5">

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/carepoints")}
                className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer text-base font-bold transition-[background,border-color,color] duration-150 hover:bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >←</button>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] m-0">Histórico de CarePoints</h2>
            </div>
            <div className="relative">
              <input
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-sm)] py-2 pl-8 pr-3 text-sm text-[var(--text-primary)] outline-none transition-[border-color] duration-200 focus:border-[var(--accent)] placeholder:text-[var(--text-muted)] w-[160px] sm:w-[220px]"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />Crédito (pontos ganhos)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />Débito (pontos gastos)</span>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
            <div className="flex items-center gap-4 sm:gap-6 px-4 py-2.5 sm:px-6 border-b border-[var(--border)] text-xs font-bold text-[var(--text-muted)]">
              <span className="w-[110px] flex-shrink-0">Data</span>
              <span className="flex-1">Atividade</span>
              <span>Pontos</span>
            </div>
            <div>
              {historicoFiltrado.length > 0
                ? historicoFiltrado.map((row, i) => <HistoricoRow key={i} row={row} />)
                : <p className="text-sm text-[var(--text-muted)] text-center py-10">Nenhum resultado encontrado.</p>
              }
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
