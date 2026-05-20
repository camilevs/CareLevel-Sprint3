import React, { useState, useCallback } from "react";
import "./Quiz.css";
import { saveResult } from "./services/moodStorage";

const PERGUNTAS = [
  {
    id: 1,
    texto: "Como você acordou hoje?",
    opcoes: ["Muito cansado(a)", "Cansado(a)", "Normal", "Bem", "Muito bem"],
  },
  {
    id: 2,
    texto: "Ao longo do dia, como esteve sua capacidade de concentração?",
    opcoes: ["Muito baixa", "Baixa", "Regular", "Boa", "Muito boa"],
  },
  {
    id: 3,
    texto: "Em algum momento do dia você se sentiu sobrecarregado(a)?",
    opcoes: ["Extremamente", "Bastante", "Moderadamente", "Levemente", "Não"],
  },
  {
    id: 4,
    texto: "Como foi o seu nível de paciência hoje ao lidar com pessoas ou tarefas?",
    opcoes: ["Muito baixa", "Baixa", "Normal", "Alta", "Muito alta"],
  },
  {
    id: 5,
    texto: "Você conseguiu fazer pausas ao longo do dia?",
    opcoes: ["Não consegui", "Quase não consegui", "Poucas vezes", "Sim, algumas vezes", "Sim, várias vezes"],
  },
  {
    id: 6,
    texto: "Como esteve o seu humor durante o dia?",
    opcoes: ["Muito negativo", "Negativo", "Neutro", "Positivo", "Muito positivo"],
  },
  {
    id: 7,
    texto: "Como foi seu nível de produtividade hoje?",
    opcoes: ["Nada produtivo", "Pouco produtivo", "Moderadamente produtivo", "Produtivo", "Muito produtivo"],
  },
  {
    id: 8,
    texto: "Você sentiu algum cansaço físico incomum ao realizar tarefas normais?",
    opcoes: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"],
  },
  {
    id: 9,
    texto: "Hoje você conseguiu se desconectar mentalmente do trabalho em algum momento?",
    opcoes: ["Não", "Quase nunca", "Pouco", "Parcialmente", "Sim"],
  },
  {
    id: 10,
    texto: "Sentiu que pequenas tarefas do dia pareceram mais difíceis do que o normal?",
    opcoes: ["Muito", "Frequentemente", "Às vezes", "Raramente", "Não"],
  },
  {
    id: 11,
    texto: "Como você avaliaria seu nível de estresse hoje?",
    opcoes: ["Muito alto", "Alto", "Moderado", "Baixo", "Muito baixo"],
  },
  {
    id: 12,
    texto: "Ao final do dia, como você se sente emocionalmente?",
    opcoes: ["Muito mal", "Mal", "Neutro", "Bem", "Muito bem"],
  },
];

const TOTAL = PERGUNTAS.length;

function pesoDeResposta(indiceOpcao) {
  return indiceOpcao + 1;
}

function calcularStatus(pesos) {
  if (pesos.length < TOTAL) return null;
  const media = pesos.reduce((acc, v) => acc + v, 0) / pesos.length;
  if (media <= 2) return "Estressado";
  if (media <= 3) return "Cansado";
  if (media <= 4) return "Normal";
  return "Excelente";
}

export default function Quiz({ onVoltar, onComplete }) {
  const [iniciado,    setIniciado]    = useState(false);
  const [indice,      setIndice]      = useState(0);
  const [pesos,       setPesos]       = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [status,      setStatus]      = useState(null);
  const [respondendo, setRespondendo] = useState(false);

  const avancarPergunta = useCallback((novoIndice) => {
    setIndice(novoIndice);
  }, []);

  const registrarResposta = useCallback(
    (opcao, indiceOpcao) => {
      if (respondendo || pesos.length >= TOTAL) return;

      setRespondendo(true);
      setSelecionada(opcao);

      setTimeout(() => {
        const peso          = pesoDeResposta(indiceOpcao);
        const novosPesos    = [...pesos, peso];
        const proximoIndice = indice + 1;

        setPesos(novosPesos);
        setSelecionada(null);
        setRespondendo(false);

        if (proximoIndice < TOTAL) {
          avancarPergunta(proximoIndice);
        } else {
          const resultado = calcularStatus(novosPesos);
          const media     = novosPesos.reduce((a, v) => a + v, 0) / novosPesos.length;

          saveResult(resultado, media);

          setStatus(resultado);
          avancarPergunta(TOTAL);
        }
      }, 180);
    },
    [respondendo, pesos, indice, avancarPergunta]
  );

  const reiniciar = useCallback(() => {
    setIniciado(false);
    setIndice(0);
    setPesos([]);
    setSelecionada(null);
    setStatus(null);
    setRespondendo(false);
  }, []);

  const handleVoltar = useCallback(() => {
    if (onComplete) onComplete();
    else if (onVoltar) onVoltar();
  }, [onComplete, onVoltar]);

  if (!iniciado) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-title-bar">CareMood©</div>
          <div className="quiz-body intro-body">
            <p className="intro-text">
              Tire um momento para você. Vamos avaliar como você está se sentindo hoje
              por meio de um curto questionário que ajuda a monitorar seu humor e sua
              rotina emocional.
            </p>
            <button className="quiz-btn-iniciar" onClick={() => setIniciado(true)}>
              INICIAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (indice >= TOTAL) {
    const media = pesos.length
      ? (pesos.reduce((a, v) => a + v, 0) / pesos.length).toFixed(1)
      : "—";

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-title-bar">CareMood©</div>
          <div className="quiz-body intro-body">
            <p className="intro-text">
              🎉 Questionário finalizado!<br />
              {status && (
                <>
                  Seu estado emocional de hoje é: <strong>{status}</strong><br />
                  Média das respostas: <strong>{media} / 5</strong>
                </>
              )}
            </p>
            <div className="fim-botoes">
              <button className="quiz-btn-voltar" onClick={handleVoltar}>
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const perguntaAtual = PERGUNTAS[indice];
  const progresso     = (indice / TOTAL) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-card">

        <div className="quiz-title-bar">CareMood©</div>

        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progresso}%` }} />
        </div>
        <span className="quiz-progress-label">
          {indice + 1} / {TOTAL}
        </span>

        <div className="quiz-body">
          <div className="pergunta-box">
            <span className="badge">Pergunta {perguntaAtual.id}</span>
            <p className="pergunta-texto">{perguntaAtual.texto}</p>

            <div className="opcoes">
              {perguntaAtual.opcoes.map((opcao, i) => (
                <button
                  key={i}
                  className={`opcao-btn ${selecionada === opcao ? "opcao-selecionada" : ""}`}
                  onClick={() => registrarResposta(opcao, i)}
                  disabled={respondendo}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
