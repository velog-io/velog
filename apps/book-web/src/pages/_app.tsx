import '@packages/nextra-editor/style.css'
import '../styles/global.css'

import type { AppProps } from 'next/app'
import CoreProvider from '@/provider/CoreProvider'
import { HydrationBoundary } from '@tanstack/react-query'

type Props = {
  mdxSource: string
} & AppProps

const App = ({ Component, pageProps }: Props) => {
  return (
    <CoreProvider>
      <HydrationBoundary state={pageProps.dehydratedProps}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </CoreProvider>
  )
}

export default App
