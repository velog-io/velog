'use client'

import ConditionalBackgroundProvider from '@/providers/ConditionalBackgroundProvider'
import InteractiveViewProvider from '@/providers/InteractiveViewProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import SangteContextProvider from '@/providers/SangteContextProvider'
import ThemeProvier from '@/providers/ThemeProvier'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <ConditionalBackgroundProvider>
      <ReactQueryProvider>
        <SangteContextProvider>
          <ThemeProvier>
            <InteractiveViewProvider>{children}</InteractiveViewProvider>
          </ThemeProvier>
        </SangteContextProvider>
      </ReactQueryProvider>
    </ConditionalBackgroundProvider>
  )
}

export default CoreProvider
