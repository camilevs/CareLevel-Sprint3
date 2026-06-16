// back_end/app.js
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import dataRoutes from './src/routes/dataRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/api', dataRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

export default app
