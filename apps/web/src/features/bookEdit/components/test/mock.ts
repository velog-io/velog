import { NavbarFlatDirectories, NavbarItems } from '@packages/nextra-theme-docs'

export const navbarFlatDirectories: NavbarFlatDirectories = [
  {
    title: 'Introduction',
    kind: 'MdxPage',
    name: 'index',
    route: '/',
    type: 'doc',
  },
  {
    title: 'Another Page',
    kind: 'MdxPage',
    name: 'another',
    route: '/another',
    type: 'doc',
  },
  {
    title: 'Satori',
    kind: 'MdxPage',
    name: 'satori',
    route: '/advanced/satori',
    type: 'doc',
  },
  {
    title: 'Hi',
    kind: 'MdxPage',
    name: 'hi',
    route: '/advanced/ hello/hi',
    type: 'doc',
  },
  {
    title: 'Balanced Client Driven Flexibility 6614ba2e52f87b67fc14427b',
    kind: 'MdxPage',
    name: 'Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
    route: '/Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
    type: 'doc',
  },
]

export const navbarItems: NavbarItems = [
  {
    name: 'contact',
    route: '',
    title: 'Contact ↗',
    type: 'page',
    href: 'https://twitter.com/shuding_',
    newWindow: true,
  },
]
