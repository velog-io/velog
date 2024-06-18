import cn from 'clsx'
import { useRouter } from 'next/router'
import type { Heading } from '@/nextra/types'
import { useFSRoute, useMounted } from '@/nextra/hooks'
import { ExpandIcon } from '@/nextra/icons'
import type { Item, PageItem, SortableItem } from '@/nextra/normalize-pages'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useConfig, useMenu } from '@/contexts'
import { renderComponent } from '@/utils'

import { LocaleSwitch } from '../locale-switch'

import { useSidebar } from '@/contexts/sidebar'
import { Menu } from './menu'
import SortableTree from './sortable-tree'
import { initilizeDirectories } from './sortable-tree/utils'

interface SideBarProps {
  docsDirectories: PageItem[]
  flatDirectories: Item[]
  fullDirectories: Item[]
  asPopover?: boolean
  headings: Heading[]
  includePlaceholder: boolean
}

export function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings,
  includePlaceholder,
}: SideBarProps): ReactElement {
  const {
    isFolding,
    setIsFolding,
    setFocusedItem,
    setSortableItems,
    sortableItems,
    collapsedTree,
  } = useSidebar()
  const config = useConfig()
  const { menu, setMenu } = useMenu()
  const router = useRouter()
  const routeOriginal = useFSRoute()
  const [showSidebar, setSidebar] = useState(true)
  const [showToggleAnimation, setToggleAnimation] = useState(false)

  const anchors = useMemo(() => headings.filter((v) => v.depth === 2), [headings])
  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mounted = useMounted()

  useEffect(() => {
    if (menu) {
      document.body.classList.add('nx-overflow-hidden', 'md:nx-overflow-auto')
    } else {
      document.body.classList.remove('nx-overflow-hidden', 'md:nx-overflow-auto')
    }
  }, [menu])

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector('li.active')

    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        scrollIntoView(activeElement, {
          block: 'center',
          inline: 'center',
          scrollMode: 'always',
          boundary: containerRef.current,
        })
      }
      if (menu) {
        // needs for mobile since menu has transition transform
        setTimeout(scroll, 300)
      } else {
        scroll()
      }
    }
  }, [menu])

  // Always close mobile nav when route was changed (e.g. logo click)
  useEffect(() => {
    setMenu(false)
  }, [router.asPath, setMenu])

  useEffect(() => {
    if (!isFolding) return
    setFocusedItem(null)
    setIsFolding(false)
    setMenu(false)
  }, [isFolding])

  const hasI18n = config.i18n.length > 0
  const hasMenu = config.darkMode || hasI18n || config.sidebar.toggleButton
  const [route] = routeOriginal.split('#')

  const initSotableItems: SortableItem[] = useMemo(
    () => initilizeDirectories(docsDirectories, route, collapsedTree),
    [docsDirectories],
  )



  useEffect(() => {
    setSortableItems(initSotableItems)
  }, [initSotableItems])

  const initFullDirectories: SortableItem[] = useMemo(
    () => initilizeDirectories(fullDirectories, route, collapsedTree),
    [fullDirectories],
  )

  return (
    <>
      {includePlaceholder && asPopover ? (
        <div className="nx-h-0 nx-w-80 nx-shrink-0 max-xl:nx-hidden" />
      ) : null}
      <div
        className={cn(
          '[transition:background-color_1.5s_ease] motion-reduce:nx-transition-none',
          menu
            ? 'nx-fixed nx-inset-0 nx-z-10 nx-bg-black/80 dark:nx-bg-black/60'
            : 'nx-bg-transparent',
        )}
        onClick={() => setMenu(false)}
      />
      <aside
        className={cn(
          'nextra-sidebar-container nx-flex nx-flex-col',
          'motion-reduce:nx-transform-none md:nx-shrink-0',
          'nx-transform-gpu nx-transition-all nx-ease-in-out',
          'print:nx-hidden',
          'nx-relative nx-select-none nx-overflow-hidden',
          showSidebar ? 'md:nx-w-80' : 'md:nx-w-20',
          asPopover ? 'md:nx-hidden' : 'md:nx-relative md:nx-top-0 md:nx-self-start',
          menu
            ? 'max-md:[transform:translate3d(0,0,0)]'
            : 'max-md:[transform:translate3d(0,-100%,0)]',
        )}
        ref={containerRef}
      >
        <div className="nx-px-4 nx-pt-4 md:nx-hidden">
          {renderComponent(config.search.component, {
            directories: flatDirectories,
          })}
        </div>
        <SortableTree
          items={sortableItems}
          onItemsChanged={setSortableItems}
          showSidebar={showSidebar}
          sidebarRef={sidebarRef}
        />
        {mounted && window.innerWidth < 768 && (
          <Menu
            className="nextra-menu-mobile md:nx-hidden"
            // The mobile dropdown menu, shows all the directories.
            directories={initFullDirectories}
            // Always show the anchor links on mobile (`md`).
            anchors={anchors}
          />
        )}
        {hasMenu && (
          <div
            style={{ marginTop: showSidebar ? '0px' : '-30px' }}
            className={cn(
              'nx-sticky nx-bottom-0',
              'nx-bg-white dark:nx-bg-dark', // when banner is showed, sidebar links can be behind menu, set bg color as body bg color
              'nx-mx-4 nx-py-4 nx-shadow-[0_-12px_16px_#fff]',
              'nx-flex nx-items-center nx-gap-2',
              'dark:nx-border-neutral-800 dark:nx-shadow-[0_-12px_16px_#111]',
              'contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-shadow-none',
              showSidebar
                ? cn(hasI18n && 'nx-justify-end', 'nx-border-t')
                : 'nx-flex-wrap nx-justify-center nx-py-4',
            )}
            data-toggle-animation={showToggleAnimation ? (showSidebar ? 'show' : 'hide') : 'off'}
          >
            <LocaleSwitch
              lite={!showSidebar}
              className={cn(showSidebar ? 'nx-grow' : 'max-md:nx-grow')}
            />
            {config.darkMode && (
              <div className={showSidebar && !hasI18n ? 'nx-flex nx-grow nx-flex-col' : ''}>
                {renderComponent(config.themeSwitch.component, {
                  lite: !showSidebar || hasI18n,
                })}
              </div>
            )}
            {config.sidebar.toggleButton && (
              <button
                title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                className="nx-h-7 nx-rounded-md nx-px-2 nx-text-gray-600 nx-transition-colors hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50 max-md:nx-hidden"
                onClick={() => {
                  setSidebar(!showSidebar)
                  setToggleAnimation(true)
                }}
              >
                <ExpandIcon isOpen={showSidebar} />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
