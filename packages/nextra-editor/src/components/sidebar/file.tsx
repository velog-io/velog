import cn from 'clsx'
import { ReactElement, useEffect } from 'react'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useFSRoute } from '@/nextra/hooks'
import { PageItem, SortableItem } from '@/nextra/normalize-pages'

import { useRouter } from 'next/router'
import { useMenu } from '@/contexts'
import AddInputs from './sidebar-controller/add-inputs'
import { classes } from './style'
import { MenuItemProps } from './menu'
import { useDndTree } from './sortable-tree'

type FileProps = {
  item: SortableItem
} & MenuItemProps

export function File({ item, ...props }: FileProps): ReactElement {
  const { setFocusedItem } = useSidebar()
  const { isDragging, setDragItem } = useDndTree()
  const route = useFSRoute()
  const router = useRouter()

  const { setDraggableNodeRef, setDroppableNodeRef, attributes, isDragTarget, isOver, listeners } =
    props

  // It is possible that the item doesn't have any route - for example an external link.
  const active = !isDragTarget && item.route && [route, route + '/'].includes(item.route + '/')
  const { setMenu } = useMenu()

  if (['newPage', 'newFolder', 'newSeparator'].includes(item.type)) {
    const map: Record<string, ActionType> = {
      newPage: 'page',
      newFolder: 'folder',
      newSeparator: 'separator',
    }
    return <AddInputs type={map[item.type]} />
  }

  useEffect(() => {
    if (!isDragTarget) return
    setDragItem(item)
  }, [isDragTarget])

  return (
    <>
      <li
        className={cn(
          classes.list,
          { active },
          isDragTarget && classes.drag,
          isOver && classes.over,
        )}
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
