import cn from 'clsx'
import React, { forwardRef } from 'react'

import { TreeItemComponentProps } from './types'
import { PageItem } from '../nextra/normalize-pages'
import { ArrowRightIcon } from '../nextra/icons'

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

export const SimpleTreeItemWrapper = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TreeItemComponentProps<PageItem>>
>((props, ref) => {
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
    hideCollapseButton,
    childCount,
    manualDrag,
    showDragHandle,
    disableCollapseOnItemClick,
    isLast,
    parent,
    className,
    contentClassName,
    isOver,
    isOverParent,
    isDragging,
    ...rest
  } = props

  return (
    <li
      ref={wrapperRef}
      {...rest}
      className={cn(
        'nx-w-full nx-items-center nx-justify-between nx-gap-2 nx-pr-1 nx-text-left',
        classes.link,
        collapsed ? classes.active : classes.inactive,
        'hover:nx-bg-blue-100 dark:hover:nx-bg-primary-100/5',
        'dnd-sortable-tree_simple_wrapper',
        clone && 'dnd-sortable-tree_simple_clone',
        ghost && 'dnd-sortable-tree_simple_ghost',
        disableSelection && 'dnd-sortable-tree_simple_disable-selection',
        disableInteraction && 'dnd-sortable-tree_simple_disable-interaction',
        className,
      )}
      style={{
        ...style,
        width: '100%',
        minWidth: '250px',
        border: '1px solid red',
        paddingLeft: clone ? indentationWidth : indentationWidth * depth,
      }}
    >
      <div
        className={cn('dnd-sortable-tree_simple_tree-item', contentClassName)}
        ref={ref}
        {...(manualDrag ? undefined : handleProps)}
        onClick={disableCollapseOnItemClick ? undefined : onCollapse}
      >
        {!disableSorting && showDragHandle !== false && (
          <div className={'dnd-sortable-tree_simple_handle'} {...handleProps} />
        )}
        {!manualDrag && !hideCollapseButton && !!onCollapse && !!childCount && (
          <button
            onClick={(e) => {
              if (!disableCollapseOnItemClick) {
                return
              }
              e.preventDefault()
              onCollapse?.()
            }}
            className={cn(
              'dnd-sortable-tree_simple_tree-item-collapse_button',
              collapsed && 'dnd-sortable-tree_folder_simple-item-collapse_button-collapsed',
            )}
          />
        )}
        {props.children}
      </div>
      {item.kind === 'Folder' && (
        <span onClick={disableCollapseOnItemClick ? undefined : onCollapse}>
          <ArrowRightIcon
            className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
            pathClassName={cn(
              'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
              collapsed && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
            )}
          />
        </span>
      )}
    </li>
  )
}) as <T>(
  p: React.PropsWithChildren<TreeItemComponentProps<T> & React.RefAttributes<HTMLDivElement>>,
) => React.ReactElement
