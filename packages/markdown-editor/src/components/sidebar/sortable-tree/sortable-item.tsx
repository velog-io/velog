import { CSSProperties, forwardRef, useEffect, useState } from 'react'
import cn from 'clsx'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '.'
import { classes, indentStyle } from '../style'
import type { SortableItemProps } from './types'

import useOutsideClick from '@/hooks/use-outside-click'
import { createPortal } from 'react-dom'
import { ControlMenu } from '../sidebar-controller'
import { ControlInput } from '../sidebar-controller/control-input'
import { useModal } from '@/contexts/modal'
import { CustomEventDetail } from '@/types'
import { nextraCustomEventName } from '@/index'

export const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>((props, ref) => {
  const { isDragging, overItem, setOverItem } = useDndTree()
  const { focusedItem, setFocusedItem, showMenuId, setShowMenuId } = useSidebar()
  const [mousePosition, setMousePosition] = useState({ top: 0, left: 0 })
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const { onOpen, onClose, isConfirm, mode } = useModal()

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
  } = props

  const isControlAction = ['newPage', 'newFolder', 'newSeparator'].includes(item.type)
  const active =
    !isDragging && !isControlAction && !isGhost && [route, `${route}/`].includes(item.route + '/')
  // const isLink = 'withIndexPage' in item && item.withIndexPage

  const isShowMenu = showMenuId === item.id
  const isSeparator = item.type === 'separator'

  const actionMap: Record<string, ActionType> = {
    newPage: 'page',
    newFolder: 'folder',
    newSeparator: 'separator',
  }

  useEffect(() => {
    // setItem info
    if (isGhost) return
    if (!isOver) return
    setOverItem({ ...item, transform })
  }, [isOver, isGhost])

  useEffect(() => {
    // deleteItem
    if (!isConfirm) return
    if (mode !== 'deleteSortableItem') return
    onDeleteItem()
    onClose()
  }, [isConfirm])

  const onOpenMenu = (e: MouseEvent) => {
    e.preventDefault()
    if (item.name === 'index') return
    if (showMenuId === item.id) {
      setShowMenuId(null)
    } else {
      setMousePosition({ top: e.clientY, left: e.clientX })
      setShowMenuId(item.id)
    }
  }

  const onCloseMenu = (e?: MouseEvent) => {
    e?.preventDefault()
    if (item.id !== showMenuId) return
    setShowMenuId(null)
  }

  const onDelete = () => {
    onCloseMenu()
    onOpen('deleteSortableItem')
  }

  const onEdit = () => {
    onCloseMenu()
    setIsEdit(!isEdit)
  }

  const onDeleteItem = () => {
    if (showMenuId !== item.id) return
    const event = new CustomEvent<CustomEventDetail['deleteItemStartEvent']>(
      nextraCustomEventName.deleteItemStartEvent,
      {
        detail: {
          urlSlug: item.route,
        },
      },
    )
    window.dispatchEvent(event)
  }

  const wrapperStyle: CSSProperties = {
    listStyle: 'none',
    paddingLeft: indentStyle(depth, indentationWidth),
  }

  const cancelTransform = [overItem?.name !== 'index']

  if (cancelTransform.every(Boolean)) {
    Object.assign(wrapperStyle, style)
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
      {createPortal(
        <ControlMenu
          ref={menuRef}
          isOpen={showMenuId === item.id}
          position={mousePosition}
          onEdit={onEdit}
          onDelete={onDelete}
        />,
        document.getElementById('menu-root')!,
      )}
      <div
        ref={ref}
        {...handleProps}
        className={cn(
          'nx-flex nx-w-full nx-items-center nx-justify-between nx-gap-2 nx-text-left',
          isSeparator && 'nx-cursor-default',
          isSeparator ? classes.separator : classes.link,
          !isControlAction && active && classes.active,
          !isControlAction && !active && classes.inactive,
          !isControlAction && !isDragging && !active && classes.inactiveBgColor,
          isGhost && classes.ghost,
          clone && classes.clone,
          isShowMenu && classes.showMenuActive,
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
        {isControlAction || isEdit ? (
          <ControlInput type={actionMap[item.type]} />
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
