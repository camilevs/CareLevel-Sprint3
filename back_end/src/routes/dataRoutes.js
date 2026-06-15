import { Router } from 'express'
import {
  getUsuario,
  getRanking,
  getMissoes,
  getMissaoProgresso,
  concluirMissaoItem,
  getRecompensas,
  resgatarRecompensa,
  getCarepoints,
  getConquistas,
  updateDestaque,
  getCaremoodPerguntas,
  getAdmin,
} from '../controllers/dataController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/usuario', authMiddleware, getUsuario)
router.get('/ranking', authMiddleware, getRanking)
router.get('/missoes', getMissoes)
router.get('/missoes/progresso',  authMiddleware, getMissaoProgresso)
router.post('/missoes/concluir',  authMiddleware, concluirMissaoItem)
router.get('/recompensas', getRecompensas)
router.post('/recompensas/resgatar/:id', authMiddleware, resgatarRecompensa)
router.get('/carepoints', authMiddleware, getCarepoints)
router.get('/conquistas', authMiddleware, getConquistas)
router.patch('/conquistas/destaque', authMiddleware, updateDestaque)
router.get('/caremood/perguntas', getCaremoodPerguntas)
router.get('/admin', getAdmin)

export default router
