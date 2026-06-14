import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../data/db.json')

// Carregado uma vez ao iniciar — reseta ao reiniciar o servidor
const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'))

function dataHoje() {
  const d = new Date()
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${d.getFullYear()}`
}

export function getUsuario(req, res) {
  res.json(db.usuario)
}

export function getRanking(req, res) {
  const pontosVitalicio = db.historico
    .filter(h => h.pontos > 0)
    .reduce((acc, h) => acc + h.pontos, 0)

  const usuarios = db.usuarios.map(u =>
    u.userId === 'usr_logado' ? { ...u, pontosVitalicio } : u
  )

  res.json({ usuarios, equipes: db.equipes })
}

export function getMissoes(req, res) {
  res.json(db.missoes)
}

export function getRecompensas(req, res) {
  res.json(db.recompensas)
}

export function resgatarRecompensa(req, res) {
  const id = Number(req.params.id)

  const recompensa = db.recompensas.find(r => r.id === id)
  if (!recompensa) {
    return res.status(404).json({ erro: 'Recompensa não encontrada' })
  }
  if (db.usuario.carepoints < recompensa.custo) {
    return res.status(400).json({ erro: 'Saldo insuficiente' })
  }

  db.usuario.carepoints -= recompensa.custo
  db.carepoints.saldo -= recompensa.custo

  const novoId = db.historico.length > 0
    ? Math.max(...db.historico.map(h => h.id)) + 1
    : 1

  db.historico.unshift({
    id: novoId,
    data: dataHoje(),
    atividade: `RESGATE: ${recompensa.nome.toUpperCase()}`,
    pontos: -recompensa.custo,
    tipo: 'debito',
  })

  const idxLogado = db.usuarios.findIndex(u => u.userId === 'usr_logado')
  if (idxLogado !== -1) {
    db.usuarios[idxLogado].carepoints = db.usuario.carepoints
  }

  res.json({ saldo: db.usuario.carepoints, historico: db.historico })
}

export function getCarepoints(req, res) {
  res.json({ ...db.carepoints, historico: db.historico })
}

export function getConquistas(req, res) {
  res.json(db.conquistas)
}

export function updateDestaque(req, res) {
  const { destaque } = req.body
  if (!destaque) return res.status(400).json({ erro: 'Destaque obrigatório' })

  db.conquistas.destaqueAtual = destaque
  res.json({ destaqueAtual: db.conquistas.destaqueAtual })
}

export function getCaremoodPerguntas(req, res) {
  res.json(db.caremood.perguntas)
}

export function getAdmin(req, res) {
  res.json(db.admin)
}
