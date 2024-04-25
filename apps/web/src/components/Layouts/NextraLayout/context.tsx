import { useRouter } from 'next/router'

import { DocsThemeConfig, PageMapItem, PageOpts, useConfig } from '@packages/nextra-theme-docs'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

export const pageOpts: PageOpts = {
  frontMatter: {},
  filePath: 'pages/index.mdx',
  route: '/',
  timestamp: 1712618681000,
  pageMap: [
    {
      kind: 'MdxPage',
      name: 'Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
      route: '/Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
    },
    {
      kind: 'Meta',
      data: {
        index: { title: 'Introduction' },
        another: { title: 'Another Page' },
        advanced: { title: 'Advanced (A Folder)' },
        contact: {
          title: 'Contact ↗',
          type: 'page',
          href: 'https://twitter.com/shuding_',
          newWindow: true,
        },
        about: { title: 'About' },
        'Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b': {
          title: 'Balanced Client Driven Flexibility 6614ba2e52f87b67fc14427b',
        },
      },
    },
    { kind: 'MdxPage', name: 'about', route: '/about' },
    {
      kind: 'Folder',
      name: 'advanced',
      route: '/advanced',
      children: [
        {
          kind: 'Folder',
          name: ' hello',
          route: '/advanced/ hello',
          children: [
            { kind: 'MdxPage', name: 'hi', route: '/advanced/ hello/hi' },
            { kind: 'Meta', data: { hi: { title: 'Hi' } } },
          ],
        },
        { kind: 'MdxPage', name: 'satori', route: '/advanced/satori' },
        { kind: 'Meta', data: { satori: { title: 'Satori' } } },
      ],
    },
    { kind: 'MdxPage', name: 'advanced', route: '/advanced' },
    { kind: 'MdxPage', name: 'another', route: '/another' },
    { kind: 'MdxPage', name: 'index', route: '/' },
  ],
  flexsearch: { codeblocks: true },
  title: 'Welcome to Nextra',
  headings: [],
}

export const pageMap: PageMapItem[] = [
  {
    kind: 'MdxPage',
    name: 'Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
    route: '/Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b',
  },
  {
    kind: 'Meta',
    data: {
      index: { title: 'Introduction' },
      another: { title: 'Another Page' },
      advanced: { title: 'Advanced (A Folder)' },
      contact: {
        title: 'Contact ↗',
        type: 'page',
        href: 'https://twitter.com/shuding_',
        newWindow: true,
      },
      about: { title: 'About' },
      'Balanced_client-driven_flexibility_6614ba2e52f87b67fc14427b': {
        title: 'Balanced Client Driven Flexibility 6614ba2e52f87b67fc14427b',
      },
    },
  },
  { kind: 'MdxPage', name: 'about', route: '/about' },
  {
    kind: 'Folder',
    name: 'advanced',
    route: '/advanced',
    children: [
      {
        kind: 'Folder',
        name: ' hello',
        route: '/advanced/ hello',
        children: [
          { kind: 'MdxPage', name: 'hi', route: '/advanced/ hello/hi' },
          { kind: 'Meta', data: { hi: { title: 'Hi' } } },
        ],
      },
      { kind: 'MdxPage', name: 'satori', route: '/advanced/satori' },
      { kind: 'Meta', data: { satori: { title: 'Satori' } } },
    ],
  },
  { kind: 'MdxPage', name: 'advanced', route: '/advanced' },
  { kind: 'MdxPage', name: 'another', route: '/another' },
  { kind: 'MdxPage', name: 'index', route: '/' },
]

export const themeConfig: DocsThemeConfig = {
  logo: <span>Learning bunJS is Fun!</span>,
  editLink: {
    text: '',
  },
  feedback: {
    content: '',
  },
  footer: {
    component: null,
    text: '',
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Learning bunJS is Fun!',
      }
    }
  },
  head: function useHead() {
    const title = 'hello world'
    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content="Make beautiful websites with Velog & MDX." />
        <meta name="og:description" content="Make beautiful websites with Velog & MDX." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content="velog.io" />
        <meta name="twitter:url" content="velog.io" />
        <meta name="og:title" content={title ? title + ' – Velog' : 'Velog'} />
        <meta property="og:title" content={title ? title + ' – Velog' : 'Velog'} />
        <meta name="apple-mobile-web-app-title" content="Velog" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    )
  },
}
