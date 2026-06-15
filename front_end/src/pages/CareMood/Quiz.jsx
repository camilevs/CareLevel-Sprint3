import React, { useState, useCallback, useEffect } from "react";
import "./Quiz.css";
import { saveResult, getTodayString, getHistory } from "./services/moodStorage";
import { resgatarCaremoodPoints } from "../../services/api";

/* ─── Constants ──────────────────────────────────────────────── */
const CAREMOOD_POINTS_KEY = "caremood_points_claimed";
function jaResgatouHoje() {
  try { return localStorage.getItem(CAREMOOD_POINTS_KEY) === getTodayString(); }
  catch { return false; }
}
function marcarResgateHoje() {
  try { localStorage.setItem(CAREMOOD_POINTS_KEY, getTodayString()); } catch {}
}

function statusColor(status) {
  const map = { Estressado: "#ef4444", Cansado: "#f59e0b", Normal: "#67B99F", Excelente: "#22c55e" };
  return map[status] || "#67B99F";
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;
}

/* ─── Location Data ──────────────────────────────────────────── */
const LOCAIS = [
  {
    id:1, key:"sono", tema:"Sono", icone:"🌙", cor:"#6366f1",
    localizacao:"Ilha do Descanso",
    descricao:"Como você acordou hoje?",
    tipo:"slider",
    opcoes:[
      {emoji:"🥴",label:"Exausto",peso:1},
      {emoji:"😪",label:"Cansado",peso:2},
      {emoji:"😐",label:"Normal",peso:3},
      {emoji:"🙂",label:"Bem",peso:4},
      {emoji:"😴",label:"Descansado",peso:5},
    ],
  },
  {
    id:2, key:"energia", tema:"Energia", icone:"⚡", cor:"#f59e0b",
    localizacao:"Torre de Energia",
    descricao:"Qual é o nível da sua bateria hoje?",
    tipo:"bateria",
    opcoes:[
      {emoji:"💀",label:"Descarregado",peso:1},
      {emoji:"🪫",label:"No limite",peso:2},
      {emoji:"🔋",label:"Meia carga",peso:3},
      {emoji:"🔋",label:"Carregado",peso:4},
      {emoji:"⚡",label:"Máxima energia",peso:5},
    ],
  },
  {
    id:3, key:"foco", tema:"Foco", icone:"🎯", cor:"#0ea5e9",
    localizacao:"Arena do Foco",
    descricao:"Qual é seu nível de concentração?",
    tipo:"alvo",
    opcoes:[
      {label:"Sem foco",peso:1},
      {label:"Disperso",peso:2},
      {label:"Vai e volta",peso:3},
      {label:"No alvo",peso:4},
      {label:"Águia total",peso:5},
    ],
  },
  {
    id:4, key:"motivacao", tema:"Motivação", icone:"🔥", cor:"#ef4444",
    localizacao:"Vulcão da Motivação",
    descricao:"Qual é o seu combustível hoje?",
    tipo:"chamas",
    opcoes:[
      {emoji:"❄️",label:"Congelado",peso:1},
      {emoji:"💨",label:"Ventinho fraco",peso:2},
      {emoji:"🕯️",label:"Chama acesa",peso:3},
      {emoji:"🔥",label:"Empolgado",peso:4},
      {emoji:"🚀",label:"No foguete!",peso:5},
    ],
  },
  {
    id:5, key:"estresse", tema:"Estresse", icone:"😤", cor:"#f97316",
    localizacao:"Caverna da Pressão",
    descricao:"Como está a pressão interna?",
    tipo:"emojis_grandes",
    opcoes:[
      {emoji:"💣",label:"Explodindo",peso:1},
      {emoji:"🌋",label:"Prestes a erupcionar",peso:2},
      {emoji:"😬",label:"Apertado",peso:3},
      {emoji:"🏄",label:"Surfando bem",peso:4},
      {emoji:"🌊",label:"Calmo",peso:5},
    ],
  },
  {
    id:6, key:"carga", tema:"Carga de Trabalho", icone:"📦", cor:"#8b5cf6",
    localizacao:"Armazém das Tarefas",
    descricao:"Como está o peso das demandas?",
    tipo:"pilha",
    opcoes:[
      {emoji:"🗻",label:"Esmagador",peso:1},
      {emoji:"🏋️",label:"Muito pesado",peso:2},
      {emoji:"📦",label:"Pesado",peso:3},
      {emoji:"🎒",label:"Administrável",peso:4},
      {emoji:"🪶",label:"Leve",peso:5},
    ],
  },
  {
    id:7, key:"equipe", tema:"Equipe", icone:"🤝", cor:"#10b981",
    localizacao:"Aldeia da Equipe",
    descricao:"Como está a vibração com a equipe?",
    tipo:"cartas",
    opcoes:[
      {emoji:"😤",label:"Muito ruim",peso:1},
      {emoji:"😶",label:"Distante",peso:2},
      {emoji:"🤝",label:"Normal",peso:3},
      {emoji:"😊",label:"Bem",peso:4},
      {emoji:"🥳",label:"Excelente",peso:5},
    ],
  },
  {
    id:8, key:"equilibrio", tema:"Equilíbrio", icone:"⚖️", cor:"#06b6d4",
    localizacao:"Templo do Equilíbrio",
    descricao:"Vida pessoal vs. trabalho — como está a balança?",
    tipo:"balanca",
    opcoes:[
      {label:"Preso no trabalho",peso:1,tilt:-35},
      {label:"Trabalho invadiu tudo",peso:2,tilt:-18},
      {label:"Mais ou menos",peso:3,tilt:0},
      {label:"Consegui pausar",peso:4,tilt:12},
      {label:"Equilíbrio perfeito",peso:5,tilt:0,estrela:true},
    ],
  },
  {
    id:9, key:"humor", tema:"Humor", icone:"😊", cor:"#ec4899",
    localizacao:"Jardim das Emoções",
    descricao:"Qual emoção melhor descreve você hoje?",
    tipo:"emojis_grandes",
    opcoes:[
      {emoji:"😞",label:"Mal",peso:1},
      {emoji:"😔",label:"Pra baixo",peso:2},
      {emoji:"😐",label:"Neutro",peso:3},
      {emoji:"🙂",label:"Bem",peso:4},
      {emoji:"😄",label:"Feliz",peso:5},
    ],
  },
  {
    id:10, key:"bemestar", tema:"Bem-estar Geral", icone:"✨", cor:"#7c3aed",
    localizacao:"Santuário do Bem-estar",
    descricao:"Como você avalia seu bem-estar geral hoje?",
    tipo:"clima",
    opcoes:[
      {emoji:"⛈️",label:"Tempestade total",peso:1},
      {emoji:"🌧️",label:"Nublado",peso:2},
      {emoji:"⛅",label:"Parcialmente nublado",peso:3},
      {emoji:"🌤️",label:"Quase ensolarado",peso:4},
      {emoji:"☀️",label:"Sol radiante",peso:5},
    ],
  },
];

const TOTAL = LOCAIS.length;

/* ─── Core Calculations ──────────────────────────────────────── */
function calcularStatus(pesos) {
  const media = pesos.reduce((a,v) => a+v, 0) / pesos.length;
  if (media <= 2) return "Estressado";
  if (media <= 3) return "Cansado";
  if (media <= 4) return "Normal";
  return "Excelente";
}

function statusConfig(status) {
  const map = {
    Excelente: { emoji:"🌟", cor:"#22c55e", msg:"Você está radiante! Continue cultivando esse bem-estar." },
    Normal:    { emoji:"😊", cor:"#67B99F", msg:"Dia equilibrado. Você está bem no seu ritmo!" },
    Cansado:   { emoji:"😴", cor:"#f59e0b", msg:"Cuide-se! Um bom descanso pode fazer maravilhas." },
    Estressado:{ emoji:"💛", cor:"#ef4444", msg:"Respira fundo. Busque apoio — você não está sozinho(a)." },
  };
  return map[status] || map["Normal"];
}

function getTitulo(media) {
  const m = parseFloat(media);
  if (m >= 4.5) return "Mestre do Bem-estar";
  if (m >= 3.5) return "Guardião do Equilíbrio";
  if (m >= 2.5) return "Viajante em Jornada";
  if (m >= 1.5) return "Guerreiro Resiliente";
  return "Herói da Superação";
}

/* ─── Interaction: Slider (Sono) ─────────────────────────────── */
function SliderInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-slider-container">
      <div className="ms-slider-track">
        {local.opcoes.map((op) => (
          <button
            key={op.peso}
            className={`ms-slider-stop ${selected === op.peso ? "ms-stop-sel" : ""}`}
            style={selected === op.peso ? { "--sc": local.cor } : {}}
            onClick={() => onSelect(op.peso)}
            type="button"
          >
            <div className="ms-stop-knob" />
            <div className="ms-stop-emoji">{op.emoji}</div>
            <div className="ms-stop-label">{op.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Interaction: Battery (Energia) ────────────────────────── */
const BATTERY_COLORS = ["#ef4444","#f97316","#f59e0b","#84cc16","#22c55e"];

function BatteryInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-battery-container">
      <div className="ms-battery-wrap">
        <div className="ms-battery-shell">
          <div className="ms-battery-tip" />
          <div className="ms-battery-body">
            {[5,4,3,2,1].map((nivel) => {
              const active = selected && selected >= nivel;
              const isSelected = selected === nivel;
              return (
                <button
                  key={nivel}
                  className={`ms-battery-seg ${active ? "ms-seg-active" : ""} ${isSelected ? "ms-seg-current" : ""}`}
                  style={active ? { background: BATTERY_COLORS[nivel-1] } : {}}
                  onClick={() => onSelect(nivel)}
                  type="button"
                />
              );
            })}
          </div>
        </div>
        {selected && (
          <div className="ms-battery-readout">
            <span className="ms-battery-pct" style={{ color: BATTERY_COLORS[selected-1] }}>
              {["20%","40%","60%","80%","100%"][selected-1]}
            </span>
            <span className="ms-battery-label">{local.opcoes[selected-1].label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Interaction: Target / Foco ─────────────────────────────── */
function TargetInteraction({ local, onSelect, selected }) {
  const W = 220, CX = 110, CY = 110;
  const radii = [100, 80, 60, 40, 22];
  const labels = ["Sem foco","Disperso","Vai e volta","No alvo","Águia total"];

  return (
    <div className="ms-target-container">
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} className="ms-target-svg">
        {radii.map((r, i) => {
          const peso = 5 - i;
          const isSel = selected === peso;
          const fills = ["#0f1115","#12141c","#141620","#161825","#18192a"];
          return (
            <circle
              key={peso}
              cx={CX} cy={CY} r={r}
              fill={isSel ? local.cor + "35" : fills[i]}
              stroke={isSel ? local.cor : `rgba(255,255,255,${0.06 + i * 0.04})`}
              strokeWidth={isSel ? 2.5 : 1.5}
              style={{ cursor:"pointer", filter: isSel ? `drop-shadow(0 0 10px ${local.cor}88)` : "none", transition:"all 0.2s" }}
              onClick={(e) => { e.stopPropagation(); onSelect(peso); }}
            />
          );
        })}
        <circle cx={CX} cy={CY} r={8}
          fill={selected === 5 ? local.cor : "rgba(255,255,255,0.2)"}
          stroke={selected === 5 ? "white" : "rgba(255,255,255,0.15)"}
          strokeWidth={1.5}
          style={{ cursor:"pointer" }}
          onClick={(e) => { e.stopPropagation(); onSelect(5); }}
        />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
          fontSize={12} fill="rgba(255,255,255,0.5)" style={{ pointerEvents:"none", userSelect:"none" }}>
          🎯
        </text>
      </svg>
      <div className="ms-target-pills">
        {labels.map((label, i) => {
          const peso = i + 1;
          const isSel = selected === peso;
          return (
            <button key={peso} className={`ms-target-pill ${isSel ? "ms-tpill-sel" : ""}`}
              style={isSel ? { borderColor: local.cor, color: local.cor, background: local.cor + "22" } : {}}
              onClick={() => onSelect(peso)} type="button">
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Interaction: Flames (Motivação) ───────────────────────── */
const FLAME_DATA = [
  { peso:1, h:28, emoji:"❄️", tint:"#60a5fa" },
  { peso:2, h:44, emoji:"💨", tint:"#94a3b8" },
  { peso:3, h:62, emoji:"🕯️", tint:"#fb923c" },
  { peso:4, h:80, emoji:"🔥", tint:"#ef4444" },
  { peso:5, h:96, emoji:"🚀", tint:"#f59e0b" },
];

function FlameInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-flames-container">
      {FLAME_DATA.map((f) => {
        const isSel = selected === f.peso;
        return (
          <button key={f.peso}
            className={`ms-flame-btn ${isSel ? "ms-flame-sel" : ""}`}
            style={isSel ? { "--fc": f.tint, borderColor: f.tint, background: f.tint + "20" } : {}}
            onClick={() => onSelect(f.peso)} type="button">
            <div className="ms-flame-tower" style={{ height: 110 }}>
              <div className="ms-flame-body" style={{ height: f.h }}>
                <span className="ms-flame-icon" style={{ fontSize: 18 + f.h * 0.2 }}>
                  {f.emoji}
                </span>
                {isSel && <div className="ms-flame-glow" style={{ background: f.tint }} />}
              </div>
            </div>
            <div className="ms-flame-label" style={isSel ? { color: f.tint } : {}}>
              {local.opcoes[f.peso - 1].label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Interaction: Large Emojis (Estresse, Humor) ─────────────── */
function EmojiGrandeInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-emoji-grande-grid">
      {local.opcoes.map((op) => {
        const isSel = selected === op.peso;
        return (
          <button key={op.peso}
            className={`ms-emoji-grande-btn ${isSel ? "ms-eg-sel" : ""}`}
            style={isSel ? { "--ec": local.cor, borderColor: local.cor, background: local.cor + "18" } : {}}
            onClick={() => onSelect(op.peso)} type="button">
            <span className="ms-eg-icon">{op.emoji}</span>
            <span className="ms-eg-label" style={isSel ? { color: local.cor } : {}}>{op.label}</span>
            {isSel && <div className="ms-eg-ring" style={{ borderColor: local.cor }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Interaction: Stack / Pilha (Carga) ────────────────────── */
const STACKS = [
  { peso:5, count:1, label:"Leve" },
  { peso:4, count:2, label:"Administrável" },
  { peso:3, count:3, label:"Pesado" },
  { peso:2, count:4, label:"Muito pesado" },
  { peso:1, count:5, label:"Esmagador" },
];

function PilhaInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-pilha-container">
      {STACKS.map((s) => {
        const isSel = selected === s.peso;
        return (
          <button key={s.peso}
            className={`ms-pilha-btn ${isSel ? "ms-pilha-sel" : ""}`}
            style={isSel ? { borderColor: local.cor, background: local.cor + "18" } : {}}
            onClick={() => onSelect(s.peso)} type="button">
            <div className="ms-pilha-tower">
              {Array.from({ length: s.count }).map((_, i) => (
                <div key={i} className="ms-pilha-box"
                  style={isSel ? { borderColor: local.cor + "88", background: local.cor + "25" } : {}}>
                  📦
                </div>
              ))}
            </div>
            <div className="ms-pilha-label" style={isSel ? { color: local.cor } : {}}>{s.label}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Interaction: Cards (Equipe) ───────────────────────────── */
function CartasInteraction({ local, onSelect, selected }) {
  const bgColors = ["#1f1113","#1a1414","#121a14","#101418","#0d1020"];
  return (
    <div className="ms-cartas-grid">
      {local.opcoes.map((op, i) => {
        const isSel = selected === op.peso;
        return (
          <button key={op.peso}
            className={`ms-carta ${isSel ? "ms-carta-sel" : ""}`}
            style={isSel
              ? { borderColor: local.cor, background: bgColors[i], boxShadow: `0 0 20px ${local.cor}44` }
              : { background: bgColors[i] }
            }
            onClick={() => onSelect(op.peso)} type="button">
            <span className="ms-carta-emoji">{op.emoji}</span>
            <div className="ms-carta-label" style={isSel ? { color: local.cor } : {}}>{op.label}</div>
            {isSel && (
              <div className="ms-carta-badge" style={{ background: local.cor }}>✓</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Interaction: Balance Scale (Equilíbrio) ───────────────── */
function BalancaInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-balanca-grid">
      {local.opcoes.map((op) => {
        const isSel = selected === op.peso;
        return (
          <button key={op.peso}
            className={`ms-balanca-btn ${isSel ? "ms-balanca-sel" : ""}`}
            style={isSel ? { borderColor: local.cor, background: local.cor + "18" } : {}}
            onClick={() => onSelect(op.peso)} type="button">
            <BalancaSVG tilt={op.tilt} selected={isSel} color={local.cor} estrela={op.estrela} />
            <div className="ms-balanca-label" style={isSel ? { color: local.cor } : {}}>{op.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function BalancaSVG({ tilt, selected, color, estrela }) {
  const stroke = selected ? color : "rgba(255,255,255,0.25)";
  const fill = selected ? color + "30" : "rgba(255,255,255,0.05)";
  return (
    <svg width="68" height="64" viewBox="0 0 68 64">
      <line x1="34" y1="4" x2="34" y2="48" stroke={stroke} strokeWidth="2" />
      <g transform={`rotate(${tilt}, 34, 20)`}>
        <line x1="6" y1="20" x2="62" y2="20" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="20" x2="14" y2="34" stroke={stroke} strokeWidth="1.5" />
        <rect x="6" y="34" width="16" height="5" rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
        <line x1="54" y1="20" x2="54" y2="34" stroke={stroke} strokeWidth="1.5" />
        <rect x="46" y="34" width="16" height="5" rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
      </g>
      <polygon points="24,48 44,48 40,58 28,58" fill={fill} stroke={stroke} strokeWidth="1" />
      <text x="6" y="62" fontSize="11" textAnchor="middle" fill="rgba(255,255,255,0.35)">⚙️</text>
      <text x="62" y="62" fontSize="11" textAnchor="middle" fill="rgba(255,255,255,0.35)">🌿</text>
      {estrela && selected && (
        <text x="34" y="18" fontSize="10" textAnchor="middle" fill={color}>⭐</text>
      )}
    </svg>
  );
}

/* ─── Interaction: Weather / Clima (Bem-estar) ──────────────── */
const CLIMAS = [
  { peso:1, emoji:"⛈️", bg:"#0f1720", label:"Tempestade total", particles:["⚡","🌧️","💨"] },
  { peso:2, emoji:"🌧️", bg:"#0f1922", label:"Nublado", particles:["☁️","🌧️"] },
  { peso:3, emoji:"⛅", bg:"#10202c", label:"Parcialmente\nnublado", particles:["☁️","🌤️"] },
  { peso:4, emoji:"🌤️", bg:"#0e2030", label:"Quase\nensolarado", particles:["☀️","🌸"] },
  { peso:5, emoji:"☀️", bg:"#0e1f0e", label:"Sol radiante", particles:["🌟","✨","🌈"] },
];

function ClimaInteraction({ local, onSelect, selected }) {
  return (
    <div className="ms-clima-grid">
      {CLIMAS.map((c) => {
        const isSel = selected === c.peso;
        return (
          <button key={c.peso}
            className={`ms-clima-btn ${isSel ? "ms-clima-sel" : ""}`}
            style={{
              background: isSel ? c.bg : "var(--bg-elevated)",
              borderColor: isSel ? local.cor : "var(--border)",
              boxShadow: isSel ? `0 0 20px ${local.cor}44` : "none",
            }}
            onClick={() => onSelect(c.peso)} type="button">
            <span className="ms-clima-main">{c.emoji}</span>
            <div className="ms-clima-particles">
              {c.particles.map((p, i) => (
                <span key={i} className="ms-clima-p">{p}</span>
              ))}
            </div>
            <span className="ms-clima-label" style={isSel ? { color: local.cor } : {}}>
              {c.label}
            </span>
            {isSel && <div className="ms-clima-glow" style={{ background: local.cor }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Render Interaction ─────────────────────────────────────── */
function renderInteraction(local, onSelect, selected) {
  switch (local.tipo) {
    case "slider":   return <SliderInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "bateria":  return <BatteryInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "alvo":     return <TargetInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "chamas":   return <FlameInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "pilha":    return <PilhaInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "cartas":   return <CartasInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "balanca":  return <BalancaInteraction local={local} onSelect={onSelect} selected={selected} />;
    case "clima":    return <ClimaInteraction local={local} onSelect={onSelect} selected={selected} />;
    default:         return <EmojiGrandeInteraction local={local} onSelect={onSelect} selected={selected} />;
  }
}

/* ─── Trail Map Component ────────────────────────────────────── */
function TrilhaMapa({ indiceAtual }) {
  return (
    <div className="ms-trilha-scroll">
      <div className="ms-trilha">
        {LOCAIS.map((local, i) => {
          const done   = i < indiceAtual;
          const active = i === indiceAtual;
          const locked = i > indiceAtual;
          return (
            <React.Fragment key={local.id}>
              {i > 0 && <div className={`ms-trilha-seg ${done ? "ms-seg-done" : ""}`} />}
              <div
                className={`ms-tnode ${done ? "ms-tnode-done" : active ? "ms-tnode-active" : "ms-tnode-locked"}`}
                style={active ? { "--nc": local.cor, boxShadow: `0 0 16px ${local.cor}66` } : {}}
              >
                <span className="ms-tnode-icon">
                  {done ? "✓" : locked ? "🔒" : local.icone}
                </span>
                {active && <div className="ms-tnode-pulse" style={{ background: local.cor }} />}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Radar Chart ────────────────────────────────────────────── */
function RadarChart({ pesos }) {
  const n = LOCAIS.length;
  const W = 280, cx = 140, cy = 140, maxR = 105;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  const pos = (r, i) => ({
    x: cx + r * Math.cos(start + i * step),
    y: cy + r * Math.sin(start + i * step),
  });

  const gridPoly = (level) =>
    LOCAIS.map((_, i) => {
      const p = pos((level / 5) * maxR, i);
      return `${p.x},${p.y}`;
    }).join(" ");

  const dataPolygon = pesos
    .map((p, i) => {
      const pt = pos((p / 5) * maxR, i);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  return (
    <div className="ms-radar-container">
      <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`}>
        {[1,2,3,4,5].map((l) => (
          <polygon key={l} points={gridPoly(l)} fill="none"
            stroke={`rgba(255,255,255,${0.04 + l * 0.025})`} strokeWidth="1" />
        ))}
        {LOCAIS.map((_, i) => {
          const outer = pos(maxR, i);
          return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
        })}
        <polygon points={dataPolygon}
          fill="rgba(103,185,159,0.18)"
          stroke="#67B99F" strokeWidth="2" strokeLinejoin="round" />
        {pesos.map((p, i) => {
          const pt = pos((p / 5) * maxR, i);
          return (
            <circle key={i} cx={pt.x} cy={pt.y} r="4.5"
              fill="#67B99F" stroke="white" strokeWidth="1.5" />
          );
        })}
        {LOCAIS.map((local, i) => {
          const r = maxR + 20;
          const pt = {
            x: cx + r * Math.cos(start + i * step),
            y: cy + r * Math.sin(start + i * step),
          };
          return (
            <text key={i} x={pt.x} y={pt.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="15" fill="rgba(255,255,255,0.65)"
              style={{ userSelect:"none" }}>
              {local.icone}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Modal de Anonimato ─────────────────────────────────────── */
function AnonymityModal({ onConfirm }) {
  return (
    <div className="ms-overlay">
      <div className="ms-modal-anon">
        <div className="ms-modal-icon">🔒</div>
        <h2 className="ms-modal-title">Suas respostas são seguras</h2>
        <p className="ms-modal-text">
          Suas respostas serão compartilhadas com a empresa{" "}
          <strong>apenas de forma anônima e agregada</strong>. Nenhum gestor ou líder
          terá acesso à sua identidade individual ou saberá quais respostas foram
          fornecidas por você.
        </p>
        <div className="ms-modal-garantias">
          <span>✅ 100% anônimo</span>
          <span>✅ Dados agregados</span>
          <span>✅ Ninguém te identifica</span>
        </div>
        <button className="ms-btn-primary" onClick={onConfirm} type="button">
          Entendi, vamos começar!
        </button>
      </div>
    </div>
  );
}

/* ─── Intro Screen ───────────────────────────────────────────── */
function IntroScreen({ onIniciar }) {
  return (
    <div className="ms-container">
      <div className="ms-card ms-card-intro">
        <div className="ms-intro-badge">🎮 Missão do Equilíbrio</div>
        <div className="ms-intro-hero">
          <span className="ms-intro-map-icon">🗺️</span>
          <div className="ms-intro-title-wrap">
            <h1 className="ms-intro-title">Jornada do<br />Equilíbrio</h1>
            <p className="ms-intro-subtitle">Explore 10 locais temáticos</p>
          </div>
        </div>
        <p className="ms-intro-desc">
          Percorra <strong>10 checkpoints únicos</strong> com interações visuais diferentes
          e descubra como está seu bem-estar hoje. Cada local é uma experiência nova!
        </p>
        <div className="ms-intro-locais">
          {LOCAIS.map((l) => (
            <span key={l.id} className="ms-intro-local-tag" style={{ borderColor: l.cor + "55", color: l.cor }}>
              {l.icone} {l.tema}
            </span>
          ))}
        </div>
        <div className="ms-intro-reward">
          🪙 <strong>+500 CarePoints</strong> ao completar a jornada
        </div>
        <button className="ms-btn-primary ms-btn-lg" onClick={onIniciar} type="button">
          ⚔️ Iniciar Missão
        </button>
      </div>
    </div>
  );
}

/* ─── Completion Screen ──────────────────────────────────────── */
function CompletionScreen({ pesos, status, media, jaResgatado, onVerResultados }) {
  const cfg = statusConfig(status);
  const titulo = getTitulo(media);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ms-completion-bg">
      <div className="ms-confetti-wrap">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="ms-confetti-piece"
            style={{
              "--cx": `${10 + (i * 3.7) % 80}%`,
              "--cy": `${20 + (i * 7.3) % 60}%`,
              "--cd": `${i * 0.18}s`,
              "--cc": ["#67B99F","#22c55e","#f59e0b","#0ea5e9","#ec4899","#ef4444"][i % 6],
            }} />
        ))}
      </div>

      <div className={`ms-completion-card ${show ? "ms-comp-show" : ""}`}>
        <div className="ms-comp-trophy-wrap">
          <div className="ms-comp-trophy">🏆</div>
        </div>
        <div className="ms-comp-status-circle" style={{ background: cfg.cor + "22", border: `2px solid ${cfg.cor}` }}>
          <span className="ms-comp-status-emoji">{cfg.emoji}</span>
        </div>
        <h2 className="ms-comp-headline">Missão Concluída!</h2>
        <div className="ms-comp-title-emocional" style={{ color: cfg.cor }}>
          🏅 {titulo}
        </div>
        <p className="ms-comp-status-text" style={{ color: cfg.cor }}>{status}</p>
        <p className="ms-comp-msg">{cfg.msg}</p>

        <div className="ms-comp-journey">
          {pesos.map((p, i) => (
            <div key={i} className="ms-comp-dot"
              style={{ background: LOCAIS[i].cor, opacity: 0.3 + (p / 5) * 0.7 }}
              title={LOCAIS[i].tema} />
          ))}
        </div>

        {!jaResgatado ? (
          <div className="ms-comp-points">
            <span className="ms-comp-coin">🪙</span>
            <div>
              <div className="ms-comp-pts">+500 CarePoints</div>
              <div className="ms-comp-pts-sub">conquistados hoje!</div>
            </div>
          </div>
        ) : (
          <div className="ms-comp-points ms-comp-points-ja">
            <span>✅</span>
            <span>Recompensa diária já resgatada</span>
          </div>
        )}

        <button className="ms-btn-primary ms-btn-lg" onClick={onVerResultados} type="button">
          Ver meus resultados 📊
        </button>
      </div>
    </div>
  );
}

/* ─── Result Screen ──────────────────────────────────────────── */
function ResultadoScreen({ status, media, pesos, jaResgatado, onVoltar }) {
  const cfg = statusConfig(status);
  const titulo = getTitulo(media);

  const dimensoes = pesos.map((p, i) => ({ ...LOCAIS[i], peso: p }));
  const sorted = [...dimensoes].sort((a, b) => b.peso - a.peso);
  const forcas = sorted.slice(0, 3);
  const atencao = sorted.slice(-3).reverse();

  const hist = getHistory().slice(-5).reverse();

  return (
    <div className="ms-resultado-scroll">
      <div className="ms-resultado-container">

        {/* Hero */}
        <div className="ms-res-hero" style={{ "--hcor": cfg.cor }}>
          <div className="ms-res-hero-bg" style={{ background: `radial-gradient(ellipse at top, ${cfg.cor}22 0%, transparent 70%)` }} />
          <div className="ms-res-emoji-big">{cfg.emoji}</div>
          <div className="ms-res-status-badge" style={{ background: cfg.cor + "22", border: `1.5px solid ${cfg.cor}` }}>
            <span style={{ color: cfg.cor }}>{status}</span>
          </div>
          <h1 className="ms-res-titulo">{titulo}</h1>
          <p className="ms-res-score">Pontuação média: <strong>{media}/5.0</strong></p>
          <p className="ms-res-msg">{cfg.msg}</p>
          {!jaResgatado ? (
            <div className="ms-res-points">🪙 <strong>+500 CarePoints conquistados hoje!</strong></div>
          ) : (
            <div className="ms-res-points ms-res-points-ja">✅ Recompensa diária já resgatada</div>
          )}
        </div>

        {/* Radar */}
        <div className="ms-res-section">
          <h3 className="ms-res-section-h">🕸️ Radar Emocional</h3>
          <p className="ms-res-section-sub">Visão geral das 10 dimensões avaliadas</p>
          <RadarChart pesos={pesos} />
        </div>

        {/* All dimensions bar list */}
        <div className="ms-res-section">
          <h3 className="ms-res-section-h">📊 Resumo da Jornada</h3>
          <div className="ms-res-dims">
            {dimensoes.map((d) => (
              <div key={d.key} className="ms-res-dim-row">
                <span className="ms-res-dim-icon">{d.icone}</span>
                <span className="ms-res-dim-nome">{d.tema}</span>
                <div className="ms-res-dim-bar-wrap">
                  <div className="ms-res-dim-bar" style={{ width: `${(d.peso / 5) * 100}%`, background: d.cor }} />
                </div>
                <span className="ms-res-dim-score">{d.peso}/5</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Attention */}
        <div className="ms-res-duo">
          <div className="ms-res-section ms-res-section-forcas">
            <h3 className="ms-res-section-h">💪 Pontos Fortes</h3>
            {forcas.map((f) => (
              <div key={f.key} className="ms-res-ponto-card ms-ponto-forte"
                style={{ borderLeft: `3px solid ${f.cor}` }}>
                <span className="ms-ponto-icon" style={{ background: f.cor + "22" }}>{f.icone}</span>
                <div className="ms-ponto-info">
                  <div className="ms-ponto-tema">{f.tema}</div>
                  <div className="ms-ponto-bar-wrap">
                    <div className="ms-ponto-bar" style={{ width: `${(f.peso / 5) * 100}%`, background: f.cor }} />
                  </div>
                </div>
                <span className="ms-ponto-score" style={{ color: f.cor }}>{f.peso}/5</span>
              </div>
            ))}
          </div>

          <div className="ms-res-section ms-res-section-atencao">
            <h3 className="ms-res-section-h">⚠️ Pontos de Atenção</h3>
            {atencao.map((a) => (
              <div key={a.key} className="ms-res-ponto-card ms-ponto-atencao"
                style={{ borderLeft: "3px solid #ef4444" }}>
                <span className="ms-ponto-icon" style={{ background: "#ef444422" }}>{a.icone}</span>
                <div className="ms-ponto-info">
                  <div className="ms-ponto-tema">{a.tema}</div>
                  <div className="ms-ponto-bar-wrap">
                    <div className="ms-ponto-bar" style={{ width: `${(a.peso / 5) * 100}%`, background: "#ef4444" }} />
                  </div>
                </div>
                <span className="ms-ponto-score" style={{ color: "#ef4444" }}>{a.peso}/5</span>
              </div>
            ))}
          </div>
        </div>

        {/* History comparison */}
        {hist.length > 1 && (
          <div className="ms-res-section">
            <h3 className="ms-res-section-h">📈 Comparação com Dias Anteriores</h3>
            <div className="ms-res-hist">
              {hist.map((h) => (
                <div key={h.date} className="ms-hist-row">
                  <div className="ms-hist-date">{formatDate(h.date)}</div>
                  <div className="ms-hist-bar-wrap">
                    <div className="ms-hist-bar"
                      style={{ width: `${(h.score / 5) * 100}%`, background: statusColor(h.status) }} />
                  </div>
                  <div className="ms-hist-val" style={{ color: statusColor(h.status) }}>
                    {h.score.toFixed(1)}
                  </div>
                  <div className="ms-hist-status" style={{ color: statusColor(h.status) }}>
                    {h.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="ms-btn-primary ms-btn-full" onClick={onVoltar} type="button">
          Ver dashboard completo →
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Quiz({ onVoltar, onComplete }) {
  const [fase,        setFase]        = useState("modal");
  const [indice,      setIndice]      = useState(0);
  const [pesos,       setPesos]       = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [status,      setStatus]      = useState(null);
  const [mediaFinal,  setMediaFinal]  = useState("0");
  const [jaResgatado, setJaResgatado] = useState(false);
  const [animCard,    setAnimCard]    = useState(false);

  useEffect(() => {
    if (fase === "jogando") {
      setAnimCard(true);
      const t = setTimeout(() => setAnimCard(false), 450);
      return () => clearTimeout(t);
    }
  }, [indice, fase]);

  const handleEscolha = useCallback(async (peso) => {
    if (processando) return;
    setProcessando(true);
    setSelecionada(peso);

    await new Promise((r) => setTimeout(r, 380));

    const novosPesos = [...pesos, peso];
    const proximo = indice + 1;
    setPesos(novosPesos);
    setSelecionada(null);
    setProcessando(false);

    if (proximo < TOTAL) {
      setIndice(proximo);
    } else {
      const resultado = calcularStatus(novosPesos);
      const media = novosPesos.reduce((a, v) => a + v, 0) / novosPesos.length;
      saveResult(resultado, media);

      const foiResgatado = jaResgatouHoje();
      if (!foiResgatado) {
        marcarResgateHoje();
        try { await resgatarCaremoodPoints(); } catch {}
      }

      setStatus(resultado);
      setMediaFinal(media.toFixed(1));
      setJaResgatado(foiResgatado);
      setFase("concluindo");
    }
  }, [processando, pesos, indice]);

  const handleVoltar = useCallback(() => {
    if (onComplete) onComplete();
    else if (onVoltar) onVoltar();
  }, [onComplete, onVoltar]);

  if (fase === "modal")  return <AnonymityModal onConfirm={() => setFase("intro")} />;
  if (fase === "intro")  return <IntroScreen onIniciar={() => { setFase("jogando"); setIndice(0); setPesos([]); }} />;
  if (fase === "concluindo") return (
    <CompletionScreen
      pesos={pesos} status={status} media={mediaFinal} jaResgatado={jaResgatado}
      onVerResultados={() => setFase("resultado")}
    />
  );
  if (fase === "resultado") return (
    <ResultadoScreen
      status={status} media={mediaFinal} pesos={pesos} jaResgatado={jaResgatado}
      onVoltar={handleVoltar}
    />
  );

  /* ── Fase: Jogando ── */
  const local = LOCAIS[indice];
  const progresso = ((indice + 1) / TOTAL) * 100;

  return (
    <div className="ms-container">
      <TrilhaMapa indiceAtual={indice} />

      <div className={`ms-card ms-card-local ${animCard ? "ms-card-enter" : ""}`}>
        <div className="ms-local-header" style={{ "--lc": local.cor }}>
          <div className="ms-local-header-bg" style={{ background: `linear-gradient(135deg, ${local.cor}28 0%, transparent 70%)` }} />
          <div className="ms-local-meta">
            <span className="ms-local-num">Local {local.id} / {TOTAL}</span>
            <span className="ms-local-lugar">📍 {local.localizacao}</span>
          </div>
          <div className="ms-local-icon-big">{local.icone}</div>
          <div className="ms-local-tema">{local.tema}</div>
        </div>

        <div className="ms-local-progress-track">
          <div className="ms-local-progress-fill"
            style={{ width: `${progresso}%`, background: local.cor }} />
        </div>

        <div className="ms-local-body">
          <p className="ms-local-descricao">{local.descricao}</p>
          {renderInteraction(local, handleEscolha, selecionada)}
        </div>
      </div>
    </div>
  );
}
