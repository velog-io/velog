import '@packages/markdown-editor/style.css'
import '../styles/global.css'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

import type { AppProps } from 'next/app'
import CoreProvider from '@/provider/CoreProvider'
import { HydrationBoundary } from '@tanstack/react-query'

type Props = {
  mdxSource: string
} & AppProps

const App = ({ Component, pageProps }: Props) => {
  return (
    <ErrorBoundary errorComponent={undefined}>
      <CoreProvider>
        <HydrationBoundary state={pageProps.dehydratedProps}>
          <Component {...pageProps} />
        </HydrationBoundary>
      </CoreProvider>
    </ErrorBoundary>
  )
}

export default App
