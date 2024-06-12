import cn from 'clsx'
import { forwardRef, useEffect } from 'react'
import { type ActionType, useSidebar } from '@/contexts/sidebar'
import { useFSRoute } from '@/nextra/hooks'
import { type PageItem } from '@/nextra/normalize-pages'
import { useRouter } from 'next/router'
import { useMenu } from '@/contexts'
import { useDndTree } from '..'
import AddInputs from '../../sidebar-controller/add-inputs'
import { classes, indentStyle } from '../../style'
import type { SortableTreeComponentProps } from '../types'

export const SortableItemFile = forwardRef<HTMLDivElement, SortableTreeComponentProps>(
  (props, ref) => {
    const { setFocusedItem } = useSidebar()
    const { isDragging, setDragItem, setOverItem, overItem } = useDndTree()
    const route = useFSRoute()
    const router = useRouter()

    const { wrapperRef, handleProps, isGhost, isOver, depth, indentationWidth, style, item } = props

    // It is possible that the item doesn't have any route - for example an external link.
    const active = !isGhost && item.route && [route, route + '/'].includes(item.route + '/')
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
      if (!isGhost) return
      setDragItem(item)
    }, [isGhost])

    useEffect(() => {
      if (isGhost) return
      if (!isOver) return
      setOverItem(item)
    }, [isOver, isGhost])

    useEffect(() => {
      console.log('overItem', overItem)
    }, [overItem])

    return (
      <li
        ref={wrapperRef}
        className={cn(
          {
            active,
          },
          classes.link,
          active ? classes.active : classes.inactive,
          !isGhost && isOver && classes.over,
          isGhost && classes.ghost,
        )}
        style={{ ...style, ...indentStyle(depth, indentationWidth) }}
      >
        <div
          ref={ref}
          {...handleProps}
          className={cn('nx-w-full nx-px-2 nx-py-1.5')}
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
            setFocusedItem(item)
          }}
          onBlur={(e) => {
            if (isDragging) {
              e.preventDefault()
              return
            }
            setFocusedItem(null)
          }}
        >
          <div>{item.title}</div>
        </div>
      </li>
    )
  },
)
