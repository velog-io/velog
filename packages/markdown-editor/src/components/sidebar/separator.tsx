import cn from 'clsx'
import { ReactElement } from 'react'
import { SortableItem } from '@/nextra/normalize-pages'
import { MenuItemProps } from './menu'

type SeparatorProps = {
  item: SortableItem
} & MenuItemProps

export function Separator({ item, ...props }: SeparatorProps): ReactElement {
  const { title } = item

  const { setDraggableNodeRef, setDroppableNodeRef, attributes, listeners } =
    props


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
