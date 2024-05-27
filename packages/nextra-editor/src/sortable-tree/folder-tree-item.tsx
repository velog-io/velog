import cn from 'clsx'
import React, { forwardRef, useEffect, useState } from 'react'
import type { TreeItemComponentProps, FlattenedItem } from './types'
import { ArrowRightIcon } from '../nextra/icons'
import { useFSRoute } from '../nextra/hooks'
import { useConfig } from '../contexts'
import { useRouter } from 'next/router'

const TreeState: Record<string, boolean> = Object.create(null)

const classes = {
  link: cn(
    'nx-flex nx-rounded nx-text-sm nx-transition-colors [word-break:break-word]',
    'nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border',
  ),
  inactive: cn(
    'nx-text-gray-500 hover:nx-text-gray-900',
    'dark:nx-text-neutral-400 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
    'contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50',
  ),
  active: cn(
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  list: cn('nx-w-full nx-flex nx-flex-col nx-gap-1'),
  border: cn(
    'nx-relative  before:nx-inset-y-1',
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    'ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0',
  ),
  drag: cn(
    'nx-transform-gpu nx-w-full nx-max-h-px nx-overflow-hidden nx-bg-primary-50 nx-opcity-80',
  ),
  over: cn(''),
}

function flattenParents<T>(parent: FlattenedItem<T> | null): FlattenedItem<T>[] {
  if (!parent) return []
  return [...flattenParents(parent.parent), parent]
}

export const FolderTreeItemWrapper = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TreeItemComponentProps<Record<string, any>>>
>((props, ref) => {
  const config = useConfig()
  const router = useRouter()

  const {
    clone,
    depth,
    disableSelection,
    disableInteraction,
    disableSorting,
    ghost,
    handleProps,
    indentationWidth,
    indicator,
    collapsed,
    onCollapse,
    onRemove,
    item,
    wrapperRef,
    style,
    isLast,
    parent,
    hideCollapseButton,
    childCount,
    manualDrag,
    showDragHandle,
    disableCollapseOnItemClick,
    className,
    contentClassName,
    isOver,
    isOverParent,
    isDragging,
    ...rest
  } = props

  const routeOriginal = useFSRoute()
  const [route] = routeOriginal.split('#')
  const active = [route, route + '/'].includes(item.route + '/')
  const activeRouteInside: boolean = active || route.startsWith(item.route + '/')

  const open =
    TreeState[item.route] === undefined ? active || activeRouteInside : TreeState[item.route]

  useEffect(() => {
    const updateTreeState = () => {
      if (activeRouteInside) {
        TreeState[item.route] = true
      }
    }
    const updateAndPruneTreeState = () => {
      if (activeRouteInside) {
        TreeState[item.route] = true
      } else {
        delete TreeState[item.route]
      }
    }
    config.sidebar.autoCollapse ? updateAndPruneTreeState() : updateTreeState()
  }, [activeRouteInside, item.route, config.sidebar.autoCollapse])

  const rerender = useState({})[1]

  return (
    <li
      {...rest}
      className={cn(
        'nx-relative nx-mt-1 nx-w-full nx-items-center nx-justify-between nx-pr-1 nx-text-left',
        classes.border,
        disableSelection && 'dnd-sortable-tree_simple_disable-selection',
        disableInteraction && 'dnd-sortable-tree_simple_disable-interaction',
        className,
      )}
      style={{
        ...style,
        width: '100%',
        minWidth: '250px',
        paddingLeft: clone ? indentationWidth : indentationWidth * depth,
        // background: props.isDragging ? 'red' : '',
        display: 'flex',
        flexDirection: 'row',
      }}
      ref={wrapperRef}
    >
      <div
        className={cn(
          'nx-flex nx-w-full nx-items-center nx-justify-between',
          'nx-px-2 nx-py-1.5',
          classes.link,
          active ? classes.active : classes.inactive,
          !active && 'hover:nx-bg-gray-100 dark:hover:nx-bg-primary-100/5',
          'dnd-sortable-tree_simple_wrapper',
          clone && 'dnd-sortable-tree_simple_clone',
          ghost && 'dnd-sortable-tree_simple_ghost',
          { active, open },
        )}
        onClick={(e) => {
          e.preventDefault()
          router.push(item.route, item.route, { shallow: true })
          const clickedToggleIcon = ['svg', 'path'].includes(
            (e.target as HTMLElement).tagName.toLowerCase(),
          )
          if (clickedToggleIcon) {
            e.preventDefault()
          }
          if (active) return
          TreeState[item.route] = !open
          rerender({})
        }}
      >
        <div
          className={cn('dnd-sortable-tree_folder_tree-item', contentClassName)}
          ref={ref}
          {...(manualDrag ? undefined : handleProps)}
          onClick={disableCollapseOnItemClick ? undefined : onCollapse}
        >
          {props.children}
        </div>
        {item.kind === 'Folder' && (
          <span onClick={disableCollapseOnItemClick ? undefined : onCollapse}>
            <ArrowRightIcon
              className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
              pathClassName={cn(
                'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
                open && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
              )}
            />
          </span>
        )}
      </div>
    </li>
  )
}) as <T>(
  p: React.PropsWithChildren<TreeItemComponentProps<T> & React.RefAttributes<HTMLDivElement>>,
) => React.ReactElement
