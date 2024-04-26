import type { ReactElement } from 'react'
import { SSGContext } from './ssg'
import { useInternals } from './use-internals'

export default function Nextra({
  __nextra_pageMap,
  __nextra_dynamic_opts,
  ...props
}: any): ReactElement {
  const { context, Layout } = useInternals()
  const { Content, ...restContext } = context

  console.log('pageOpts', context.pageOpts)
  return (
    <Layout {...restContext} pageProps={props}>
      <SSGContext.Provider value={props}>
        <Content {...props} />
      </SSGContext.Provider>
    </Layout>
  )
}
