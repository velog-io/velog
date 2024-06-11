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
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { flattenTree, getProjection, removeChildrenOf, setProperty } from './utils'
import { FlattenedItem } from '@/types'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { SortableItem } from '@/nextra/normalize-pages'
import cn from 'clsx'
import { customCollisionDetectionAlgorithm } from './utils/customCollisionDetection'
import { customListSortingStrategy } from './utils/customListSortingStrategy'
import { createPortal } from 'react-dom'
import SidebarController from '../sidebar-controller'
import { Collapse } from '@/index'
import { SortableTreeItem } from './sortable-tree-item'
import { dropAnimation } from './utils/dropAnimation'
import { useSidebar } from '@/contexts/sidebar'

type Props = {
  items: SortableItem[]
  onItemsChanged: (newItems: any) => void
  showSidebar: boolean
  sidebarRef: React.RefObject<HTMLDivElement>
}

type DndTreeContextType = {
  activeId: UniqueIdentifier | null
  isDragging: boolean
  setDragging: (isDragging: boolean) => void
  dragItem: SortableItem | null
  setDragItem: (directories: SortableItem) => void
}

const DndTreeContext = createContext<DndTreeContextType>({
  isDragging: false,
  setDragging: () => {},
  activeId: null,
  dragItem: null,
  setDragItem: () => {},
})

export const useDndTree = () => useContext(DndTreeContext)

function SortableTree({ items, sidebarRef, showSidebar, onItemsChanged }: Props) {
  const { focusedItem } = useSidebar()
  const [isDragging, setDragging] = useState(false)
  const [dragItem, setDragItem] = useState<SortableItem | null>(null)
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
      (acc, { collapsed, id }) => (collapsed ? [...acc, id] : acc),
      [],
    )

    const result = removeChildrenOf(flattenedTree, collapsedItems)

    return result
  }, [activeId, items, focusedItem])

  const indentationWidth = 20
  const projected =
    activeId && overId
      ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth)
      : null

  const itemsRef = useRef<SortableItem[]>(items)
  itemsRef.current = items

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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor, pointerSensor)

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

      const clonedItems: FlattenedItem<SortableItem>[] = flattenTree(items)
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
          let previousSibling: FlattenedItem<SortableItem> | undefined = previousItem
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

  const strategyCallback = useCallback(() => {
    return !!projected
  }, [projected])

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])

  const onCollapse = useCallback(
    (id: UniqueIdentifier) => {
      onItemsChanged((items: SortableItem[]) =>
        setProperty(items, id, 'collapsed', (value) => !value),
      )
    },
    [onItemsChanged],
  )

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
          <div
            className={cn(
              'nx-overflow-y-auto nx-overflow-x-hidden',
              'nx-grow nx-px-4 md:nx-h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]',
              'nx-pb-4',
              showSidebar ? 'nextra-scrollbar' : 'no-scrollbar',
            )}
            ref={sidebarRef}
          >
            <SidebarController showSidebar={showSidebar} />
            {showSidebar && (
              <Collapse isOpen={showSidebar} horizontal={true}>
                <div className={cn('nx-relative')}>
                  <ul className={cn('nextra-menu-desktop nx-pl-3 max-md:nx-hidden')}>
                    {flattenedItems.map((item) => {
                      const key = item.id || item.name || item.route
                      return (
                        <SortableTreeItem
                          key={key}
                          item={item}
                          items={flattenedItems}
                          collapsed={item.collapsed && !!item.children.length}
                          onCollapse={onCollapse}
                          indentationWidth={indentationWidth}
                        />
                      )
                    })}
                  </ul>
                </div>
              </Collapse>
            )}
          </div>
        </DndTreeContext.Provider>
      </SortableContext>
      {createPortal(
        <DragOverlay
          modifiers={modifiersArray}
          dropAnimation={dropAnimation}
          className={cn('nx-opacity-80')}
          style={{ width: '100%', maxWidth: '250px' }}
        >
          {dragItem && (
            <SortableTreeItem
              item={dragItem}
              items={flattenedItems}
              collapsed={false}
              clone={true}
              onCollapse={onCollapse}
              indentationWidth={indentationWidth}
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
  }
}

const modifiersArray = [adjustTranslate]

export default SortableTree
