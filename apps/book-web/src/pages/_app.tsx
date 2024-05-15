import '@packages/nextra-editor/style.css'
import '../styles/global.css'

import type { AppProps } from 'next/app'
import CoreProvider from '@/provider/CoreProvider'

type Props = {
  mdxSource: string
} & AppProps

const App = ({ Component, pageProps }: Props) => {
  return (
    <CoreProvider>
      <Component {...pageProps} />
    </CoreProvider>
  )
}

export default App
