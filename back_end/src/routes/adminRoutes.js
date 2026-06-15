import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import {
  getAdminDashboard,
  getAdminMissoes,
  createAdminMissao,
  updateAdminMissao,
  deleteAdminMissao,
  getAdminRecompensas,
  createAdminRecompensa,
  updateAdminRecompensa,
  deleteAdminRecompensa,
  getAdminBeneficiarios,
  getAdminBeneficiarioById,
} from '../controllers/adminController.js'

const router = Router()
const guard = [authMiddleware, requireRole('admin')]

// ── Dashboard ────────────────────────────────────────────────────
router.get('/dashboard', ...guard, getAdminDashboard)

// ── Missões ──────────────────────────────────────────────────────
router.get('/missoes',        ...guard, getAdminMissoes)
router.post('/missoes',       ...guard, createAdminMissao)
router.put('/missoes/:id',    ...guard, updateAdminMissao)
router.delete('/missoes/:id', ...guard, deleteAdminMissao)

// ── Recompensas ──────────────────────────────────────────────────
router.get('/recompensas',        ...guard, getAdminRecompensas)
router.post('/recompensas',       ...guard, createAdminRecompensa)
router.put('/recompensas/:id',    ...guard, updateAdminRecompensa)
router.delete('/recompensas/:id', ...guard, deleteAdminRecompensa)

// ── Beneficiários ────────────────────────────────────────────────
router.get('/beneficiarios',      ...guard, getAdminBeneficiarios)
router.get('/beneficiarios/:id',  ...guard, getAdminBeneficiarioById)

export default router
