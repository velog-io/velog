import { Announcements, DndContext, UniqueIdentifier } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { flattenTree, getProjection, removeChildrenOf } from './utils'
import { PageMapItem } from '../../nextra/types'
import { FlattenedItem } from '../../types'
import { arrayMove } from '@dnd-kit/sortable'

type Props = {
  children: React.ReactNode
  items: PageMapItem[]
}

function DndTree({ children, items }: Props) {
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

  return <DndContext accessibility={{ announcements }}>{children}</DndContext>

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier,
  ) {
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
}

export default DndTree
