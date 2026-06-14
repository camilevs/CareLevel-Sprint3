// back_end/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import dataRoutes from './src/routes/dataRoutes.js'

const app = express()
const PORT = process.env.PORT || 3005

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api', dataRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`))