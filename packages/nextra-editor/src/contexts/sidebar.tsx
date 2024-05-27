import { PageMapItem } from '../nextra/types'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import { Context } from '../types'

export type ActionInfo = {
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
  type: ActionType
}

export type ActionType = 'folder' | 'page' | 'separator' | ''

type Sidebar = {
  pageMap: PageMapItem[]
  setPageMap: (pageMap: PageMapItem[]) => void
  reset: (pageMap: PageMapItem[]) => void
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
  focused: null | string
  setFocused: (value: null | string) => void
}

const SidebarContext = createContext<Sidebar>({
  pageMap: [],
  setPageMap: () => {},
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
  focused: null,
  setFocused: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export const SidebarProvider = ({
  children,
  value: { pageOpts },
}: {
  children: ReactNode
  value: Context
}): ReactElement => {
  const [pageMap, setPageMap] = useState(pageOpts.pageMap)
  const [isFolding, setIsFolding] = useState(false)
  const [actionComplete, setActionComplete] = useState(false)
  const [actionActive, setActionActive] = useState(false)
  const [focused, setFocused] = useState<null | string>(null)
  const [actionType, setActionType] = useState<ActionType>('')
  const [actionInfo, setActionInfo] = useState<ActionInfo>({
    parentUrlSlug: '/',
    index: 0,
    bookUrlSlug: '/',
    type: 'page',
  })

  const reset = (originPageMap: PageMapItem[]) => {
    setPageMap(originPageMap)
    setActionActive(false)
    setActionComplete(false)
    setActionType('')
    setFocused(null)
  }

  const value: Sidebar = {
    pageMap,
    setPageMap,
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
    focused,
    setFocused,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
