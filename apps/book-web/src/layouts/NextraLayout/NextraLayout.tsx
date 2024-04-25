import * as context from './context'
import NextraDocLayout, { useInternals } from '@packages/nextra-theme-docs'

type Props = {
  children: React.ReactNode
}

// pageOpts: PageOpts
// pageProps: any
// themeConfig: ThemeConfig
// children: ReactNode

function NextraLayout({ children }: Props) {
  const { context, Layout } = useInternals()
  console.log('cotent', context)
  console.log('Layout', Layout)
  return (
    <NextraDocLayout {...context} pageProps={{}}>
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
