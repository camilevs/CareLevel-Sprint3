import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from '../config/db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../data/db.json')

// Usado só pela rota legada /api/admin (sem chamadores no front-end)
const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'))

function dataHoje() {
  const d = new Date()
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${d.getFullYear()}`
}

export async function getUsuario(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT u.name, p.nivel, p.streak, p.carepoints, p.avatar
         FROM users u
         LEFT JOIN app_profiles p ON p.user_id = u.id
        WHERE u.id = $1`,
      [req.user.id]
    )
    const row = rows[0]
    if (!row) return res.status(404).json({ erro: 'Usuário não encontrado' })

    res.json({
      nome: row.name,
      nivel: row.nivel ?? 1,
      streak: row.streak ?? 0,
      carepoints: row.carepoints ?? 0,
      avatar: row.avatar,
    })
  } catch (err) {
    console.error('[data] getUsuario:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar usuário' })
  }
}

export async function getRanking(req, res) {
  try {
    const { rows: usuarios } = await pool.query(
      `SELECT user_id AS "userId", nome, nivel, streak, carepoints,
              pontos_vitalicio AS "pontosVitalicio", equipe_id AS "equipeId"
         FROM ranking_users`
    )

    const { rows: equipes } = await pool.query(
      `SELECT equipe_id AS "equipeId", nome, emoji, carepoints FROM equipes`
    )

    const { rows: meRows } = await pool.query(
      `SELECT u.name, p.nivel, p.streak, p.carepoints, p.equipe_id AS "equipeId"
         FROM users u
         LEFT JOIN app_profiles p ON p.user_id = u.id
        WHERE u.id = $1`,
      [req.user.id]
    )
    const { rows: vitalicioRows } = await pool.query(
      `SELECT COALESCE(SUM(pontos), 0) AS total
         FROM historico_carepoints
        WHERE user_id = $1 AND pontos > 0`,
      [req.user.id]
    )

    const me = meRows[0]
    if (me) {
      usuarios.push({
        userId: 'usr_logado',
        nome: me.name,
        nivel: me.nivel ?? 1,
        streak: me.streak ?? 0,
        carepoints: me.carepoints ?? 0,
        pontosVitalicio: Number(vitalicioRows[0]?.total ?? 0),
        equipeId: me.equipeId,
      })
    }

    res.json({ usuarios, equipes })
  } catch (err) {
    console.error('[data] getRanking:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar ranking' })
  }
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
    const pontos = item?.pontos ?? 0

    const { rows: inseridas } = await pool.query(
      `INSERT INTO missao_progresso (user_id, missao_id, item_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [req.user.id, missaoId, Number(item_id)]
    )

    // Só credita pontos na primeira conclusão (evita pontuar de novo em reenvios)
    if (inseridas.length && pontos) {
      await pool.query(
        'UPDATE app_profiles SET carepoints = carepoints + $1 WHERE user_id = $2',
        [pontos, req.user.id]
      )
      await pool.query(
        `INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
         VALUES ($1, $2, $3, $4, 'credito')`,
        [req.user.id, dataHoje(), `MISSÃO: ${(item?.titulo ?? '').toUpperCase()}`, pontos]
      )
    }

    res.json({ ok: true, pontos })
  } catch (err) {
    console.error('[data] concluirMissaoItem:', err.message)
    res.status(500).json({ erro: 'Erro ao registrar conclusão' })
  }
}

export async function getRecompensas(req, res) {
  try {
    const { rows } = await pool.query('SELECT id, nome, custo, imagem FROM recompensas ORDER BY id')
    res.json(rows)
  } catch (err) {
    console.error('[data] getRecompensas:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar recompensas' })
  }
}

export async function resgatarRecompensa(req, res) {
  const id = Number(req.params.id)

  try {
    const { rows: recompensas } = await pool.query(
      'SELECT id, nome, custo FROM recompensas WHERE id = $1',
      [id]
    )
    const recompensa = recompensas[0]
    if (!recompensa) {
      return res.status(404).json({ erro: 'Recompensa não encontrada' })
    }

    const { rows: perfis } = await pool.query(
      'SELECT carepoints FROM app_profiles WHERE user_id = $1',
      [req.user.id]
    )
    const saldoAtual = perfis[0]?.carepoints ?? 0
    if (saldoAtual < recompensa.custo) {
      return res.status(400).json({ erro: 'Saldo insuficiente' })
    }

    const { rows: atualizado } = await pool.query(
      'UPDATE app_profiles SET carepoints = carepoints - $1 WHERE user_id = $2 RETURNING carepoints',
      [recompensa.custo, req.user.id]
    )

    await pool.query(
      `INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
       VALUES ($1, $2, $3, $4, 'debito')`,
      [req.user.id, dataHoje(), `RESGATE: ${recompensa.nome.toUpperCase()}`, -recompensa.custo]
    )

    const { rows: historico } = await pool.query(
      'SELECT data, atividade, pontos, tipo FROM historico_carepoints WHERE user_id = $1 ORDER BY id DESC LIMIT 20',
      [req.user.id]
    )

    res.json({ saldo: atualizado[0].carepoints, historico })
  } catch (err) {
    console.error('[data] resgatarRecompensa:', err.message)
    res.status(500).json({ erro: 'Erro ao resgatar recompensa' })
  }
}

export async function getCarepoints(req, res) {
  try {
    const { rows: perfis } = await pool.query(
      'SELECT carepoints, validade_points FROM app_profiles WHERE user_id = $1',
      [req.user.id]
    )
    const { rows: configs } = await pool.query(
      'SELECT analise FROM carepoints_config WHERE user_id = $1',
      [req.user.id]
    )
    const { rows: historico } = await pool.query(
      'SELECT data, atividade, pontos, tipo FROM historico_carepoints WHERE user_id = $1 ORDER BY id DESC LIMIT 20',
      [req.user.id]
    )

    res.json({
      saldo: perfis[0]?.carepoints ?? 0,
      validadePoints: perfis[0]?.validade_points ?? null,
      analise: configs[0]?.analise ?? [],
      historico,
    })
  } catch (err) {
    console.error('[data] getCarepoints:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar carepoints' })
  }
}

export async function getConquistas(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT destaque_atual AS "destaqueAtual", emblemas, medalhas, detalhes,
              opcoes_destaque AS "opcoesDestaque"
         FROM app_conquistas
        WHERE user_id = $1`,
      [req.user.id]
    )
    const row = rows[0]
    res.json(row ?? { destaqueAtual: '', emblemas: [], medalhas: [], detalhes: [], opcoesDestaque: [] })
  } catch (err) {
    console.error('[data] getConquistas:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar conquistas' })
  }
}

export async function updateDestaque(req, res) {
  const { destaque } = req.body
  if (!destaque) return res.status(400).json({ erro: 'Destaque obrigatório' })

  try {
    const { rows } = await pool.query(
      `UPDATE app_conquistas SET destaque_atual = $1
        WHERE user_id = $2
    RETURNING destaque_atual AS "destaqueAtual"`,
      [destaque, req.user.id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Conquistas não encontradas' })
    res.json(rows[0])
  } catch (err) {
    console.error('[data] updateDestaque:', err.message)
    res.status(500).json({ erro: 'Erro ao atualizar destaque' })
  }
}

export async function getCaremoodPerguntas(req, res) {
  try {
    const { rows } = await pool.query('SELECT id, texto, opcoes FROM caremood_perguntas ORDER BY id')
    res.json(rows)
  } catch (err) {
    console.error('[data] getCaremoodPerguntas:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar perguntas' })
  }
}

export function getAdmin(req, res) {
  res.json(db.admin)
}
