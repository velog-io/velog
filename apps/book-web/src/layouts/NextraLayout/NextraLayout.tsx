import NextraDocLayout from '@packages/nextra-theme-docs'
import useInternals from '@packages/nextra/use-internals'

type Props = {
  children: React.ReactNode
}

// pageOpts: PageOpts
// pageProps: any
// themeConfig: ThemeConfig
// children: ReactNode

function NextraLayout({ children }: Props) {
  const { context, Layout } = useInternals()
  console.log('context', context)
  console.log('Layout', Layout)
  return <div>{children}</div>
}

export default NextraLayout
