import { useDeferredValue, useEffect, useState } from 'react'
import { PlaneContentProps } from '../PlaneContent'
import { useDebounce } from './useDebounce'

interface TableFetchReturn extends PlaneContentProps {
  refetch: () => void
}

export const useTableFetch = (
  tableCol: number,
  tableRow: number
): TableFetchReturn => {
  const col = useDebounce(tableCol, 400)
  const row = useDebounce(tableRow, 400)

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PlaneContentProps['items']>([])

  const fetchTable = async () => {
    setLoading(true)
    setItems([])

    const parsedResult = await fetch(
      `/api/getTable?col=${col}&row=${row}`
    ).then(o => o.json())
    setItems(parsedResult)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setItems([])

    fetch(`/api/getTable?col=${col}&row=${row}`).then(async o => {
      const parsed = await o.json()
      setItems(parsed)
      setLoading(false)
    })
  }, [col, row])

  const refetch = () => {
    fetchTable()
  }

  return {
    loading,
    table: {
      col,
      row,
    },
    items,
    refetch,
  }
}
