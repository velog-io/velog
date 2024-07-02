import { CSSProperties, forwardRef, MouseEventHandler, useEffect, useState } from 'react'
import cn from 'clsx'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '.'
import { classes, indentStyle } from '../style'
import type { SortableItemProps } from './types'
import ControlInput from '../sidebar-controller/control-input'
import ControlMenu from '../sidebar-controller/control-menu'
import useOutsideClick from '@/hooks/use-outside-click'

export const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>((props, ref) => {
  const { isDragging, overItem, setOverItem } = useDndTree()
  const { focusedItem, setFocusedItem, showMenuId, setShowMenuId } = useSidebar()
  const [isEdit, setIsEdit] = useState<boolean>(false)

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
    isOver,
    transform,
    disabled,
  } = props

  const isControlAction = ['newPage', 'newFolder', 'newSeparator'].includes(item.type)

  const active =
    !isDragging && !isControlAction && !isGhost && [route, `${route}/`].includes(item.route + '/')
  // const isLink = 'withIndexPage' in item && item.withIndexPage

  useEffect(() => {
    if (isGhost) return
    if (!isOver) return
    setOverItem({ ...item, transform })
  }, [isOver, isGhost])

  const onOpenMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (item.name === 'index') return
    if (showMenuId === item.id) {
      setShowMenuId(null)
    } else {
      setShowMenuId(item.id)
    }
  }

  const onCloseMenu = (e?: MouseEvent) => {
    e?.preventDefault()
    if (item.id !== showMenuId) return
    setShowMenuId(null)
  }

  const isSeparator = item.type === 'separator'

  const wrapperStyle: CSSProperties = {
    listStyle: 'none',
    paddingLeft: indentStyle(depth, indentationWidth),
  }

  const cancelTransform = [overItem?.name !== 'index']

  if (cancelTransform.every(Boolean)) {
    Object.assign(wrapperStyle, style)
  }

  const addActionMap: Record<string, ActionType> = {
    newPage: 'page',
    newFolder: 'folder',
    newSeparator: 'separator',
  }

  const { ref: menuRef } = useOutsideClick<HTMLDivElement>(onCloseMenu)

  return (
    <li
      {...handleProps}
      ref={wrapperRef}
      style={wrapperStyle}
      className={cn('nx-relative')}
      onContextMenu={onOpenMenu}
    >
      <ControlMenu isOpen={showMenuId === item.id} ref={menuRef} />
      <div
        ref={ref}
        {...handleProps}
        className={cn(
          'nx-flex nx-w-full nx-items-center nx-justify-between nx-gap-2 nx-text-left',
          isSeparator && 'nx-cursor-default',
          isSeparator ? classes.separator : classes.link,
          active ? classes.active : classes.inactive,
          !isControlAction && !isDragging && !active && classes.inactiveBgColor,
          isGhost && classes.ghost,
          clone && classes.clone,
          isControlAction && '!nx-pr-0',
        )}
        onClick={() => {
          if (isGhost) return
          if (isSeparator) return
          if (isEdit) return
          if (isControlAction) return

          if (!item.collapsed) {
            onCollapse(item.id)
          } else if (focusedItem?.id === item.id) {
            onCollapse(item.id)
          }

          setFocusedItem(item)
          router.push(item.route, item.route, { shallow: true })
        }}
      >
        {isControlAction ? (
          <ControlInput type={addActionMap[item.type]} />
        ) : (
          <>
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
          </>
        )}
      </div>
    </li>
  )
})
