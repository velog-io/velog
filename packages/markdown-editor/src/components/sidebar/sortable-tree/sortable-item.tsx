import { CSSProperties, forwardRef, useEffect, useState } from 'react'
import cn from 'clsx'
import { EditActionInfo, PageType, useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '.'
import { classes, indentStyle } from '../style'
import type { SortableItemProps } from './types'
import useOutsideClick from '@/hooks/use-outside-click'
import { createPortal } from 'react-dom'
import { ControlMenu, ControlInput } from '../sidebar-header'
import { useModal } from '@/contexts/modal'
import { CustomEventDetail } from '@/types'
import { nextraCustomEventName } from '@/index'

export const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>((props, ref) => {
  const { isDragging, overItem, setOverItem } = useDndTree()
  const {
    focusedItem,
    setFocusedItem,
    showMenuId,
    setShowMenuId,
    setActionInfo,
    actionInfo,
    isEditAction,
  } = useSidebar()
  const { onOpen: onOpenModal, onClose: onCloseModal, isConfirm, mode } = useModal()
  const [mousePosition, setMousePosition] = useState({ top: 0, left: 0 })
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDeleteTarget, setIsDeleteTarget] = useState<boolean>(false)

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

  const isAction = ['newPage', 'newFolder', 'newSeparator'].includes(item.type) || isEdit
  const active =
    !isDragging && !isAction && !isGhost && [route, `${route}/`].includes(item.route + '/')
  // const isLink = 'withIndexPage' in item && item.withIndexPage

  const isShowMenu = showMenuId === item.id
  const isSeparator = item.type === 'separator'

  const actionMap: Record<string, PageType> = {
    newPage: 'page',
    newFolder: 'folder',
    newSeparator: 'separator',
  }

  // setItem info
  useEffect(() => {
    if (isGhost) return
    if (!isOver) return
    setOverItem({ ...item, transform })
  }, [isOver, isGhost])

  // deleteItem
  useEffect(() => {
    if (!isConfirm) return
    if (mode !== 'deleteSortableItem') return
    if (!isDeleteTarget) return
    onDispatchDeleteEvent()
    onCloseModal()
  }, [isConfirm])

  useEffect(() => {
    if (!isEdit) return
    // Dispached by other component
    if (actionInfo === null || !isEditAction(actionInfo)) {
      setIsEdit(false)
      return
    }

    // Check if the editing item is different
    const editActionInfo = actionInfo as EditActionInfo
    if (editActionInfo.pageUrlSlug === item.urlSlug) return
    setIsEdit(false)
  }, [actionInfo, isEdit])

  const onOpenMenu = (e: MouseEvent) => {
    e.preventDefault()
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
    setIsDeleteTarget(true)
    onOpenModal('deleteSortableItem')
  }

  const onEdit = () => {
    onCloseMenu()
    setIsEdit(!isEdit)
    setActionInfo<'edit'>({ action: 'edit', pageUrlSlug: item.urlSlug ?? item.id })
  }

  const onDispatchDeleteEvent = () => {
    const event = new CustomEvent<CustomEventDetail['deleteItemEvent']>(
      nextraCustomEventName.deleteItemEvent,
      {
        detail: {
          pageUrlSlug: item.urlSlug ?? item.id, // urlSlug가 없는 경우 id로 대체
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
          isIndex={item.name === 'index'}
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
          !isAction && active && classes.active,
          !isAction && !active && classes.inactive,
          !isAction && !isDragging && !active && classes.inactiveBgColor,
          isGhost && classes.ghost,
          clone && classes.clone,
          isShowMenu && classes.showMenuActive,
          isAction && '!nx-pr-0',
        )}
        onClick={(e) => {
          e.preventDefault()
          if ([isGhost, isSeparator, isAction].some(Boolean)) return

          if (!item.collapsed) {
            onCollapse(item.id)
          } else if (focusedItem?.id === item.id) {
            onCollapse(item.id)
          }

          setFocusedItem(item)
          router.push(item.route, item.route, { shallow: true })
        }}
      >
        {isAction ? (
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
