import { Router } from 'express'
import { Server } from 'socket.io'

import { AuthController } from '@controllers/auth'

import { authStrict } from '@middleware/auth.middleware'

export function createAuthRouter(): Router {
  const authRouter = Router()
  const authController = new AuthController()

  authRouter.post('/create', authController.signup)
  authRouter.get('/user', authStrict, authController.getUser)
  return authRouter
}
