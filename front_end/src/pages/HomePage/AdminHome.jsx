import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { fetchAdmin } from "../../services/api";
import Footer from "../../Components/Footer/Footer";
import AdminSidebar, { C } from "../Admin/components/AdminSidebar";

// Paleta de cores para as linhas do gráfico mensal (determinística por índice)
const LINE_PALETTE = [
  "#6fcf97","#f39c12","#4aaf85","#e74c3c","#3498db","#9b59b6","#1abc9c","#e67e22","#2ecc71",
];

// Mapa de atividade: valores determinísticos baseados em atividade simulada
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

function ActivityMap() {
  const rows = 7, cols = 14;
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},10px)`, gap:2 }}>
      {ACTIVITY_LEVELS.slice(0, rows * cols).map((level, i) => (
        <div key={i} style={{
          width:10, height:10, borderRadius:2,
          background: ACTIVITY_COLORS[level],
        }}/>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: C.card, color: C.text, borderRadius:12,
      padding:"14px 20px", flex:1, minWidth:160
    }}>
      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{label}</div>
      <div style={{ fontWeight:800, fontSize:22 }}>{value}</div>
    </div>
  );
}

function DeptCard({ name, val }) {
  return (
    <div style={{
      background: C.card, color: C.text, borderRadius:10,
      padding:"12px 18px", flex:1, minWidth:140
    }}>
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

export default function HRDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmin()
      .then(setAdmin)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats      = admin?.stats     ?? { totalAtivos: 0, totalDesistentes: 0, estresseGlobal: 0 };
  const engTeam    = (admin?.engTeam  ?? []).map(d => ({ name: d.nome, val: d.engajamento }));
  const engMonth   = admin?.engMensal ?? [];
  const perfDept   = admin?.perfDept  ?? [];
  const stressDept = admin?.stressDept ?? [];
  const radarData  = admin?.radar ?? [];

  // Departamentos presentes nos dados mensais (dinâmico)
  const deptKeys = useMemo(() =>
    engMonth.length > 0 ? Object.keys(engMonth[0]).filter(k => k !== 'mes') : [],
    [engMonth]
  );

  // Departamentos presentes no radar (dinâmico)
  const radarDepts = useMemo(() =>
    radarData.length > 0 ? Object.keys(radarData[0]).filter(k => k !== 'dim') : [],
    [radarData]
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:"flex", flex:1 }}>
        <AdminSidebar />

        <div style={{ marginLeft:256, flex:1, padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>

          {/* Mapa de atividade */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:20, flexWrap:"wrap" }}>
            <div style={{ marginLeft:"auto" }}>
              <Card title="Mapa de Atividade" style={{ background: C.cardDark, padding:14 }}>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <ActivityMap/>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:10, color:"#aaa" }}>
                    <span>Menos</span>
                    {ACTIVITY_COLORS.map((c,i)=>(
                      <div key={i} style={{ width:10, height:10, background:c, borderRadius:2 }}/>
                    ))}
                    <span>Mais</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Cards de estatísticas */}
          {loading ? (
            <div style={{ color: C.textDark, fontSize:14 }}>Carregando dados...</div>
          ) : (
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <StatCard label="Usuários Ativos"                    value={stats.totalAtivos.toLocaleString('pt-BR')}/>
              <StatCard label="Desistentes"                        value={(stats.totalDesistentes ?? 0).toLocaleString('pt-BR')}/>
              <StatCard label="Índice de Estresse Global"          value={`${stats.estresseGlobal}%`}/>
            </div>
          )}

          {/* Engajamento por equipe + evolução mensal */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            <Card title="Engajamento por Equipe" style={{ flex:1, minWidth:280 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engTeam} layout="vertical" margin={{left:10,right:10}}>
                  <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:"#fff" }}/>
                  <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:"#fff" }} width={110}/>
                  <Bar dataKey="val" fill={C.cardDark} radius={[0,4,4,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ flex:2, minWidth:320 }}>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={engMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
                  <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#fff" }}/>
                  <YAxis domain={[50,100]} tick={{ fontSize:11, fill:"#fff" }}/>
                  <Tooltip/>
                  <Legend wrapperStyle={{ fontSize:11, color:"#fff" }}/>
                  {deptKeys.map((k, i) => (
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

          {/* Desempenho por departamento */}
          <Card title="Desempenho por Departamento — Mês Atual">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perfDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
                <XAxis dataKey="dept" tick={{ fontSize:11, fill:"#fff" }}/>
                <YAxis tick={{ fontSize:12, fill:"#fff" }}/>
                <Bar dataKey="val" fill={C.cardDark} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {perfDept.map(d=><DeptCard key={d.dept} name={d.dept} val={d.val}/>)}
          </div>

          {/* Estresse + Radar */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-start" }}>
            <Card title="Nível de Estresse por Equipe" style={{ flex:1, minWidth:280 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stressDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
                  <XAxis dataKey="dept" tick={{ fontSize:11, fill:"#fff" }}/>
                  <YAxis tick={{ fontSize:11, fill:"#fff" }}/>
                  <Bar dataKey="val" fill={C.cardDark} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ flex:1, minWidth:280 }}>
              <div style={{ fontSize:13, fontWeight:700, color: C.textDark, marginBottom:12 }}>
                Análise Multidimensional por Departamento
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid/>
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize:11, fill: C.textDark }}/>
                  {radarDepts.map((dept, i) => (
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
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
