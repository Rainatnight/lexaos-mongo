import dotenv from 'dotenv'
import { Request, Response } from 'express'

import { errorsCodes } from '@constants/common'
import { createId } from '@helpers/createId'

import Users from '@models/Users/Users'

dotenv.config()

export class AuthController {
  constructor() {}

  async signup(req: Request, res: Response) {
    try {
      const { login, password } = req.body

      if (!login || !password) return

      const existingUser = await Users.findOne({ login }).lean()
      if (existingUser) return res.status(401).json({ msg: 'User already exists' })
      await Users.create({ _id: createId(), login, password })

      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      return res.status(500).json({ code: errorsCodes.SOMETHING_WRONG })
    }
  }
}
