import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  buildTree,
  findItemDeep,
  flattenTree,
  getProjection,
  removeChildrenOf,
  setProperty,
  setPropertyAll,
} from './utils'
import { FlattenedItem } from '@/types'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from '@/nextra/normalize-pages'
import cn from 'clsx'
import { customCollisionDetectionAlgorithm } from './utils/customCollisionDetection'
import { createPortal } from 'react-dom'
import SidebarController from '../sidebar-controller'
import { SortableTreeItem } from './sortable-tree-item'
import { dropAnimation } from './utils/dropAnimation'
import { useSidebar } from '@/contexts/sidebar'
import { SensorContext } from './types'
import { sortableTreeKeyboardCoordinates } from './utils/keyborardCoordinates'
import { CustomEventDetail, nextraCustomEventName } from '@/index'
import { useUrlSlug } from '@/hooks/use-url-slug'

type Props = {
  items: SortableItem[]
  onItemsChanged: (newItems: any) => void
  showSidebar: boolean
  sidebarRef: React.RefObject<HTMLDivElement>
}

type DndTreeContextType = {
  isDragging: boolean
  setDragging: (isDragging: boolean) => void
  ghostItem: SortableItem | null
  setGhostItem: (item: SortableItem) => void
  overItem: SortableItem | null
  setOverItem: (item: SortableItem) => void
  currentPosition: { parentId: UniqueIdentifier | null; overId: UniqueIdentifier } | null
}

const DndTreeContext = createContext<DndTreeContextType>({
  isDragging: false,
  setDragging: () => {},
  ghostItem: null,
  setGhostItem: () => {},
  overItem: null,
  setOverItem: () => {},
  currentPosition: null,
})

export const useDndTree = () => useContext(DndTreeContext)

function SortableTree({ items, sidebarRef, showSidebar, onItemsChanged }: Props) {
  const { bookUrlSlug } = useUrlSlug()
  const { isFolding, setCollapsedTree } = useSidebar()
  const [isDragging, setDragging] = useState(false)
  const [ghostItem, setGhostItem] = useState<SortableItem | null>(null)
  const [overItem, setOverItem] = useState<SortableItem | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null
    overId: UniqueIdentifier
  } | null>(null)

  const overId = overItem?.id

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { collapsed, id }) => (collapsed ? [...acc, id] : acc),
      [],
    )

    collapsedItems.forEach((id) => {
      setCollapsedTree(String(id), () => true)
    })

    const result = removeChildrenOf(
      flattenedTree,
      ghostItem ? [ghostItem.id, ...collapsedItems] : collapsedItems,
    )
    return result
  }, [ghostItem, items])

  const indentationWidth = 20

  const projected =
    ghostItem && overId
      ? getProjection(flattenedItems, ghostItem.id, overId, offsetLeft, indentationWidth)
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

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  })

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indentationWidth),
  )

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter,
  })

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor, pointerSensor)

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    }
  }, [flattenedItems, offsetLeft])

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  }

  const announcements: Announcements = {
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
  }

  const onDragStart = ({ active: { id: activeId } }: DragStartEvent) => {
    setDragging(true)
    const activeItem = flattenedItems.find(({ id }) => id === activeId)
    setGhostItem(activeItem ?? null)

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      })
    }

    document.body.style.setProperty('cursor', 'grabbing')
  }

  const onDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x)
  }

  const onDragOver = ({ over }: DragOverEvent) => {
    const item = flattenedItems.find((item) => item.id === over?.id)
    setOverItem(item ?? null)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)))
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const parentIndex = clonedItems.findIndex(({ id }) => id === parentId)

      if (overIndex === 0) return

      const activeTreeItem = clonedItems[activeIndex]
      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parentId,
        parent: clonedItems[parentIndex] ?? null,
      }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)
      const newParentItem = findItemDeep(newItems, parentId)

      const event = new CustomEvent<CustomEventDetail['changeItemEvent']>(
        nextraCustomEventName.changeItem,
        {
          detail: {
            bookUrlSlug,
            targetUrlSlug: activeTreeItem.id.replace(bookUrlSlug, ''),
            parentUrlSlug: String(parentId).replace(bookUrlSlug, ''),
            index: newParentItem
              ? newParentItem.childrenIds.findIndex((id) => id === activeTreeItem.id)
              : newItems
                  .filter((item) => !item.parentId)
                  .findIndex(({ id }) => id === activeTreeItem.id),
          },
        },
      )

      window.dispatchEvent(event)

      onItemsChanged(newItems)
    }
  }

  const onDragCancel = () => {
    resetState()
  }

  const resetState = () => {
    setDragging(false)
    setGhostItem(null)
    setOverItem(null)
    setGhostItem(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  const onCollapse = useCallback(
    (id: UniqueIdentifier) => {
      onItemsChanged((items: SortableItem[]) =>
        setProperty(items, id, 'collapsed', (value) => {
          const result = !value
          setCollapsedTree(String(id), () => result)
          return result
        }),
      )
    },
    [onItemsChanged],
  )

  useEffect(() => {
    if (!isFolding) return
    onItemsChanged((items: SortableItem[]) => setPropertyAll(items, 'collapsed', () => false))
  }, [isFolding])

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      measuring={measuring}
      collisionDetection={customCollisionDetectionAlgorithm}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <DndTreeContext.Provider
          value={{
            isDragging,
            setDragging,
            ghostItem,
            setGhostItem,
            overItem,
            setOverItem,
            currentPosition,
          }}
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
              <ul className={cn('nextra-menu-desktop max-md:nx-hidden')}>
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
                      depth={item.id === ghostItem?.id && projected ? projected.depth : item.depth}
                    />
                  )
                })}
              </ul>
            )}
          </div>
        </DndTreeContext.Provider>
      </SortableContext>
      {createPortal(
        <DragOverlay modifiers={modifiersArray} dropAnimation={dropAnimation}>
          {ghostItem && (
            <SortableTreeItem
              item={ghostItem}
              depth={ghostItem.depth}
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
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 35,
  }
}

const modifiersArray = [adjustTranslate]

export default SortableTree
