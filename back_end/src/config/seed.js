import dotenv from 'dotenv'
dotenv.config() 

import bcrypt from 'bcryptjs'
import pool from './db.js'

async function seed() {
    
  const password = bcrypt.hashSync('admin123', 10)

  await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO NOTHING`,
    ['Admin', 'admin@carelevel.com', password, 'admin']
  )

  console.log('Usuário admin criado com sucesso!')
  process.exit()
}

seed()