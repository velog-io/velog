import { CSSProperties, forwardRef, useEffect } from 'react'
import cn from 'clsx'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '.'
import { classes, indentStyle } from '../style'
import type { SortableTreeComponentProps } from './types'
import AddInputs from '../sidebar-controller/add-inputs'
import { MAX_DEPTH } from './utils'

export const SortableComponent = forwardRef<HTMLDivElement, SortableTreeComponentProps>(
  (props, ref) => {
    const { isDragging, overItem, setOverItem } = useDndTree()
    const { setFocusedItem } = useSidebar()
    const router = useRouter()
    const routeOriginal = useFSRoute()
    const [route] = routeOriginal.split('#')

    const {
      wrapperRef,
      handleProps,
      isGhost,
      depth,
      style,
      indentationWidth,
      item,
      onCollapse,
      clone,
      previousItem,
      isOver,
      transform,
    } = props

    const active = !isGhost && [route, route + '/'].includes(item.route + '/')
    // const isLink = 'withIndexPage' in item && item.withIndexPage

    if (['newPage', 'newFolder', 'newSeparator'].includes(item.type)) {
      const map: Record<string, ActionType> = {
        newPage: 'page',
        newFolder: 'folder',
        newSeparator: 'separator',
      }
      return <AddInputs type={map[item.type]} />
    }

    useEffect(() => {
      if (isGhost) return
      if (!isOver) return
      setOverItem({ ...item, transform })
    }, [isOver, isGhost])

    const isSeparator = item.type === 'separator'

    const wrapperStyle: CSSProperties = {
      listStyle: 'none',
      paddingLeft: indentStyle(depth, indentationWidth),
    }

    const cancelTransform = [overItem?.name !== 'index']

    if (cancelTransform.every(Boolean)) {
      Object.assign(wrapperStyle, style)
    }

    if (isGhost && overItem?.transform && transform && previousItem) {
      const isUpper = overItem?.transform.y > transform?.y
      const isUnder = overItem?.transform.y < transform?.y
      console.log('--------------------------------')
      console.log('overItem?.transform.y, transform?.y', overItem?.transform.y, transform?.y)
      console.log('isUpper', isUpper)
      console.log('isUnder', isUnder)
      console.log('--------------------------------')
      let newDepth = depth
      if (isUpper && previousItem.collapsed) {
        newDepth = previousItem.depth + 1
      }

      if (isUpper && !previousItem.collapsed) {
        newDepth = previousItem.depth
      }

      if (isUnder && overItem.collapsed) {
        newDepth = overItem.depth + 1
      }

      if (isUnder && !overItem.collapsed) {
        newDepth = overItem.depth
      }

      Object.assign(wrapperStyle, {
        paddingLeft: indentStyle(Math.min(newDepth, MAX_DEPTH), indentationWidth),
      })
    }

    if (isGhost && overItem?.id === item.id) return null

    return (
      <li
        {...handleProps}
        ref={wrapperRef}
        onClick={() => onCollapse(item.id)}
        style={wrapperStyle}
      >
        <div
          ref={ref}
          {...handleProps}
          className={cn(
            'nx-flex nx-w-full nx-items-center nx-justify-between nx-gap-2 nx-text-left',
            isSeparator && 'cursor-default',
            isSeparator ? classes.separator : classes.link,
            active ? classes.active : classes.inactive,
            !isDragging && !active && classes.inactiveBgColor,
            isGhost && classes.ghost,
            clone && classes.clone,
            isOver && classes.over,
          )}
          onClick={(e) => {
            e.preventDefault()
            if (isGhost) return
            if (isSeparator) return
            router.push(item.route, item.route, { shallow: true })
            setFocusedItem(item)
          }}
        >
          <div className={cn('nx-w-full nx-px-2 nx-py-1.5 [word-break:keep-all]')}>
            {item.title}
          </div>
          {item.kind === 'Folder' && (
            <ArrowRightIcon
              onClick={() => onCollapse(item.id)}
              className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
              pathClassName={cn(
                'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
                !isGhost && item.collapsed && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
              )}
            />
          )}
        </div>
      </li>
    )
  },
)
