import pool from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function getUsersColumns() {
  const { rows } = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'`
  )

  return new Set(rows.map((row) => row.column_name))
}

function pickPhoneColumn(columns) {
  if (columns.has('telefone')) return 'telefone'
  if (columns.has('phone')) return 'phone'
  return null
}

function pickCpfColumn(columns) {
  if (columns.has('cpf')) return 'cpf'
  return null
}

export async function login(req, res) {
  const email = req.body?.email?.trim()?.toLowerCase()
  const password = req.body?.password?.trim()

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' })
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [email]
    )

    const user = rows[0]

    console.log('Usuário encontrado?', !!user)

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    console.log('Senha digitada:', password)
    console.log('Senha no banco:', user.password)

    const isHash =
      typeof user.password === 'string' &&
      user.password.startsWith('$2')

    const validPassword = isHash
      ? bcrypt.compareSync(password, user.password)
      : password === user.password

    console.log('É hash?', isHash)
    console.log('Senha válida?', validPassword)

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    if (!isHash) {
      const newHash = bcrypt.hashSync(password, 10)
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [newHash, user.id]
      )
      console.log('Senha migrada para hash bcrypt')
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function getProfile(req, res) {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    const columns = await getUsersColumns()
    const phoneColumn = pickPhoneColumn(columns)
    const cpfColumn = pickCpfColumn(columns)

    const selectFields = ['id', 'name', 'email', 'role']

    if (phoneColumn) {
      selectFields.push(phoneColumn)
    }

    if (cpfColumn) {
      selectFields.push(cpfColumn)
    }

    const { rows } = await pool.query(
      `SELECT ${selectFields.join(', ')} FROM users WHERE id = $1`,
      [userId]
    )

    const user = rows[0]

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cpf: cpfColumn ? user[cpfColumn] ?? '' : '',
        telefone: phoneColumn ? user[phoneColumn] ?? '' : '',
      },
    })
  } catch (err) {
    console.error('Erro ao buscar perfil:', err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export async function updateProfile(req, res) {
  const name = req.body?.name?.trim()
  const email = req.body?.email?.trim()?.toLowerCase()
  const telefone = req.body?.telefone?.trim()
  const currentPassword = req.body?.currentPassword?.trim()
  const newPassword = req.body?.newPassword?.trim()

  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' })
    }

    const columns = await getUsersColumns()
    const phoneColumn = pickPhoneColumn(columns)

    const { rows } = await pool.query(
      'SELECT id, password FROM users WHERE id = $1',
      [userId]
    )

    const currentUser = rows[0]

    if (!currentUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const updates = []
    const values = []

    if (typeof name === 'string' && name.length > 0 && columns.has('name')) {
      values.push(name)
      updates.push(`name = $${values.length}`)
    }

    if (typeof email === 'string' && email.length > 0 && columns.has('email')) {
      values.push(email)
      updates.push(`email = $${values.length}`)
    }

    if (typeof telefone === 'string' && phoneColumn) {
      values.push(telefone)
      updates.push(`${phoneColumn} = $${values.length}`)
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Informe a senha atual para alterar a senha' })
      }

      const isValid = bcrypt.compareSync(currentPassword, currentUser.password)

      if (!isValid) {
        return res.status(401).json({ message: 'Senha atual inválida' })
      }

      values.push(bcrypt.hashSync(newPassword, 10))
      updates.push(`password = $${values.length}`)
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo válido para atualizar' })
    }

    values.push(userId)

    const { rows: updatedRows } = await pool.query(
      `UPDATE users
          SET ${updates.join(', ')}
        WHERE id = $${values.length}
    RETURNING id, name, email, role${phoneColumn ? `, ${phoneColumn}` : ''}`,
      values
    )

    const updatedUser = updatedRows[0]

    return res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        telefone: phoneColumn ? updatedUser[phoneColumn] ?? '' : '',
      },
    })
  } catch (err) {
    if (err?.code === '23505') {
      return res.status(409).json({ message: 'E-mail já está em uso' })
    }

    console.error('Erro ao atualizar perfil:', err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}