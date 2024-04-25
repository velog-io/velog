import '@packages/nextra-theme-docs/style.css'
import styles from './NextraLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import * as context from './context'
import NextraDocLayout from '@packages/nextra-theme-docs'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

// pageOpts: PageOpts
// pageProps: any
// themeConfig: ThemeConfig
// children: ReactNode

function NextraLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <NextraDocLayout {...context} pageProps={{}}>
        {children}
      </NextraDocLayout>
      {children}
    </div>
  )
}

export default NextraLayout
