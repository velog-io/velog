import cn from 'clsx'
import { ReactElement } from 'react'
import { PageType, useSidebar } from '@/contexts/sidebar'
import { useFSRoute } from '@/nextra/hooks'
import { PageItem, SortableItem } from '@/nextra/normalize-pages'

import { useRouter } from 'next/router'
import { useMenu } from '@/contexts'
import { ControlInput } from './sidebar-header'
import { classes } from './style'
import { MenuItemProps } from './menu'
import { useDndTree } from './sortable-tree'

type FileProps = {
  item: SortableItem
} & MenuItemProps

export function File({ item, ...props }: FileProps): ReactElement {
  const { setFocusedItem } = useSidebar()
  const { isDragging } = useDndTree()
  const route = useFSRoute()
  const router = useRouter()

  const { setDraggableNodeRef, setDroppableNodeRef, attributes, isDragTarget, listeners } = props

  // It is possible that the item doesn't have any route - for example an external link.
  const active = !isDragTarget && item.route && [route, route + '/'].includes(item.route + '/')
  const { setMenu } = useMenu()

  if (['newPage', 'newFolder', 'newSeparator'].includes(item.type)) {
    const map: Record<string, PageType> = {
      newPage: 'page',
      newFolder: 'folder',
      newSeparator: 'separator',
    }
    return <ControlInput type={map[item.type]} />
  }

  return (
    <>
      <li
        className={cn(classes.list, { active }, isDragTarget && classes.ghost)}
        ref={setDroppableNodeRef}
      >
        <div
          className={cn(
            'nx-px-2 nx-py-1.5',
            classes.link,
            !isDragging && active ? classes.active : classes.inactive,
          )}
          onClick={(e) => {
            if (isDragging) {
              e.preventDefault()
              return
            }
            router.push((item as PageItem).href || item.route)
            setMenu(false)
          }}
          onFocus={(e) => {
            if (isDragging) {
              e.preventDefault()
              return
            }
            setFocusedItem?.(item)
          }}
          onBlur={(e) => {
            if (isDragging) {
              e.preventDefault()
              return
            }
            setFocusedItem?.(null)
          }}
        >
          <div {...attributes} {...listeners} ref={setDraggableNodeRef}>
            {item.title}
          </div>
        </div>
      </li>
    </>
  )
}
