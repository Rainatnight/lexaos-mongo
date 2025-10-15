import { Router } from 'express'
import { Server } from 'socket.io'

import { AuthController } from '@controllers/auth'

import { authStrict } from '@middleware/auth.middleware'

export function createAuthRouter(): Router {
  const authRouter = Router()
  const authController = new AuthController()

  // authRouter.post('/signin', authController.signup)
  authRouter.post('/create', authController.signup)

  return authRouter
}
