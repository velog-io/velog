import { SortableItem } from '@/nextra/normalize-pages'
import { CSSProperties, memo } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { findParent, getIsParentOver } from './utils'
import { SortableTreeItemProps } from './types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { SortableComponent } from './sortable-component'

type Props = {
  className?: string
  item: SortableItem
  items: SortableItem[]
  collapsed: boolean
  onCollapse: (id: UniqueIdentifier) => void
  clone?: boolean
  indentationWidth: number
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, isDragging }) =>
  isSorting || isDragging ? false : true

const SortableTreeMenuNotMemoized = function SortableTreeItem({
  item,
  items,
  onCollapse,
  clone = false,
  indentationWidth,
}: Props) {
  const disabled = item.name === 'index'
  const {
    attributes,
    listeners,
    isDragging: isGhost,
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
    transition,
  }

  const parent = findParent(items, active)

  const props: SortableTreeItemProps = {
    setNodeRef,
    setActivatorNodeRef,
    isGhost,
    isSorting,
    ref: setDraggableNodeRef,
    wrapperRef: setDroppableNodeRef,
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
    indentationWidth,
    onCollapse,
    handleProps: {
      ...attributes,
      ...listeners,
    },
    clone,
  }

  return <SortableComponent item={item} {...props} />
}

export const SortableTreeItem = memo(
  SortableTreeMenuNotMemoized,
) as typeof SortableTreeMenuNotMemoized
