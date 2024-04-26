import NextraDocLayout from '@packages/nextra-theme-docs'
import Layout from '@packages/nextra/layout'

type Props = {
  children: React.ReactNode
}

// pageOpts: PageOpts
// pageProps: any
// themeConfig: ThemeConfig
// children: ReactNode

function NextraLayout({ children }: Props) {
  // const { context, Layout } = useInternals()
  // console.log('context', context)
  // console.log('Layout', Layout)
  return <Layout>{children}</Layout>
}

export default NextraLayout
