import { Router } from 'express'
import {
  getUsuario,
  getRanking,
  getMissoes,
  getRecompensas,
  resgatarRecompensa,
  getCarepoints,
  getConquistas,
  updateDestaque,
  getCaremoodPerguntas,
  getAdmin,
} from '../controllers/dataController.js'

const router = Router()

router.get('/usuario', getUsuario)
router.get('/ranking', getRanking)
router.get('/missoes', getMissoes)
router.get('/recompensas', getRecompensas)
router.post('/recompensas/resgatar/:id', resgatarRecompensa)
router.get('/carepoints', getCarepoints)
router.get('/conquistas', getConquistas)
router.patch('/conquistas/destaque', updateDestaque)
router.get('/caremood/perguntas', getCaremoodPerguntas)
router.get('/admin', getAdmin)

export default router
