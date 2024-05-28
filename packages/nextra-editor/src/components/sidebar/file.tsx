import cn from 'clsx'
import { ReactElement, useEffect, useState } from 'react'
import { ActionType, useSidebar } from '../../contexts/sidebar'
import { useFSRoute } from '../../nextra/hooks'
import { PageItem, SortableItem } from '../../nextra/normalize-pages'
import { useDndTree } from './dnd-tree'
import { useRouter } from 'next/router'
import { useMenu } from '../../contexts'
import AddInputs from './add-inputs'
import { classes } from './style'
import { removeCodeFromRoute } from '../../utils'
import { MenuItemProps } from './menu'
import NewOrder from './new-order'

type FileProps = {
  item: SortableItem
} & MenuItemProps

export function File({ item, ...props }: FileProps): ReactElement {
  const { setFocused } = useSidebar()
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

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isOver) return
    setVisible(true)
  }, [isOver])

  return (
    <>
      {visible && <NewOrder item={item} />}
      <li
        className={cn(
          classes.list,
          { active },
          isDragTarget && classes.drag,
          isOver && classes.over,
        )}
        ref={setDroppableNodeRef}
        onMouseOut={() => setVisible(false)}
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
            setFocused?.(removeCodeFromRoute(item.route))
          }}
          onBlur={(e) => {
            if (isDragging) {
              e.preventDefault()
              return
            }
            setFocused?.(null)
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
