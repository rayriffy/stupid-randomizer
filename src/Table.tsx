import { FunctionComponent, memo, useEffect, useMemo } from 'react'

export const Table: FunctionComponent = memo(props => {
  useEffect(() => {
    console.log('render')
    // @ts-ignore
    makeTransformable('.box')
  }, [])

  return <div></div>
})
