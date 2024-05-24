import cn from 'clsx'
import { useRouter } from 'next/router'
import type { Heading } from '../../nextra/types'
import { useFSRoute, useMounted } from '../../nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from '../../nextra/icons'
import type { Item, MenuItem, PageItem } from '../../nextra/normalize-pages'
import type { ReactElement } from 'react'
import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useConfig, useMenu } from '../../contexts'
import { renderComponent } from '../../utils'
import { Collapse } from '../collapse'
import { LocaleSwitch } from '../locale-switch'
import SidebarController from './sidebar-controller'
import { ActionType, useSidebar } from '../../contexts/sidebar'
import AddInputs from './add-inputs'
import DndTree, { useDndTree } from './dnd-tree'
import { useSortable } from '@dnd-kit/sortable'

let TreeState: Record<string, boolean> = Object.create(null)

const FocusedItemContext = createContext<null | string>(null)
const OnFocusItemContext = createContext<null | ((item: string | null) => any)>(null)
const FolderLevelContext = createContext(0)

const Folder = memo(function FolderInner(props: FolderProps) {
  const level = useContext(FolderLevelContext)
  return (
    <FolderLevelContext.Provider value={level + 1}>
      <FolderImpl {...props} />
    </FolderLevelContext.Provider>
  )
})

const classes = {
  link: cn(
    'nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word]',
    'nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border',
  ),
  inactive: cn(
    'nx-text-gray-500 hover:nx-text-gray-900',
    'dark:nx-text-neutral-400 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
    'contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50',
  ),
  active: cn(
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  list: cn('nx-flex nx-flex-col nx-gap-1'),
  border: cn(
    'nx-relative  before:nx-inset-y-1',
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    'ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0',
  ),
  drag: cn(
    'nx-transform-gpu nx-w-full nx-max-h-px nx-overflow-hidden nx-bg-transparent nx-text-transparent',
  ),
  over: cn('nx-bg-red-100 dark:nx-bg-neutral-800'),
}

type FolderProps = {
  item: PageItem | MenuItem | Item
  anchors: Heading[]
}

function FolderImpl({ item, anchors }: FolderProps): ReactElement {
  const { isDragging, setDragItem } = useDndTree()
  const { isFolding } = useSidebar()
  const router = useRouter()
  const { setMenu } = useMenu()
  const routeOriginal = useFSRoute()
  const [route] = routeOriginal.split('#')

  const {
    setNodeRef,
    listeners,
    attributes,
    isDragging: isDragActive,
    isOver,
    setActivatorNodeRef,
    setDroppableNodeRef,
    setDraggableNodeRef,
  } = useSortable({
    id: item.id,
    data: item,
  })

  const active = !isDragActive && [route, route + '/'].includes(item.route + '/')
  const activeRouteInside: boolean = active || route.startsWith(item.route + '/')
  const focusedRoute = useContext(FocusedItemContext)
  const focusedRouteInside = !!focusedRoute?.startsWith(item.route + '/')
  const level = useContext(FolderLevelContext)

  const config = useConfig()
  const { theme } = item as Item

  const open =
    TreeState[item.route] === undefined
      ? active ||
        activeRouteInside ||
        focusedRouteInside ||
        (theme && 'collapsed' in theme
          ? !theme.collapsed
          : level < config.sidebar.defaultMenuCollapseLevel)
      : TreeState[item.route] || focusedRouteInside

  const rerender = useState({})[1]

  useEffect(() => {
    const updateTreeState = () => {
      if (activeRouteInside || focusedRouteInside) {
        TreeState[item.route] = true
      }
    }
    const updateAndPruneTreeState = () => {
      if (activeRouteInside && focusedRouteInside) {
        TreeState[item.route] = true
      } else {
        delete TreeState[item.route]
      }
    }
    config.sidebar.autoCollapse ? updateAndPruneTreeState() : updateTreeState()
  }, [activeRouteInside, focusedRouteInside, item.route, config.sidebar.autoCollapse])

  useEffect(() => {
    if (!isDragActive) return
    setDragItem(item)
  }, [isDragActive])

  // if (item.type === 'menu') {
  //   const menu = item as MenuItem
  //   const routes = Object.fromEntries((menu.children || []).map((route) => [route.name, route]))
  //   item.children = Object.entries(menu.items || {}).map(([key, item]) => {
  //     const route = routes[key] || {
  //       name: key,
  //       ...('locale' in menu && { locale: menu.locale }),
  //       route: menu.route + '/' + key,
  //     }
  //     return {
  //       ...route,
  //       ...item,
  //     }
  //   })
  // }

  const isLink = 'withIndexPage' in item && item.withIndexPage

  // use button when link don't have href because it impacts on SEO
  const isCollapseOpen = isDragActive || isFolding ? false : open

  return (
    <li className={cn({ open, active }, isDragActive && classes.drag, isOver && classes.over)}>
      <div
        ref={setDroppableNodeRef}
        className={cn(
          'nx-w-full nx-items-center nx-justify-between nx-gap-2',
          !isLink && 'nx-w-full nx-text-left',
          classes.link,
          active ? classes.active : classes.inactive,
          !isDragging
            ? 'hover:nx-bg-blue-100 dark:hover:nx-bg-primary-100/5'
            : 'nx-bg-transparent hover:nx-bg-transparent',
          active && isDragActive && 'nx-bg-blue-100',
        )}
        onClick={(e) => {
          e.preventDefault()
          if (isDragActive) return
          router.push(item.route, item.route, { shallow: true })
          const clickedToggleIcon = ['svg', 'path'].includes(
            (e.target as HTMLElement).tagName.toLowerCase(),
          )
          if (clickedToggleIcon) {
            e.preventDefault()
          }

          if (isLink) {
            if (active || clickedToggleIcon) {
              // If it's focused, we toggle it. Otherwise, always open it.

              TreeState[item.route] = !open
            } else {
              TreeState[item.route] = true
              setMenu(false)
            }
            rerender({})
            return
          }
          if (active) return
          TreeState[item.route] = !open
          rerender({})
        }}
      >
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className={cn('nx-w-full [word-break:break-word]')}
          style={{ background: 'gold' }}
        >
          {item.title}
        </div>
        <ArrowRightIcon
          className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
          pathClassName={cn(
            'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
            open && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
          )}
        />
      </div>
      <Collapse
        className={cn('nx-pt-1 ltr:nx-pr-0 rtl:nx-pl-0')}
        isOpen={isCollapseOpen}
        isDragActive={isDragActive}
      >
        {Array.isArray(item.children) ? (
          <Menu
            className={cn(classes.border, 'ltr:nx-ml-3 rtl:nx-mr-3')}
            directories={item.children}
            base={item.route}
            anchors={anchors}
          />
        ) : null}
      </Collapse>
    </li>
  )
}

export function Separator({ item }: { item: PageItem | Item }): ReactElement {
  const { id, title } = item
  const { setDragItem } = useDndTree()
  const {
    setNodeRef,
    listeners,
    attributes,
    isDragging: isDragActive,
  } = useSortable({
    id,
    data: item,
  })

  useEffect(() => {
    if (!isDragActive) return
    setDragItem(item)
  }, [isDragActive])

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        '[word-break:break-word]',
        title
          ? 'nx-mb-2 nx-mt-5 nx-px-2 nx-py-1.5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100'
          : 'nx-my-4',
        isDragActive && classes.drag,
      )}
    >
      {title ? (
        <span className="cursor-default">{title}</span>
      ) : (
        <hr className="nx-mx-2 nx-border-t nx-border-gray-200 dark:nx-border-primary-100/10" />
      )}
    </li>
  )
}

function File({ item }: { item: PageItem | Item; anchors: Heading[] }): ReactElement {
  const { isDragging, setDragItem } = useDndTree()
  const route = useFSRoute()
  const onFocus = useContext(OnFocusItemContext)

  const disabled = item.name === 'index'
  const {
    setNodeRef,
    listeners,
    attributes,
    isDragging: isDragActive,
  } = useSortable({
    id: item.id,
    data: item,
    disabled,
  })

  const router = useRouter()

  // It is possible that the item doesn't have any route - for example an external link.
  const active = !isDragActive && item.route && [route, route + '/'].includes(item.route + '/')
  const { setMenu } = useMenu()

  if (['newPage', 'newFolder', 'newSeparator'].includes(item.type)) {
    const map: Record<string, ActionType> = {
      newPage: 'page',
      newFolder: 'folder',
      newSeparator: 'separator',
    }

    return <AddInputs type={map[item.type]} />
  }

  useEffect(() => {
    if (!isDragActive) return
    setDragItem(item)
  }, [isDragActive])

  return (
    <li
      className={cn(classes.list, { active }, isDragActive && classes.drag)}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div
        className={cn(classes.link, !isDragging && active ? classes.active : classes.inactive)}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault()
            return
          }
          router.push((item as PageItem).href || item.route)
          setMenu(false)
        }}
        onFocus={(e) => {
          if (isDragging) {
            e.preventDefault()
            return
          }
          onFocus?.(item.route)
        }}
        onBlur={(e) => {
          if (isDragging) {
            e.preventDefault()
            return
          }
          onFocus?.(null)
        }}
      >
        {item.title}
      </div>
    </li>
  )
}

interface MenuProps {
  directories: PageItem[] | Item[]
  anchors: Heading[]
  base?: string
  className?: string
  onlyCurrentDocs?: boolean
}

export function Menu({
  directories,
  anchors,
  className,
  onlyCurrentDocs,
}: MenuProps): ReactElement {
  return (
    <ul className={cn(classes.list, className, 'nx-relative')}>
      {directories.map((item) =>
        !onlyCurrentDocs || item.isUnderCurrentDocsTree ? (
          item.type === 'menu' ||
          item.kind === 'Folder' ||
          (item.children && (item.children.length || !item.withIndexPage)) ? (
            <Folder key={item.id} item={item} anchors={anchors} />
          ) : item.type === 'separator' ? (
            <Separator key={item.id} item={item} />
          ) : (
            <File key={item.id} item={item} anchors={anchors} />
          )
        ) : null,
      )}
    </ul>
  )
}

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
  const { isFolding, setIsFolding } = useSidebar()
  const config = useConfig()
  const { menu, setMenu } = useMenu()
  const router = useRouter()
  const [focused, setFocused] = useState<null | string>(null)
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
    setFocused(null)
    setIsFolding(false)
    setMenu(false)
    TreeState = Object.create(null)
  }, [isFolding])

  const hasI18n = config.i18n.length > 0
  const hasMenu = config.darkMode || hasI18n || config.sidebar.toggleButton

  const [directories, setDragItem] = useState(docsDirectories)

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
        <DndTree items={directories} onItemsChanged={setDragItem}>
          <FocusedItemContext.Provider value={focused}>
            <OnFocusItemContext.Provider
              value={(item) => {
                setFocused(item)
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
                {/* without asPopover check <Collapse />'s inner.clientWidth on `layout: "raw"` will be 0 and element will not have width on initial loading */}
                {(!asPopover || !showSidebar) && (
                  <Collapse isOpen={showSidebar} horizontal={true}>
                    <Menu
                      className="nextra-menu-desktop max-md:nx-hidden"
                      // The sidebar menu, shows only the docs directories.
                      directories={docsDirectories}
                      // When the viewport size is larger than `md`, hide the anchors in
                      // the sidebar when `floatTOC` is enabled.
                      anchors={config.toc.float ? [] : anchors}
                      onlyCurrentDocs
                    />
                  </Collapse>
                )}
                {mounted && window.innerWidth < 768 && (
                  <Menu
                    className="nextra-menu-mobile md:nx-hidden"
                    // The mobile dropdown menu, shows all the directories.
                    directories={fullDirectories}
                    // Always show the anchor links on mobile (`md`).
                    anchors={anchors}
                  />
                )}
              </div>
            </OnFocusItemContext.Provider>
          </FocusedItemContext.Provider>
        </DndTree>
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
