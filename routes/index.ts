import { Router } from 'express'
import { Server } from 'socket.io'

import { createAuthRouter } from './auth'

enum RouterVariants {
  authRouter = 'authRouter',
}

export function createRoutes(io: Server): Record<RouterVariants, Router> {
  const authRouter = createAuthRouter()
  return {
    authRouter,
  }
}
