import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import type { SortableItem } from '@/nextra/normalize-pages'

export type ActionInfo = {
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
  type: ActionType
}

export type ActionType = 'folder' | 'page' | 'separator' | ''

type Sidebar = {
  sortableItems: SortableItem[]
  setSortableItems: (item: SortableItem[]) => void
  reset: (pageMap: SortableItem[]) => void
  actionActive: boolean
  setActionActive: (value: boolean) => void
  actionComplete: boolean
  setActionComplete: (value: boolean) => void
  actionInfo: ActionInfo
  setActionInfo: (args: ActionInfo) => void
  isFolding: boolean
  setIsFolding: (value: boolean) => void
  actionType: ActionType
  setActionType: (value: ActionType) => void
  focusedItem: SortableItem | null
  setFocusedItem: (value: SortableItem | null) => void
  collapsedTree: Map<string, boolean>
  setCollapsedTree: (id: string, setter: (value: boolean) => boolean) => void
}

const collapsedTree = new Map<string, boolean>()
function setCollapsedTree(id: string, setter: (value: boolean) => boolean): void {
  const exists = collapsedTree.get(id)
  if (exists) {
    collapsedTree.set(id, setter(exists))
  } else {
    collapsedTree.set(id, setter(false))
  }
}

const SidebarContext = createContext<Sidebar>({
  sortableItems: [],
  setSortableItems: () => {},
  reset: () => {},
  actionActive: false,
  setActionActive: () => {},
  actionComplete: false,
  setActionComplete: () => {},
  actionInfo: { parentUrlSlug: '/', index: 0, bookUrlSlug: '/', type: 'page' },
  setActionInfo: () => {},
  isFolding: false,
  setIsFolding: () => {},
  actionType: '',
  setActionType: () => {},
  focusedItem: null,
  setFocusedItem: () => {},
  collapsedTree,
  setCollapsedTree,
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export const SidebarProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [sortableItems, setSortableItems] = useState<SortableItem[]>([])
  const [isFolding, setIsFolding] = useState(false)
  const [actionComplete, setActionComplete] = useState(false)
  const [actionActive, setActionActive] = useState(false)
  const [focusedItem, setFocusItem] = useState<null | SortableItem>(null)
  const [actionType, setActionType] = useState<ActionType>('')
  const [actionInfo, setActionInfo] = useState<ActionInfo>({
    parentUrlSlug: '/',
    index: 0,
    bookUrlSlug: '/',
    type: 'page',
  })

  const reset = (originSortableItem: SortableItem[]) => {
    setSortableItems(originSortableItem)
    setActionActive(false)
    setActionComplete(false)
    setActionType('')
    setFocusedItem(null)
  }

  const setFocusedItem = (item: SortableItem | null) => {
    if (item) {
      setCollapsedTree(item.id, (value) => !value)
    }

    setFocusItem(item)
  }

  const value: Sidebar = {
    sortableItems,
    setSortableItems,
    reset,
    actionComplete,
    setActionComplete,
    actionActive,
    setActionActive,
    actionInfo,
    setActionInfo,
    isFolding,
    setIsFolding,
    actionType,
    setActionType,
    focusedItem,
    setFocusedItem,
    collapsedTree,
    setCollapsedTree,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
