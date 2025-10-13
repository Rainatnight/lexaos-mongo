import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { Server } from 'socket.io'

import { errorsCodes } from '@constants/common'

dotenv.config()

export class AuthController {
  constructor() {}

  async signup(req: Request, res: Response) {
    try {
      const { title } = req.body
      console.log(title)
      console.log(1)

      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      return res.status(500).json({ code: errorsCodes.SOMETHING_WRONG })
    }
  }
}
