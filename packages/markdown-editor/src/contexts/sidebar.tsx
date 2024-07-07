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
  originSortableItems: SortableItem[]
  setOriginSortableItems: (item: SortableItem[]) => void
  sortableItems: SortableItem[]
  setSortableItems: (item: SortableItem[]) => void
  reset: () => void
  actionActive: boolean
  setActionActive: (value: boolean) => void
  actionInfo: ActionInfo
  setActionInfo: (args: ActionInfo) => void
  isFolding: boolean
  setIsFolding: (value: boolean) => void
  actionType: ActionType
  setActionType: (value: ActionType) => void
  focusedItem: SortableItem | null
  setFocusedItem: (value: SortableItem | null) => void
  collapsedTree: Set<string>
  setCollapsedTree: (id: string, setter: (value: boolean) => boolean) => void
  showMenuId: string | null
  setShowMenuId: (value: string | null) => void
}

let collapsedTree = new Set<string>()

function setCollapsedTree(id: string, setter: (value: boolean) => boolean): void {
  const visible = collapsedTree.has(id)
  const result = setter(visible)
  if (result) {
    collapsedTree.add(id)
  } else {
    collapsedTree.delete(id)
  }
}

const SidebarContext = createContext<Sidebar>({
  originSortableItems: [],
  setOriginSortableItems: () => {},
  sortableItems: [],
  setSortableItems: () => {},
  reset: () => {},
  actionActive: false,
  setActionActive: () => {},
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
  showMenuId: null,
  setShowMenuId: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export const SidebarProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [originSortableItems, setOriginSortableItems] = useState<SortableItem[]>([])
  const [sortableItems, setSortableItems] = useState<SortableItem[]>([])
  const [isFolding, setFolding] = useState(false)
  const [actionActive, setActionActive] = useState(false)
  const [showMenuId, setShowMenuId] = useState<string | null>(null)

  const [focusedItem, setFocusedItem] = useState<null | SortableItem>(null)
  const [actionType, setActionType] = useState<ActionType>('')
  const [actionInfo, setActionInfo] = useState<ActionInfo>({
    parentUrlSlug: '/',
    index: 0,
    bookUrlSlug: '/',
    type: 'page',
  })

  const reset = () => {
    setOriginSortableItems([])
    setActionActive(false)
    setActionType('')
    setFocusedItem(null)
  }

  const setIsFolding = (value: boolean) => {
    if (value) {
      collapsedTree = new Set<string>()
    }
    setFolding(value)
  }

  const value: Sidebar = {
    originSortableItems,
    setOriginSortableItems,
    sortableItems,
    setSortableItems,
    reset,
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
    showMenuId,
    setShowMenuId,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
