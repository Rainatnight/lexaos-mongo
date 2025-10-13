import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { Server } from 'socket.io'

import { errorsCodes } from '@constants/common'

dotenv.config()

export class AuthController {
  io: Server

  constructor(io: Server) {
    this.io = io
  }

  async signup(req: Request, res: Response) {
    try {
      console.log(1)

      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      return res.status(500).json({ code: errorsCodes.SOMETHING_WRONG })
    }
  }
}
