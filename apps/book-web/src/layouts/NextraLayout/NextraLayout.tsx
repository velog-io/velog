import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'

type Props = {
  children: React.ReactNode
}

function NextraLayout({ children }: Props) {
  return (
    <NextraDocLayout pageOpts={pageOpts} themeConfig={themeConfig} pageProps={{}}>
      `div`
    </NextraDocLayout>
  )
}

export default NextraLayout
