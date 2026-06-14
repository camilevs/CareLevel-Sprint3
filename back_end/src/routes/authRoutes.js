import { Router } from 'express'
import { getProfile, login, updateProfile } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/login', login)
router.get('/me', authMiddleware, getProfile)
router.patch('/me', authMiddleware, updateProfile)

export default router