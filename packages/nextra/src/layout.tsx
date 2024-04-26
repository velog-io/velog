import type { ReactElement } from 'react'
import { SSGContext } from './ssg.js'
import { useInternals } from './use-internals.js'

export default function NextraLayout({
  __nextra_pageMap,
  __nextra_dynamic_opts,
  children,
  ...props
}: any): ReactElement {
  const { context, Layout } = useInternals()
  const { Content, ...restContext } = context

  console.log('pageOpts', context.pageOpts)
  return (
    <Layout {...restContext} pageProps={props}>
      <SSGContext.Provider value={props}>
        <Content {...props}>{children}</Content>
      </SSGContext.Provider>
    </Layout>
  )
}
