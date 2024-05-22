import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from './utils'
import { PageMapItem } from '../../nextra/types'
import { FlattenedItem, ItemChangedReason } from '../../types'
import { arrayMove } from '@dnd-kit/sortable'

type Props = {
  children: React.ReactNode
  items: PageMapItem[]
  onItemsChanged: (items: PageMapItem[], reason: ItemChangedReason<PageMapItem>) => void
}

function DndTree({ children, items, onItemsChanged }: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null
    overId: UniqueIdentifier
  } | null>(null)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) => (collapsed && children?.length ? [...acc, id] : acc),
      [],
    )

    const result = removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    )
    return result
  }, [activeId, items])

  const keepGhostInPlace = true
  const indentationWidth = 20
  const canRootHaveChildren = false
  const projected = getProjection(
    flattenedItems,
    activeId,
    overId,
    offsetLeft,
    indentationWidth ?? 0,
    keepGhostInPlace,
    canRootHaveChildren,
  )

  const getMovementAnnouncement = (
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) => {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          })
        }
      }

      const clonedItems: FlattenedItem<PageMapItem>[] = flattenTree(items)
      const overIndex = clonedItems.findIndex(({ id }) => id === overId)
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId)
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)

      const previousItem = sortedItems[overIndex - 1]

      let announcement
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved'
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested'

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1]
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`
        } else {
          let previousSibling: FlattenedItem<PageMapItem> | undefined = previousItem
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId
            previousSibling = sortedItems.find(({ id }) => id === parentId)
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`
          }
        }
      }

      return announcement
    }

    return
  }

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        return `Picked up ${active.id}.`
      },
      onDragMove({ active, over }) {
        return getMovementAnnouncement('onDragMove', active.id, over?.id)
      },
      onDragOver({ active, over }) {
        return getMovementAnnouncement('onDragOver', active.id, over?.id)
      },
      onDragEnd({ active, over }) {
        return getMovementAnnouncement('onDragEnd', active.id, over?.id)
      },
      onDragCancel({ active }) {
        return `Moving was cancelled. ${active.id} was dropped in its original position.`
      },
    }),
    [],
  )

  const handleDragStart = ({ active: { id: activeId } }: DragStartEvent) => {
    setActiveId(activeId)
    setOverId(activeId)

    const activeItem = flattenedItems.find(({ id }) => id === activeId)

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      })
    }

    document.body.style.setProperty('cursor', 'grabbing')
  }

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x)
  }

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      if (keepGhostInPlace && over.id === active.id) return
      const clonedItems: FlattenedItem<PageMapItem>[] = flattenTree(items)
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }
      const draggedFromParent = activeTreeItem.parent
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)
      const newActiveItem = sortedItems.find((x) => x.id === active.id)!
      const currentParent = newActiveItem.parentId
        ? sortedItems.find((x) => x.id === newActiveItem.parentId)!
        : null
      // removing setTimeout leads to an unwanted scrolling
      // Use case:
      //   There are a lot of items in a tree (so that the scroll exists).
      //   You take the node from the bottom and move it to the top
      //   Without `setTimeout` when you drop the node the list gets scrolled to the bottom.
      setTimeout(() =>
        onItemsChanged(newItems, {
          type: 'dropped',
          draggedItem: newActiveItem,
          draggedFromParent: draggedFromParent,
          droppedToParent: currentParent,
        }),
      )
    }
  }

  const handleDragCancel = () => {
    resetState()
  }

  const resetState = () => {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  return (
    <DndContext
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
    </DndContext>
  )
}

export default DndTree
