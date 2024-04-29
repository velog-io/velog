import type { PageItem, Item, Heading } from '@packages/nextra-theme-docs'

export const docsDirectories: PageItem[] = [
  {
    title: 'Introduction',
    kind: 'MdxPage',
    name: 'index',
    route: '/',
    type: 'doc',
    isUnderCurrentDocsTree: true,
  },
  {
    title: 'Another Page',
    kind: 'MdxPage',
    name: 'another',
    route: '/another',
    type: 'doc',
    isUnderCurrentDocsTree: true,
  },
  {
    title: 'Advanced (A Folder)',
    kind: 'MdxPage',
    name: 'advanced',
    route: '/advanced',
    withIndexPage: true,
    children: [
      {
        title: 'Satori',
        kind: 'MdxPage',
        name: 'satori',
        route: '/advanced/satori',
        type: 'doc',
        isUnderCurrentDocsTree: true,
      },
    ],
    type: 'doc',
    isUnderCurrentDocsTree: true,
  },
  { title: 'About', type: 'page', kind: 'MdxPage', name: 'about', route: '/about' },
]

export const flatDirectories: Item[] = [
  { title: 'Introduction', kind: 'MdxPage', name: 'index', route: '/', type: 'doc' },
  { title: 'Another Page', kind: 'MdxPage', name: 'another', route: '/another', type: 'doc' },
  { title: 'Satori', kind: 'MdxPage', name: 'satori', route: '/advanced/satori', type: 'doc' },
  { title: 'About', type: 'page', kind: 'MdxPage', name: 'about', route: '/about' },
]

export const fullDirectories: Item[] = [
  { title: 'Introduction', kind: 'MdxPage', name: 'index', route: '/', type: 'doc' },
  { title: 'Another Page', kind: 'MdxPage', name: 'another', route: '/another', type: 'doc' },
  {
    title: 'Advanced (A Folder)',
    kind: 'MdxPage',
    name: 'advanced',
    route: '/advanced',
    withIndexPage: true,
    children: [
      { title: 'Satori', kind: 'MdxPage', name: 'satori', route: '/advanced/satori', type: 'doc' },
    ],
    type: 'doc',
  },
  { title: 'About', type: 'page', kind: 'MdxPage', name: 'about', route: '/about' },
]

export const asPopover = false
export const headings: Heading[] = []
export const includePlaceholder = true

type SideBarProps = {
  docsDirectories: PageItem[]
  flatDirectories: Item[]
  fullDirectories: Item[]
  asPopover?: boolean
  headings: Heading[]
  includePlaceholder: boolean
}

export const sidebarProps: SideBarProps = {
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover,
  headings,
  includePlaceholder,
}
