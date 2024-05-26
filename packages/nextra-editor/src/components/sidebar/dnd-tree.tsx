import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  Modifier,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from './utils'
import { FlattenedItem, ItemChangedReason } from '../../types'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { Item, PageItem } from '../../nextra/normalize-pages'
import { Menu } from './sidebar'
import cn from 'clsx'
import { dropAnimation } from './utils/dropAnimation'
import { customCollisionDetectionAlgorithm } from './utils/customCollisionDetection'
import { customListSortingStrategy } from './utils/customListSortingStrategy'

type Props = {
  children: React.ReactNode
  items: PageItem[]
  onItemsChanged: (items: PageItem[], reason: ItemChangedReason<PageItem>) => void
}

type DndTreeContextType = {
  activeId: UniqueIdentifier | null
  isDragging: boolean
  setDragging: (isDragging: boolean) => void
  dragItem: PageItem | Item | null
  setDragItem: (directories: PageItem | Item) => void
}

const DndTreeContext = createContext<DndTreeContextType>({
  isDragging: false,
  setDragging: () => {},
  activeId: null,
  dragItem: null,
  setDragItem: () => {},
})

export const useDndTree = () => useContext(DndTreeContext)

function DndTree({ children, items, onItemsChanged }: Props) {
  const [isDragging, setDragging] = useState(false)
  const [dragItem, setDragItem] = useState<PageItem | Item | null>(null)

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

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 550,
      tolerance: 5,
    },
  })
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

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

      const clonedItems: FlattenedItem<PageItem>[] = flattenTree(items)
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
          let previousSibling: FlattenedItem<PageItem> | undefined = previousItem
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
    setDragging(true)
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
      const clonedItems: FlattenedItem<PageItem>[] = flattenTree(items)
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
    setDragging(false)
    setDragItem(null)
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])
  const strategyCallback = useCallback(() => {
    return !!projected
  }, [projected])

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={customCollisionDetectionAlgorithm}
    >
      <SortableContext items={sortedIds} strategy={customListSortingStrategy(strategyCallback)}>
        <DndTreeContext.Provider
          value={{ isDragging, setDragging, activeId, dragItem, setDragItem }}
        >
          {children}
        </DndTreeContext.Provider>
      </SortableContext>
      <DragOverlay
        modifiers={modifiersArray}
        dropAnimation={dropAnimation}
        className={cn('nx-bg-sky-50 nx-opacity-90')}
        style={{ width: '90%' }}
      >
        {dragItem && (
          <div className={cn('nx-bg-sky-50')}>
            <Menu directories={[{ ...dragItem, children: [] }]} anchors={[]} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

const adjustTranslate: Modifier = ({ transform }) => {
  return { ...transform, y: transform.y + 0 - 64 }
}

const modifiersArray = [adjustTranslate]

export default DndTree
