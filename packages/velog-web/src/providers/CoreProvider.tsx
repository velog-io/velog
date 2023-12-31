import ConditionalBackgroundProvider from '@/providers/ConditionalBackgroundProvider'
import GtagProvider from '@/providers/GtagProvider'
import InteractiveViewProvider from '@/providers/InteractiveViewProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import SangteContextProvider from '@/providers/SangteContextProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import SentryProvider from './SentryProvider'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <>
      {/* run in server side */}
      <GtagProvider />
      <SentryProvider />
      {/* run in client side */}
      <ConditionalBackgroundProvider>
        <ReactQueryProvider>
          <SangteContextProvider>
            <ThemeProvider>
              <InteractiveViewProvider>{children}</InteractiveViewProvider>
            </ThemeProvider>
          </SangteContextProvider>
        </ReactQueryProvider>
      </ConditionalBackgroundProvider>
    </>
  )
}

export default CoreProvider
