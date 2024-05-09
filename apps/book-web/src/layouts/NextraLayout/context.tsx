import React from 'react'
import { useRouter } from 'next/router'
import type { DocsThemeConfig, PageMapItem, PageOpts } from '@packages/nextra-editor'

const bookUrl = `/@test_carrick/learning-bunjs-is-fun`
export const pageMap: PageMapItem[] = [
  {
    kind: 'Meta',
    data: {
      index: { title: 'Introduction' },
      themes: {
        title: 'Themes',
        type: 'separator',
      },
      another: { title: 'Pectus bardus' },
      advanced: { title: 'Advanced (A Folder)' },
      hello: { title: 'hello' },
      about: { title: 'About' },
    },
  },
  { kind: 'MdxPage', name: 'index', route: bookUrl },
  { kind: 'MdxPage', name: 'advanced', route: `${bookUrl}/advanced` },
  {
    kind: 'Folder',
    name: 'advanced',
    route: `${bookUrl}/advanced`,
    children: [
      { kind: 'Meta', data: { satori: { title: 'Satori' }, hello: { title: 'hello' } } },
      { kind: 'MdxPage', name: 'hello', route: `${bookUrl}/advanced/hello` },
      {
        kind: 'Folder',
        name: 'hello',
        route: `${bookUrl}/advanced/hello`,
        children: [
          { kind: 'Meta', data: { hi: { title: 'Hi' } } },
          {
            kind: 'MdxPage',
            name: 'hi',
            route: `${bookUrl}/advanced/hello/hi`,
          },
        ],
      },
      {
        kind: 'MdxPage',
        name: 'satori',
        route: `${bookUrl}/advanced/satori`,
      },
    ],
  },
  { kind: 'MdxPage', name: 'another', route: `${bookUrl}/another` },
  { kind: 'MdxPage', name: 'about', route: `${bookUrl}/about` },
]

export const pageOpts: PageOpts = {
  frontMatter: {},
  filePath: '',
  route: '',
  pageMap: pageMap,
  title: 'Welcome to Nextra',
  headings: [],
}

export const themeConfig: DocsThemeConfig = {
  toc: {},
  logo: <span>Learning bunJS is Fun!</span>,
  logoLink: `${bookUrl}`,
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
