import { forwardRef, useEffect, useState } from 'react'
import cn from 'clsx'
import { Item, SortableItem } from '@/nextra/normalize-pages'

import { useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useConfig, useMenu } from '@/contexts'
import { useFSRoute } from '@/nextra/hooks'

import { ArrowRightIcon } from '@/nextra/icons'

import { removeCodeFromRoute } from '@/utils'

import { useDndTree } from '..'
import { classes } from '../../style'
import { SortableTreeItemProps } from '../types'

let TreeState: Record<string, boolean> = Object.create(null)

type FolderProps = {
  item: SortableItem
} & SortableTreeItemProps

export const SortableItemFolder = forwardRef<HTMLDivElement, React.PropsWithChildren<FolderProps>>(
  (props, ref) => {
    const { isDragging, setDragItem } = useDndTree()
    const { isFolding, setFocused, focused: focusedRoute } = useSidebar()
    const router = useRouter()
    const { setMenu } = useMenu()
    const routeOriginal = useFSRoute()
    const [route] = routeOriginal.split('#')

    const {
      setDraggableNodeRef,
      setDroppableNodeRef,
      attributes,
      listeners,
      isDragTarget,
      isOver,
      level,
      style,
      indentationWidth,
      item,
    } = props

    const active = !isDragTarget && [route, route + '/'].includes(item.route + '/')
    const activeRouteInside: boolean = active || route.startsWith(item.route + '/')
    const focusedRouteInside = !!focusedRoute?.startsWith(item.route + '/')

    const config = useConfig()
    const { theme } = item as Item

    const open = isDragTarget
      ? false
      : TreeState[item.route] === undefined
        ? active ||
          activeRouteInside ||
          focusedRouteInside ||
          (theme && 'collapsed' in theme
            ? !theme.collapsed
            : level < config.sidebar.defaultMenuCollapseLevel)
        : TreeState[item.route] || focusedRouteInside

    const rerender = useState({})[1]

    useEffect(() => {
      const updateTreeState = () => {
        if (activeRouteInside || focusedRouteInside) {
          TreeState[item.route] = true
        }
      }
      const updateAndPruneTreeState = () => {
        if (activeRouteInside && focusedRouteInside) {
          TreeState[item.route] = true
        } else {
          delete TreeState[item.route]
        }
      }
      config.sidebar.autoCollapse ? updateAndPruneTreeState() : updateTreeState()
    }, [activeRouteInside, focusedRouteInside, item.route, config.sidebar.autoCollapse])

    useEffect(() => {
      if (!isDragTarget) return
      setDragItem(item)
    }, [isDragTarget])

    useEffect(() => {
      if (!isFolding) return
      TreeState = Object.create(null) // reset
    }, [isFolding])

    const isLink = 'withIndexPage' in item && item.withIndexPage

    const isCollapseOpen = isDragTarget || isFolding ? false : open
    // 드래그가 활성화되어 있고 타깃이면 메뉴를 숨김
    const menuVisible = isDragging && isDragTarget ? false : true

    console.log(props)
    return (
      <li
        className={cn(
          'nx-relative',
          { active, open },
          isOver && classes.over,
          isDragTarget && classes.drag,
        )}
        style={{ ...style, marginLeft: `${level * indentationWidth}px` }}
      >
        <div
          ref={setDroppableNodeRef}
          className={cn(
            'nx-w-full nx-items-center nx-justify-between nx-gap-2',
            !isLink && 'nx-w-full nx-text-left',
            classes.link,
            active ? classes.active : classes.inactive,
            !isDragging
              ? 'hover:nx-bg-blue-100 dark:hover:nx-bg-primary-100/5'
              : 'nx-bg-transparent hover:nx-bg-transparent',
            active && isDragTarget && 'nx-bg-blue-100',
            isDragTarget && classes.drag,
          )}
          onClick={(e) => {
            e.preventDefault()
            if (isDragTarget) return

            router.push(item.route, item.route, { shallow: true })
            setFocused(removeCodeFromRoute(item.route))
            const clickedToggleIcon = ['svg', 'path'].includes(
              (e.target as HTMLElement).tagName.toLowerCase(),
            )
            if (clickedToggleIcon) {
              e.preventDefault()
            }

            if (isLink) {
              if (active || clickedToggleIcon) {
                // If it's focused, we toggle it. Otherwise, always open it.

                TreeState[item.route] = !open
              } else {
                TreeState[item.route] = true
                setMenu(false)
              }
              rerender({})
              return
            }
            if (active) return
            TreeState[item.route] = !open
            rerender({})
          }}
        >
          <div
            ref={setDraggableNodeRef}
            {...attributes}
            {...listeners}
            className={cn('nx-w-full nx-px-2 nx-py-1.5 [word-break:break-word]')}
          >
            {item.title}
          </div>
          <ArrowRightIcon
            className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
            pathClassName={cn(
              'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
              open && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
            )}
          />
        </div>
        {/* <Collapse
        className={cn('ltr:nx-pr-0 rtl:nx-pl-0')}
        isOpen={isCollapseOpen}
        isDragTarget={isDragTarget}
      ></Collapse> */}
        <div ref={ref} {...attributes} {...listeners}></div>
      </li>
    )
  },
)
