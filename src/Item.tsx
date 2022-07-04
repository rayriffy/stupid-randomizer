import { memo, useState } from 'react'

import { CheckIcon } from '@heroicons/react/solid'
import { Spinner } from './Spinner'

export interface ItemProps {
  item: {
    id: string
    inventory: {
      id: string
      name: string
      rarity: string
    } | null
  }
}

export const Item = memo<ItemProps>(props => {
  const { item } = props

  const [progress, setProgress] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async () => {
    setProgress(true)

    await fetch('/api/submitItem', {
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inventoryId: item.inventory?.id,
      }),
    }).catch(e => {
      console.error(e)
    })

    setSubmitted(true)
    setProgress(false)
  }

  return (
    <td
      className={`border-4 border-white text-center align-middle ${
        item.inventory === null
          ? ''
          : item.inventory.rarity === 'r'
          ? 'bg-green-400'
          : item.inventory.rarity === 'sr'
          ? 'bg-blue-400'
          : 'bg-yellow-400'
      }`}
    >
      {progress === false && submitted === false ? (
        <span
          className="opacity-100 font-medium text-xl p-4 cursor-pointer"
          onClick={() => onSubmit()}
        >
          {item.inventory?.name}
        </span>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          {progress ? (
            <Spinner />
          ) : (
            <CheckIcon className="w-8 h-8 text-gray-900" />
          )}
        </div>
      )}
    </td>
  )
})
