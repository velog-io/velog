import '@packages/nextra-editor/style.css'
import '../styles/global.css'

import type { AppProps } from 'next/app'

type Props = {
  mdxSource: string
} & AppProps

const App = ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}

export default App
