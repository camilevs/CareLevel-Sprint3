import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchAdmin } from "../../services/api";
import Footer from "../../Components/Footer/Footer";
import AdminSidebar, { C } from "../Admin/components/AdminSidebar";

const LINE_PALETTE = [
  "#6fcf97","#f39c12","#4aaf85","#e74c3c","#3498db","#9b59b6","#1abc9c","#e67e22","#2ecc71",
];

// Mapa de atividade — valores determinísticos (sem Math.random)
const ACTIVITY_LEVELS = [
  4,2,3,1,4,2,0,3,4,1,2,3,0,1,
  3,4,2,1,3,4,2,0,1,3,4,2,1,0,
  2,1,4,3,2,1,4,3,0,2,1,4,3,2,
  1,0,3,4,2,1,3,4,2,0,1,3,4,2,
  4,3,1,2,4,3,0,1,2,4,3,1,2,0,
  2,4,1,3,2,4,0,1,3,2,4,1,3,0,
  3,1,4,2,3,1,0,4,2,3,1,4,2,0,
];
const ACTIVITY_COLORS = ["#1a4d3a","#2d7a5f","#4aaf85","#81c784","#c8e6c9"];

// ── Componentes de suporte ────────────────────────────────────────────────────

function ActivityMap() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(14,10px)", gap:2 }}>
      {ACTIVITY_LEVELS.map((level, i) => (
        <div key={i} style={{ width:10, height:10, borderRadius:2, background: ACTIVITY_COLORS[level] }}/>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: C.card, color: C.text, borderRadius:12, padding:"14px 20px", flex:1, minWidth:160 }}>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{label}</div>
      <div style={{ fontWeight:800, fontSize:22 }}>{value}</div>
    </div>
  );
}

function DeptCard({ name, val }) {
  return (
    <div style={{ background: C.card, color: C.text, borderRadius:10, padding:"12px 18px", flex:1, minWidth:140 }}>
      <div style={{ fontSize:12, opacity:.85 }}>{name}</div>
      <div style={{ fontWeight:800, fontSize:20 }}>{val}</div>
    </div>
  );
}

function Card({ title, children, style }) {
  return (
    <div style={{ background: C.cardLight, borderRadius:14, padding:20, ...style }}>
      {title && (
        <div style={{ fontWeight:700, fontSize:14, color: C.text, marginBottom:14, textAlign:"center" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

const selectStyle = {
  padding:"8px 36px 8px 12px",
  borderRadius:8,
  border:"1.5px solid #b2d8c8",
  background:"#fff",
  fontSize:14,
  color: C.textDark,
  appearance:"none",
  WebkitAppearance:"none",
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232d7a5f' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat",
  backgroundPosition:"right 12px center",
  cursor:"pointer",
  width:190,
};

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ fontSize:13, fontWeight:700, color: C.textDark }}>{label}</div>
      <select style={selectStyle} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Dashboard Principal ───────────────────────────────────────────────────────

export default function HRDashboard() {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados dos filtros
  const [selectedEquipe,  setSelectedEquipe]  = useState("Todas");
  const [selectedPeriodo, setSelectedPeriodo] = useState("Todos");
  const [selectedUnidade, setSelectedUnidade] = useState("Matriz");

  useEffect(() => {
    fetchAdmin()
      .then(setAdmin)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Dados brutos da API (vêm do banco via admin_dados + users) ──────────────
  const stats        = admin?.stats      ?? { totalAtivos: 0, totalDesistentes: 0, estresseGlobal: 0 };
  const engTeamRaw   = (admin?.engTeam   ?? []).map(d => ({ name: d.nome, val: d.engajamento }));
  const engMonthRaw  = admin?.engMensal  ?? [];
  const perfDeptRaw  = admin?.perfDept   ?? [];
  const stressDeptRaw= admin?.stressDept ?? [];
  const radarDataRaw = admin?.radar      ?? [];

  // ── Opções dos filtros — derivadas dos dados reais do banco ─────────────────
  // Equipe: nomes que existem no admin_dados (alinhados com os gráficos)
  const equipeOptions = useMemo(
    () => ["Todas", ...engTeamRaw.map(d => d.name)],
    [engTeamRaw]
  );

  // Período: meses presentes no histórico mensal
  const periodoOptions = useMemo(
    () => ["Todos", ...engMonthRaw.map(m => m.mes)],
    [engMonthRaw]
  );

  // Unidade: apenas Matriz (única unidade do sistema)
  const unidadeOptions = ["Matriz"];

  // Chaves de dept nos dados mensais (dinâmicas)
  const deptKeys = useMemo(
    () => engMonthRaw.length ? Object.keys(engMonthRaw[0]).filter(k => k !== "mes") : [],
    [engMonthRaw]
  );

  // Depts presentes no radar
  const radarDepts = useMemo(
    () => radarDataRaw.length ? Object.keys(radarDataRaw[0]).filter(k => k !== "dim") : [],
    [radarDataRaw]
  );

  // ── Dados filtrados — impactam todos os gráficos e cards ───────────────────

  // Gráfico: Engajamento por Equipe
  const filteredEngTeam = useMemo(() => {
    if (selectedEquipe === "Todas") return engTeamRaw;
    return engTeamRaw.filter(d => d.name === selectedEquipe);
  }, [engTeamRaw, selectedEquipe]);

  // Gráfico: Evolução Mensal (filtro equipe + período)
  const filteredEngMonth = useMemo(() => {
    let data = engMonthRaw;
    if (selectedPeriodo !== "Todos") {
      data = data.filter(m => m.mes === selectedPeriodo);
    }
    if (selectedEquipe !== "Todas") {
      data = data.map(m => {
        const obj = { mes: m.mes };
        if (m[selectedEquipe] !== undefined) obj[selectedEquipe] = m[selectedEquipe];
        return obj;
      });
    }
    return data;
  }, [engMonthRaw, selectedEquipe, selectedPeriodo]);

  // Chaves de linhas no gráfico mensal (dinâmico, segue filtro de equipe)
  const filteredDeptKeys = useMemo(() => {
    if (selectedEquipe === "Todas") return deptKeys;
    return deptKeys.filter(k => k === selectedEquipe);
  }, [deptKeys, selectedEquipe]);

  // Cards + gráfico: Desempenho por Departamento
  const filteredPerfDept = useMemo(() => {
    if (selectedEquipe === "Todas") return perfDeptRaw;
    return perfDeptRaw.filter(d => d.dept === selectedEquipe);
  }, [perfDeptRaw, selectedEquipe]);

  // Gráfico: Nível de Estresse por Equipe
  const filteredStressDept = useMemo(() => {
    if (selectedEquipe === "Todas") return stressDeptRaw;
    return stressDeptRaw.filter(d => d.dept === selectedEquipe);
  }, [stressDeptRaw, selectedEquipe]);

  // Radar: departamentos visíveis
  const filteredRadarDepts = useMemo(() => {
    if (selectedEquipe === "Todas") return radarDepts;
    return radarDepts.filter(d => d === selectedEquipe);
  }, [radarDepts, selectedEquipe]);

  // Altura do gráfico de barras verticais (ajusta ao número de equipes)
  const engTeamHeight = Math.max(260, filteredEngTeam.length * 38 + 40);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:"flex", flex:1 }}>
        <AdminSidebar />

        <div style={{ marginLeft:256, flex:1, padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>

          {/* ── Linha de filtros + Mapa de Atividade ── */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:20, flexWrap:"wrap" }}>
            <FilterSelect
              label="Equipe"
              value={selectedEquipe}
              onChange={setSelectedEquipe}
              options={equipeOptions}
            />
            <FilterSelect
              label="Período"
              value={selectedPeriodo}
              onChange={setSelectedPeriodo}
              options={periodoOptions}
            />
            <FilterSelect
              label="Unidade"
              value={selectedUnidade}
              onChange={setSelectedUnidade}
              options={unidadeOptions}
            />

            <div style={{ marginLeft:"auto" }}>
              <Card title="Mapa de Atividade" style={{ background: C.cardDark, padding:14 }}>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <ActivityMap/>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:10, color:"#aaa" }}>
                    <span>Menos</span>
                    {ACTIVITY_COLORS.map((c, i) => (
                      <div key={i} style={{ width:10, height:10, background:c, borderRadius:2 }}/>
                    ))}
                    <span>Mais</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Cards de estatísticas ── */}
          {loading ? (
            <div style={{ color: C.textDark, fontSize:14 }}>Carregando dados do banco...</div>
          ) : (
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <StatCard label="Usuários Ativos"           value={stats.totalAtivos.toLocaleString("pt-BR")}/>
              <StatCard label="Desistentes"               value={(stats.totalDesistentes ?? 0).toLocaleString("pt-BR")}/>
              <StatCard label="Índice de Estresse Global" value={`${stats.estresseGlobal}%`}/>
            </div>
          )}

          {/* ── Engajamento por Equipe + Evolução Mensal ── */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>

            {/* Engajamento por Equipe — barras horizontais (layout vertical) */}
            <Card title="Engajamento por Equipe" style={{ flex:1, minWidth:300 }}>
              <ResponsiveContainer width="100%" height={engTeamHeight}>
                <BarChart
                  data={filteredEngTeam}
                  layout="vertical"
                  margin={{ top:4, right:20, bottom:4, left:4 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize:11, fill:"#fff" }}
                    tickFormatter={v => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize:11, fill:"#fff" }}
                    width={140}
                  />
                  <Tooltip formatter={v => [`${v}%`, "Engajamento"]}/>
                  <Bar dataKey="val" fill={C.cardDark} radius={[0, 4, 4, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Evolução Mensal do Engajamento */}
            <Card title="Evolução Mensal do Engajamento" style={{ flex:2, minWidth:320 }}>
              <ResponsiveContainer width="100%" height={engTeamHeight}>
                <LineChart data={filteredEngMonth} margin={{ top:4, right:20, bottom:4, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
                  <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#fff" }}/>
                  <YAxis domain={[50, 100]} tick={{ fontSize:11, fill:"#fff" }} tickFormatter={v => `${v}%`}/>
                  <Tooltip formatter={(v, name) => [`${v}%`, name]}/>
                  <Legend wrapperStyle={{ fontSize:11, color:"#fff" }}/>
                  {filteredDeptKeys.map((k, i) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      stroke={LINE_PALETTE[i % LINE_PALETTE.length]}
                      dot={{ r:3 }}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* ── Desempenho por Departamento ── */}
          <Card title="Desempenho por Departamento — Mês Atual">
            <ResponsiveContainer width="100%" height={Math.max(220, filteredPerfDept.length * 38 + 40)}>
              <BarChart
                data={filteredPerfDept}
                layout="vertical"
                margin={{ top:4, right:20, bottom:4, left:4 }}
              >
                <XAxis type="number" tick={{ fontSize:11, fill:"#fff" }} tickFormatter={v => `${v}`}/>
                <YAxis type="category" dataKey="dept" tick={{ fontSize:11, fill:"#fff" }} width={140}/>
                <Tooltip/>
                <Bar dataKey="val" fill={C.cardDark} radius={[0, 4, 4, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Cards de desempenho */}
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {filteredPerfDept.map(d => <DeptCard key={d.dept} name={d.dept} val={d.val}/>)}
          </div>

          {/* ── Estresse + Radar ── */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-start" }}>

            <Card title="Nível de Estresse por Equipe (Quiz)" style={{ flex:1, minWidth:300 }}>
              <ResponsiveContainer width="100%" height={Math.max(220, filteredStressDept.length * 38 + 40)}>
                <BarChart
                  data={filteredStressDept}
                  layout="vertical"
                  margin={{ top:4, right:20, bottom:4, left:4 }}
                >
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize:11, fill:"#fff" }} tickFormatter={v => `${v}%`}/>
                  <YAxis type="category" dataKey="dept" tick={{ fontSize:11, fill:"#fff" }} width={140}/>
                  <Tooltip formatter={v => [`${v}%`, "Estresse"]}/>
                  <Bar dataKey="val" fill={C.cardDark} radius={[0, 4, 4, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ flex:1, minWidth:280 }}>
              <div style={{ fontSize:13, fontWeight:700, color: C.textDark, marginBottom:12 }}>
                Análise Multidimensional por Departamento
              </div>
              {filteredRadarDepts.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarDataRaw}>
                    <PolarGrid/>
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize:11, fill: C.textDark }}/>
                    {filteredRadarDepts.map((dept, i) => (
                      <Radar
                        key={dept}
                        name={dept}
                        dataKey={dept}
                        stroke={LINE_PALETTE[i % LINE_PALETTE.length]}
                        fill={LINE_PALETTE[i % LINE_PALETTE.length]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize:11 }}/>
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ fontSize:13, color: C.textDark, opacity:.6 }}>
                  Sem dados de radar para a equipe selecionada.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
