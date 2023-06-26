'use client'

import { SangteProvider } from 'sangte'

type Props = {
  children: React.ReactNode
}

function SangteContextProvider({ children }: Props) {
  return <SangteProvider>{children}</SangteProvider>
}

export default SangteContextProvider
