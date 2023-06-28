'use client'

import ConditionalBackgroundProvider from '@/providers/ConditionalBackgroundProvider'
import InteractiveViewProvider from '@/providers/InteractiveViewProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import SangteContextProvider from '@/providers/SangteContextProvider'
import ThemeProvier from '@/providers/ThemeProvier'
import UserLoaderProvider from '@/providers/UserLoaderProvider'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <ConditionalBackgroundProvider>
      <ReactQueryProvider>
        <SangteContextProvider>
          <UserLoaderProvider>
            <ThemeProvier>
              <InteractiveViewProvider>{children}</InteractiveViewProvider>
            </ThemeProvier>
          </UserLoaderProvider>
        </SangteContextProvider>
      </ReactQueryProvider>
    </ConditionalBackgroundProvider>
  )
}

export default CoreProvider
