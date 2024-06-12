import {  forwardRef, useEffect } from 'react'
import cn from 'clsx'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '.'
import { classes, indentStyle } from '../style'
import type { SortableTreeComponentProps } from './types'
import AddInputs from '../sidebar-controller/add-inputs'

export const SortableComponent = forwardRef<HTMLDivElement, SortableTreeComponentProps>(
  (props, ref) => {
    const { setDragItem, isDragging } = useDndTree()
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
    } = props

    useEffect(() => {
      if (!isGhost) return
      setDragItem(item)
    }, [isGhost])

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

    const isSeparator = item.type === 'separator'
    return (
      <li
        {...handleProps}
        ref={wrapperRef}
        onClick={() => onCollapse(item.id)}
        style={{
          listStyle: 'none',
          paddingLeft: indentStyle(depth, indentationWidth),
          ...style,
        }}
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
                item.collapsed && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
              )}
            />
          )}
        </div>
      </li>
    )
  },
)
