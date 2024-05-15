import { PageMapItem } from '../nextra/types'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import { Context } from '../types'

export type AddFileInfo = {
  parentUrlSlug: string
  index: number
  bookUrlSlug: string
}

type Sidebar = {
  pageMap: PageMapItem[]
  setPageMap: (pageMap: PageMapItem[]) => void
  addFileReset: (pageMap: PageMapItem[]) => void
  addFileActive: boolean
  setAddFileActive: (value: boolean) => void
  addFileComplete: boolean
  setAddFileComplete: (value: boolean) => void
  addFileInfo: AddFileInfo
  setAddFileInfo: (args: AddFileInfo) => void
}

const SidebarContext = createContext<Sidebar>({
  pageMap: [],
  setPageMap: () => {},
  addFileReset: () => {},
  addFileActive: false,
  setAddFileActive: () => {},
  addFileComplete: false,
  setAddFileComplete: () => {},
  addFileInfo: { parentUrlSlug: '/', index: 0, bookUrlSlug: '/' },
  setAddFileInfo: () => {},
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
  const [addFileComplete, setAddFileComplete] = useState(false)
  const [addFileActive, setAddFileActive] = useState(false)
  const [addFileInfo, setAddFileInfo] = useState({ parentUrlSlug: '/', index: 0, bookUrlSlug: '/' })

  const addFileReset = (originPageMap: PageMapItem[]) => {
    setPageMap(originPageMap)
    setAddFileComplete(false)
    setAddFileActive(false)
  }

  const value: Sidebar = {
    pageMap,
    setPageMap,
    addFileReset,
    addFileComplete,
    setAddFileComplete,
    addFileActive,
    setAddFileActive,
    addFileInfo,
    setAddFileInfo,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
