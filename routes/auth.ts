import { Router } from 'express'
import { Server } from 'socket.io'

import { AuthController } from '@controllers/auth'

import { authStrict } from '@middleware/auth.middleware'

export function createAuthRouter(io: Server): Router {
  const authRouter = Router()
  const authController = new AuthController(io)

  authRouter.post('/signin', authController.signup)

  return authRouter
}
