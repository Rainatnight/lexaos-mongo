import { Request, Response } from 'express'

import { errorsCodes } from '@constants/common'
import { createId } from '@helpers/createId'

import Folders from '@models/Folders/Folders'

export class FoldersController {
  constructor() {}

  async getFolders(req: Request, res: Response) {
    try {
      const { userId } = req.user as any
      const items = await Folders.find({ userId }, { createdAt: 0, updatedAt: 0, __v: 0, userId: 0 }).lean()
      const mappedItems = items.map((item) => ({
        ...item,
        id: item._id,
      }))
      res.json(mappedItems)
    } catch (error) {
      return res.status(500).json({ code: errorsCodes.SOMETHING_WRONG })
    }
  }

  async createFolder(req: Request, res: Response) {
    try {
      const { name, x, y, parentId } = req.body
      const { userId } = req.user as any

      const folder = await Folders.create({
        userId: userId,
        _id: createId(),
        type: 'folder',
        name: name || 'Новая папка',
        x: x ?? 0,
        y: y ?? 0,
        parentId: parentId ?? null,
      })

      return res.json(folder)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ code: errorsCodes.SOMETHING_WRONG })
    }
  }
}
