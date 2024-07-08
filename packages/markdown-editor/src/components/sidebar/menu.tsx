import cn from 'clsx'
import { CSSProperties, ReactElement } from 'react'
import { Item, PageItem, SortableItem } from '../../nextra/normalize-pages'
import { Heading } from '../../nextra/types'
import { classes } from './style'
import { Folder } from './folder'
import { File } from './file'
import { Separator } from './separator'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { Active, DraggableAttributes, Over } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { CSS, Transform } from '@dnd-kit/utilities'
import { findParent, getIsParentOver } from './utils'

export type MenuItemProps = {
  setNodeRef: (node: HTMLElement | null) => void
  setActivatorNodeRef: (node: HTMLElement | null) => void
  setDraggableNodeRef: (node: HTMLElement | null) => void
  setDroppableNodeRef: (node: HTMLElement | null) => void
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
  isDragTarget: boolean
  isSorting: boolean
  transform: Transform | null
  transition: string | undefined
  isOver: boolean
  isParentOver: boolean
  over: Over | null
  active: Active | null
  style: CSSProperties
  parent: PageItem | Item | null
  isChildrenOver: boolean
  depth: number
  indentationWidth: number
}

interface MenuProps {
  directories: SortableItem[]
  anchors?: Heading[]
  base?: string
  className?: string
  onlyCurrentDocs?: boolean
  border?: boolean
}

export function Menu({ directories, className, border }: MenuProps): ReactElement {
  return (
    <div className={cn('nx-relative')}>
      <ul className={cn(classes.list, className, 'nx-pl-3')}>
        {directories.map((item) => {
          const key = item.id || item.name || item.route
          return <MenuInner key={key} item={item} items={directories} />
        })}
      </ul>
      {border && (
        <div
          className={cn(
            'nx-y-full nx-absolute nx-inset-y-1 nx-left-0 nx-ml-3 nx-w-px',
            'nx-bg-gray-200 dark:nx-bg-neutral-800',
          )}
        />
      )}
    </div>
  )
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, isDragging }) =>
  isSorting || isDragging ? false : true

type MenuInnerProps = {
  item: SortableItem
  items: SortableItem[]
}

function MenuInner({ item, items }: MenuInnerProps) {
  const disabled = item.name === 'index'
  const {
    attributes,
    listeners,
    isDragging: isDragTarget,
    isSorting,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    isOver,
    over,
    active,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: item.id || item.name || item.route,
    data: item,
    disabled,
    animateLayoutChanges,
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition ?? undefined,
  }

  const parent = findParent(items, active)

  const props: MenuItemProps = {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    isDragTarget,
    isSorting,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    isOver,
    over,
    active,
    style,
    parent: item.parent,
    isParentOver: getIsParentOver(parent, over?.id),
    isChildrenOver: over ? item.childrenIds.includes(over?.id) : false,
    depth: item.depth,
    indentationWidth: 10,
  }

  return item.kind === 'Folder' ? (
    <Folder key={item.id} item={item} {...props} />
  ) : item.type === 'separator' ? (
    <Separator key={item.id} item={item} {...props} />
  ) : (
    <File key={item.id} item={item} {...props} />
  )
}
