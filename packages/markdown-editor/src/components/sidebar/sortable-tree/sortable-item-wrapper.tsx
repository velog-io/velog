import type { SortableItem as SortableItemType } from '@/nextra/normalize-pages'
import { CSSProperties, memo, useEffect, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { findParent, getIsParentOver } from '../utils'
import { SortableItemWrapperProps } from './types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { SortableItem } from './sortable-item'
import { FlattenedItem } from '@/types'
import { useDndTree } from '.'
import { useSidebar } from '@/contexts/sidebar'

type Props = {
  className?: string
  item: SortableItemType
  items: FlattenedItem[]
  collapsed: boolean
  onCollapse: (id: UniqueIdentifier) => void
  clone?: boolean
  indentationWidth: number
  depth: number
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, isDragging }) =>
  isSorting || isDragging ? false : true

const SortableTreeMenuNotMemoized = function SortableItemWrapper({
  item,
  items,
  onCollapse,
  clone = false,
  indentationWidth,
  depth,
}: Props) {
  const { overItem } = useDndTree()
  const { showMenuId } = useSidebar()
  const [previousItem, setPreviousItem] = useState<FlattenedItem | null>(null)

  const disabled = item.name === 'index' || showMenuId === item.id
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

  useEffect(() => {
    if (!isGhost) return
    if (!overItem) return
    const item = items.findIndex((i) => i.id === overItem.id)
    const previousItem = items[item - 1]
    setPreviousItem(previousItem ?? null)
  }, [isGhost, overItem])

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const parent = findParent(items, active)
  const props: SortableItemWrapperProps = {
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
    parent: parent,
    previousItem, // over된 item의 이전 item을 의미함 // TODO: remove
    isParentOver: getIsParentOver(parent, over?.id),
    isChildrenOver: over ? item.childrenIds.includes(over?.id) : false,
    depth,
    indentationWidth,
    onCollapse,
    handleProps: {
      ...attributes,
      ...listeners,
    },
    clone,
    disabled,
  }

  return <SortableItem item={item} {...props} />
}

export const SortableItemWrapper = memo(
  SortableTreeMenuNotMemoized,
) as typeof SortableTreeMenuNotMemoized
