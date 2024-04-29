import '@packages/nextra-theme-docs/style.css'

import type { AppProps } from 'next/app'

type Props = {
  mdxSource: string
} & AppProps

const App = ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}

export default App
