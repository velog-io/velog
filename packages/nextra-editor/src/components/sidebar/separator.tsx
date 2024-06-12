import cn from 'clsx'
import { ReactElement, useEffect } from 'react'
import { SortableItem } from '@/nextra/normalize-pages'
import { MenuItemProps } from './menu'
import { useDndTree } from './sortable-tree'

type SeparatorProps = {
  item: SortableItem
} & MenuItemProps

export function Separator({ item, ...props }: SeparatorProps): ReactElement {
  const { title } = item
  const { setDragItem } = useDndTree()

  const { setDraggableNodeRef, setDroppableNodeRef, attributes, isDragTarget, listeners } =
    props

  useEffect(() => {
    if (!isDragTarget) return
    setDragItem(item)
  }, [isDragTarget])

  return (
    <li
      ref={setDroppableNodeRef}
      className={cn(
        '[word-break:break-word]',
        'nx-mb-2 nx-mt-5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100',
      )}
    >
      <div
        ref={setDraggableNodeRef}
        {...attributes}
        {...listeners}
        className={cn('cursor-default', 'nx-px-2 nx-py-1.5')}
      >
        {title}
      </div>
    </li>
  )
}
