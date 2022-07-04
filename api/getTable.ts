import { VercelApiHandler } from '@vercel/node'

import { PrismaClient, Inventory } from '@prisma/client'
import { nanoid } from 'nanoid'
import { shuffle, chunk } from 'lodash'
import { omit } from 'lodash'

type FilledInventory = Omit<Inventory, 'stock'> | null

const api: VercelApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const col = Number(req.query.col)
    const row = Number(req.query.row)

    // code
    const prisma = new PrismaClient()

    const databaseInventories = await prisma.inventory.findMany({
      where: {
        stock: { gt: 0 },
      },
    })

    let result: FilledInventory[] = databaseInventories
      .map(o => Array.from({ length: o.stock }).map(() => omit(o, ['stock'])))
      .flat()

    //console.log(result)

    await prisma.$disconnect()

    if (result.length < row * col) {
      const nullFillCount = row * col - result.length
      for (let counter = 0; counter < nullFillCount; counter++) {
        result.push(null)
      }
    }

    result = shuffle(result)

    if (result.length > row * col) {
      result = result.slice(0, row * col)
    }

    return res.status(200).send(
      chunk(
        shuffle(
          result.map(o =>
            o === null
              ? {
                  id: nanoid(),
                  inventory: null,
                }
              : {
                  id: nanoid(),
                  inventory: {
                    id: o.id,
                    name: o.name,
                    rarity: o.rarity,
                  },
                }
          )
        ),
        col
      )
    )
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
 *   "col": 4,
 *   "row": 3
 * }
 *
 * Output
 * [
 *   [
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *   ],
 *   [
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *     {
 *       "id": "sdjasod" <- nanoid
 *       "inventory": {
 *         "id": 2,
 *         "name": "switch",
 *         "rarity": "sr"
 *       },
 *     },
 *     null,
 *     null,
 *   ],
 *   [
 *     null,
 *     null,
 *     null,
 *     null,
 *   ],
 * ]
 */
