import { Fragment, FunctionComponent } from 'react'
import { Item, ItemProps } from './Item'

export interface PlaneContentProps {
  loading: boolean
  table: {
    col: number
    row: number
  }
  items: ItemProps['item'][][]
}

export const PlaneContent: FunctionComponent<PlaneContentProps> = props => {
  const { loading, items } = props
  return (
    <Fragment>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="font-mono text-lg">Loading...</h1>
        </div>
      ) : (
        <table className="w-full h-full">
          {items.map((row, i) => (
            <tr key={`table-row-${i}`}>
              {row.map(item => (
                <Item key={`item-${item.id}`} item={item} />
              ))}
            </tr>
          ))}
        </table>
      )}
    </Fragment>
  )
}
