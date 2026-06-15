import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from '../config/db.js'

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

export async function getMissoes(req, res) {
  try {
    // Retorna a missão mais recente por tipo (equipe / individual)
    const { rows } = await pool.query(
      'SELECT DISTINCT ON (tipo) id, tipo, dados FROM missoes ORDER BY tipo, id DESC'
    )
    const result = {}
    for (const row of rows) {
      result[row.tipo] = { missao_id: row.id, ...row.dados }
    }
    res.json(result)
  } catch (err) {
    console.error('[data] getMissoes:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar missões' })
  }
}

export async function getMissaoProgresso(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT m.tipo, mp.item_id
         FROM missao_progresso mp
         JOIN missoes m ON m.id = mp.missao_id
        WHERE mp.user_id = $1`,
      [req.user.id]
    )
    const progresso = {}
    for (const row of rows) {
      progresso[`${row.tipo}_${row.item_id}`] = true
    }
    res.json(progresso)
  } catch (err) {
    console.error('[data] getMissaoProgresso:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar progresso' })
  }
}

export async function concluirMissaoItem(req, res) {
  const { tipo, item_id } = req.body
  if (!tipo || item_id == null)
    return res.status(400).json({ erro: 'tipo e item_id são obrigatórios' })
  if (!['equipe', 'individual'].includes(tipo))
    return res.status(400).json({ erro: 'tipo inválido' })

  try {
    const { rows } = await pool.query(
      'SELECT id, dados FROM missoes WHERE tipo = $1 ORDER BY id DESC LIMIT 1',
      [tipo]
    )
    if (!rows.length)
      return res.status(404).json({ erro: 'Missão não encontrada' })

    const missaoId = rows[0].id
    const item = rows[0].dados?.itens?.find(i => i.id === Number(item_id))

    await pool.query(
      `INSERT INTO missao_progresso (user_id, missao_id, item_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [req.user.id, missaoId, Number(item_id)]
    )

    res.json({ ok: true, pontos: item?.pontos ?? 0 })
  } catch (err) {
    console.error('[data] concluirMissaoItem:', err.message)
    res.status(500).json({ erro: 'Erro ao registrar conclusão' })
  }
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
