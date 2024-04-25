import { useRouter } from 'next/router'
import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
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
    const { title } = useConfig()

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

export default config
