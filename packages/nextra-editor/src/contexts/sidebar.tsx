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
  collapsedTree: Set<string>
  setCollapsedTree: (id: string, setter: (value: boolean) => boolean) => void
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
  const [isFolding, setFolding] = useState(false)
  const [actionComplete, setActionComplete] = useState(false)
  const [actionActive, setActionActive] = useState(false)
  const [focusedItem, setFocusedItem] = useState<null | SortableItem>(null)
  const [actionType, setActionType] = useState<ActionType>('')
  const [actionInfo, setActionInfo] = useState<ActionInfo>({
    parentUrlSlug: '/',
    index: 0,
    bookUrlSlug: '/',
    type: 'page',
  })

  const reset = (originSortableItem: SortableItem[]) => {
    if (originSortableItem.length > 0) {
      setSortableItems(originSortableItem)
    }
    setActionActive(false)
    setActionComplete(false)
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
