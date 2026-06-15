import pool from '../config/db.js'

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

export async function getAdminDashboard(req, res) {
  try {
    const [{ rows: dadosRows }, { rows: countRows }] = await Promise.all([
      pool.query('SELECT * FROM admin_dados WHERE id = 1'),
      pool.query("SELECT COUNT(*)::int AS total FROM users WHERE role = 'user'"),
    ])

    if (!dadosRows.length)
      return res.status(404).json({ erro: 'Dashboard não configurado' })

    const d = dadosRows[0]
    res.json({
      stats: {
        ...d.stats,
        totalAtivos: countRows[0].total,
      },
      engTeam:    d.eng_team,
      engMensal:  d.eng_mensal,
      perfDept:   d.perf_dept,
      stressDept: d.stress_dept,
      radar:      d.radar,
    })
  } catch (err) {
    console.error('[admin] getAdminDashboard:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar dashboard' })
  }
}

// ── MISSÕES ──────────────────────────────────────────────────────────────────

export async function getAdminMissoes(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM missoes ORDER BY id')
    res.json(rows)
  } catch (err) {
    console.error('[admin] getAdminMissoes:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar missões' })
  }
}

export async function createAdminMissao(req, res) {
  const { tipo, dados } = req.body
  if (!tipo || !dados)
    return res.status(400).json({ erro: 'tipo e dados são obrigatórios' })
  if (!['equipe', 'individual'].includes(tipo))
    return res.status(400).json({ erro: 'tipo deve ser "equipe" ou "individual"' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO missoes (tipo, dados) VALUES ($1, $2) RETURNING *',
      [tipo, dados]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('[admin] createAdminMissao:', err.message)
    res.status(500).json({ erro: 'Erro ao criar missão' })
  }
}

export async function updateAdminMissao(req, res) {
  const id = Number(req.params.id)
  const { tipo, dados } = req.body
  if (!tipo || !dados)
    return res.status(400).json({ erro: 'tipo e dados são obrigatórios' })
  if (!['equipe', 'individual'].includes(tipo))
    return res.status(400).json({ erro: 'tipo deve ser "equipe" ou "individual"' })
  try {
    const { rows } = await pool.query(
      'UPDATE missoes SET tipo=$1, dados=$2 WHERE id=$3 RETURNING *',
      [tipo, dados, id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Missão não encontrada' })
    res.json(rows[0])
  } catch (err) {
    console.error('[admin] updateAdminMissao:', err.message)
    res.status(500).json({ erro: 'Erro ao atualizar missão' })
  }
}

export async function deleteAdminMissao(req, res) {
  const id = Number(req.params.id)
  try {
    const { rowCount } = await pool.query('DELETE FROM missoes WHERE id=$1', [id])
    if (!rowCount) return res.status(404).json({ erro: 'Missão não encontrada' })
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] deleteAdminMissao:', err.message)
    res.status(500).json({ erro: 'Erro ao excluir missão' })
  }
}

// ── RECOMPENSAS ───────────────────────────────────────────────────────────────

export async function getAdminRecompensas(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM recompensas ORDER BY id')
    res.json(rows)
  } catch (err) {
    console.error('[admin] getAdminRecompensas:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar recompensas' })
  }
}

export async function createAdminRecompensa(req, res) {
  const { nome, custo, imagem } = req.body
  if (!nome || custo == null)
    return res.status(400).json({ erro: 'nome e custo são obrigatórios' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO recompensas (nome, custo, imagem) VALUES ($1, $2, $3) RETURNING *',
      [nome, Number(custo), imagem || null]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('[admin] createAdminRecompensa:', err.message)
    res.status(500).json({ erro: 'Erro ao criar recompensa' })
  }
}

export async function updateAdminRecompensa(req, res) {
  const id = Number(req.params.id)
  const { nome, custo, imagem } = req.body
  if (!nome || custo == null)
    return res.status(400).json({ erro: 'nome e custo são obrigatórios' })
  try {
    const { rows } = await pool.query(
      'UPDATE recompensas SET nome=$1, custo=$2, imagem=$3 WHERE id=$4 RETURNING *',
      [nome, Number(custo), imagem || null, id]
    )
    if (!rows.length) return res.status(404).json({ erro: 'Recompensa não encontrada' })
    res.json(rows[0])
  } catch (err) {
    console.error('[admin] updateAdminRecompensa:', err.message)
    res.status(500).json({ erro: 'Erro ao atualizar recompensa' })
  }
}

export async function deleteAdminRecompensa(req, res) {
  const id = Number(req.params.id)
  try {
    const { rowCount } = await pool.query('DELETE FROM recompensas WHERE id=$1', [id])
    if (!rowCount) return res.status(404).json({ erro: 'Recompensa não encontrada' })
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin] deleteAdminRecompensa:', err.message)
    res.status(500).json({ erro: 'Erro ao excluir recompensa' })
  }
}

// ── BENEFICIÁRIOS ─────────────────────────────────────────────────────────────

const BENE_SELECT = `
  SELECT
    u.id, u.name, u.email, u.role, u.telefone,
    p.nivel, p.streak, p.carepoints, p.equipe_id, p.avatar, p.ranking_ativo,
    e.nome  AS equipe_nome,
    e.emoji AS equipe_emoji
  FROM users u
  LEFT JOIN app_profiles p  ON p.user_id   = u.id
  LEFT JOIN equipes      e  ON e.equipe_id = p.equipe_id
`

export async function getAdminBeneficiarios(req, res) {
  const search = req.query.search ?? ''
  try {
    const { rows } = await pool.query(
      `${BENE_SELECT}
       WHERE ($1 = '' OR u.name ILIKE $2 OR u.email ILIKE $2)
       ORDER BY u.id`,
      [search, `%${search}%`]
    )
    res.json(rows)
  } catch (err) {
    console.error('[admin] getAdminBeneficiarios:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar beneficiários' })
  }
}

export async function getAdminBeneficiarioById(req, res) {
  const id = Number(req.params.id)
  try {
    const { rows: users } = await pool.query(
      `${BENE_SELECT} WHERE u.id = $1`,
      [id]
    )
    if (!users.length) return res.status(404).json({ erro: 'Usuário não encontrado' })

    const { rows: historico } = await pool.query(
      'SELECT * FROM historico_carepoints WHERE user_id=$1 ORDER BY id DESC LIMIT 20',
      [id]
    )

    res.json({ ...users[0], historico })
  } catch (err) {
    console.error('[admin] getAdminBeneficiarioById:', err.message)
    res.status(500).json({ erro: 'Erro ao buscar beneficiário' })
  }
}
