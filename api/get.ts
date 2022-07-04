import { VercelApiHandler } from '@vercel/node'

import { PrismaClient } from '@prisma/client'

const api: VercelApiHandler = async (req, res) => {
  const prisma = new PrismaClient()

  // get all available inventories
  const inventories = await prisma.inventory.findMany({
    where: {
      stock: {
        not: 0,
      },
    },
  })

  return res.status(200).send(inventories)
}

export default api
