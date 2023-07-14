'use client'

import ConditionalBackgroundProvider from '@/providers/ConditionalBackgroundProvider'
import GtagProvider from '@/providers/GtagProvider'
import InteractiveViewProvider from '@/providers/InteractiveViewProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import SangteContextProvider from '@/providers/SangteContextProvider'
import ThemeProvier from '@/providers/ThemeProvier'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <>
      <GtagProvider />
      <ConditionalBackgroundProvider>
        <ReactQueryProvider>
          <SangteContextProvider>
            <ThemeProvier>
              <InteractiveViewProvider>{children}</InteractiveViewProvider>
            </ThemeProvier>
          </SangteContextProvider>
        </ReactQueryProvider>
      </ConditionalBackgroundProvider>
    </>
  )
}

export default CoreProvider
