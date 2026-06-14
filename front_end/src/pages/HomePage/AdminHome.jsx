import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { fetchAdmin } from "../../services/api";
import Footer from "../../Components/Footer/Footer";

const C = {
  bg: "#e8f0ec",
  card: "#2d7a5f",
  cardLight: "#4aaf85",
  cardDark: "#1a4d3a",
  text: "#fff",
  textDark: "#1a3a2a",
  accent: "#6fcf97",
};

const lineColors = {
  Financeiro: "#e7e7e7",
  Marketing: "#e7e7e7",
  Operações: "#e7e7e7",
  RH: "#e7e7e7",
  TI: "#e7e7e7",
  Vendas: "#e7e7e7",
};

function ActivityMap() {
  const rows = 7, cols = 14;
  const greens = ["#c8e6c9","#81c784","#4aaf85","#2d7a5f","#1a4d3a"];
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},10px)`, gap:2 }}>
      {Array.from({length: rows*cols}).map((_,i)=>(
        <div key={i} style={{
          width:10, height:10, borderRadius:2,
          background: greens[Math.floor(Math.random()*greens.length)]
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

function Select({ label, options }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ fontSize:13, fontWeight:700, color: C.textDark }}>{label}</div>
      <select style={{
        padding:"8px 36px 8px 12px", borderRadius:8, border:"1.5px solid #b2d8c8",
        background:"#fff", fontSize:14, color: C.textDark, appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232d7a5f' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center"
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
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

const NAV_LINKS = ["Home", "Beneficiários", "Recompensas", "Missões"];

function AdminSidebar({ active, onNav }) {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 flex flex-col p-6 gap-4 z-[100] shadow-[2px_0_12px_rgba(0,0,0,0.15)]"
      style={{ background: C.cardDark }}>

      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: C.accent }} />
        <span className="font-extrabold text-base text-white tracking-[-0.5px]">CareLevel</span>
        <span className="ml-auto text-[11px] font-bold bg-white/[0.12] text-white rounded-md px-2 py-0.5">ADM</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(n => (
          <button
            key={n}
            onClick={() => onNav(n)}
            className={[
              "flex items-center gap-2 px-3 py-2.5 rounded-lg border-0 cursor-pointer text-sm font-semibold text-left w-full transition-[background,color] duration-200",
              active === n
                ? "bg-white/[0.18] text-white"
                : "bg-transparent text-white/65 hover:bg-white/10 hover:text-white",
            ].join(" ")}
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            {n}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="h-px bg-white/10" />
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-white/15">
            RH
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">Conta RH</div>
            <div className="text-[11px] text-white/50">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function HRDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeNav, setActiveNav] = useState("Home");

  useEffect(() => {
    fetchAdmin().then(setAdmin).catch(console.error);
  }, []);

  const stats = admin?.stats ?? { totalAtivos: 0, totalDesistentes: 0, estresseGlobal: 0 };

  const engTeam = (admin?.engTeam ?? []).map(d => ({ name: d.nome, val: d.engajamento }));
  const engMonth = admin?.engMensal ?? [];
  const perfDept = admin?.perfDept ?? [];
  const stressDept = admin?.stressDept ?? [];
  const radarData = (admin?.radar ?? []).map(d => ({ dim: d.dim, ...d }));

  const deptKeys = engMonth.length > 0
    ? Object.keys(engMonth[0]).filter(k => k !== 'mes')
    : Object.keys(lineColors);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background: C.bg, minHeight:"100vh", display:"flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>

      <AdminSidebar active={activeNav} onNav={setActiveNav} />

      <div style={{ marginLeft:256, flex:1, padding:"28px 32px", display:"flex", flexDirection:"column", gap:24 }}>

        <div style={{ display:"flex", alignItems:"flex-end", gap:20, flexWrap:"wrap" }}>
          <Select label="Equipe" options={["Todas"]}/>
          <Select label="Período" options={["Qualquer"]}/>
          <Select label="Unidade" options={["Todas"]}/>
          <div style={{ marginLeft:"auto" }}>
            <Card title="Mapa de Atividade" style={{ background: C.cardDark, padding:14 }}>
              <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                <ActivityMap/>
                <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:10, color:"#aaa" }}>
                  <span>Menos</span>
                  {["#c8e6c9","#81c784","#4aaf85","#2d7a5f","#1a4d3a"].map((c,i)=>(
                    <div key={i} style={{ width:10, height:10, background:c, borderRadius:2 }}/>
                  ))}
                  <span>Mais</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <StatCard label="Quantidade de Ativos" value={stats.totalAtivos.toLocaleString('pt-BR')}/>
          <StatCard label="Quantidade de Desistentes" value={stats.totalDesistentes.toLocaleString('pt-BR')}/>
          <StatCard label="Porcentagem de Estresse Global" value={`${stats.estresseGlobal}%`}/>
        </div>

        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          <Card title="Engajamento por Equipe" style={{ flex:1, minWidth:280, background: C.cardLight }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={engTeam} layout="vertical" margin={{left:10,right:10}}>
                <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:"#fff" }}/>
                <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:"#fff" }} width={70}/>
                <Bar dataKey="val" fill={C.cardDark} radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ flex:2, minWidth:320, background: C.cardLight }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={engMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
                <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#fff" }}/>
                <YAxis domain={[50,100]} tick={{ fontSize:11, fill:"#fff" }}/>
                <Tooltip/>
                <Legend wrapperStyle={{ fontSize:11, color:"#fff" }}/>
                {deptKeys.map(k=>(
                  <Line key={k} type="monotone" dataKey={k} stroke={lineColors[k] ?? "#ffffff"} dot={{ r:3 }} strokeWidth={2}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Desempenho por Departamento Mês Atual" style={{ background: C.cardLight }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perfDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33"/>
              <XAxis dataKey="dept" tick={{ fontSize:12, fill:"#fff" }}/>
              <YAxis tick={{ fontSize:12, fill:"#fff" }}/>
              <Bar dataKey="val" fill={C.cardDark} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {perfDept.map(d=><DeptCard key={d.dept} name={d.dept} val={d.val}/>)}
        </div>

        <div style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-start" }}>
          <Card title="Nível de Estresse por Equipe (Quiz)" style={{ flex:1, minWidth:280, background: C.cardLight }}>
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
                <Radar name="Financeiro" dataKey="Financeiro" stroke="#2d7a5f" fill="#2d7a5f" fillOpacity={0.3}/>
                <Radar name="RH" dataKey="RH" stroke="#f39c12" fill="#f39c12" fillOpacity={0.2}/>
                <Radar name="TI (Você)" dataKey="TI (Você)" stroke="#1a4d3a" fill="#1a4d3a" fillOpacity={0.2}/>
                <Legend wrapperStyle={{ fontSize:11 }}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
