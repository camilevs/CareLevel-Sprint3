import { Pool } from 'pg'


const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

pool.connect()
.then(() => console.log('Conectado ao PostgreSQL'))
.catch(err => console.error('Erro ao se conectar com o banco',process.env.DB_HOST, err.message))

export default pool