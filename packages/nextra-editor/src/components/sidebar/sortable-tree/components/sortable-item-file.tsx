import cn from 'clsx'
import { ReactElement, useEffect } from 'react'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useFSRoute } from '@/nextra/hooks'
import { PageItem, SortableItem } from '@/nextra/normalize-pages'
import { useRouter } from 'next/router'
import { useMenu } from '@/contexts'

import { removeCodeFromRoute } from '@/utils'
import { useDndTree } from '..'
import AddInputs from '../../sidebar-controller/add-inputs'
import { classes, indentStyle } from '../../style'
import { SortableTreeItemProps } from '../types'

type FileProps = {
  item: SortableItem
} & SortableTreeItemProps

export function SortableItemFile({ item, ...props }: FileProps): ReactElement {
  const { setFocused } = useSidebar()
  const { isDragging, setDragItem } = useDndTree()
  const route = useFSRoute()
  const router = useRouter()

  const {
    setDraggableNodeRef,
    setDroppableNodeRef,
    attributes,
    isDragTarget,
    isOver,
    listeners,
    level,
    indentationWidth,
    style,
  } = props

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
          {
            active,
          },
          classes.link,
          active ? classes.active : classes.inactive,
          isOver && classes.over,
          isDragTarget && classes.drag,
        )}
        ref={setDroppableNodeRef}
        style={{ ...style, ...indentStyle(level, indentationWidth) }}
      >
        <div
          className={cn('nx-px-2 nx-py-1.5')}
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
