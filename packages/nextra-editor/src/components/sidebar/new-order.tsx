import cn from 'clsx'
import { useDroppable } from '@dnd-kit/core'
import { SortableItem } from '../../nextra/normalize-pages'
import { useDndTree } from './dnd-tree'

type NewOrderProps = {
  item: SortableItem
}

const NewOrder = ({ item }: NewOrderProps) => {
  const { dragItem } = useDndTree()
  const { isOver } = useDroppable({
    id: `${item.id}.newOrders`,
  })

  if (!dragItem) return null
  return (
    <li className={cn('nx-opacity-80')} style={{ background: 'gold' }}>
      {dragItem.title}
    </li>
  )
}

export default NewOrder
