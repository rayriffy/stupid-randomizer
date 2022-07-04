import { VercelApiHandler } from '@vercel/node'

import { PrismaClient } from '@prisma/client'

const api: VercelApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { inventoryId } = req.body

    // code

    const prisma = new PrismaClient()

    const itemStock = await prisma.inventory.findUnique({
      where: {
        id: inventoryId,
      },
      select: {
        stock: true,
      },
    })

    if (itemStock === null || itemStock.stock === 0) {
      return res.status(200).send({ success: false })
    } else {
      const itemUpdate = await prisma.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          stock: itemStock.stock - 1,
        },
      })

      const itemHistory = await prisma.history.create({
        data: {
          inventoryId: inventoryId,
        },
      })
    }

    return res.status(200).send({ success: true })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api

/**
 * Input
 * {
 *   "inventoryId": 2
 * }
 *
 * Output
 * {
 *   "success": true
 * }
 */
