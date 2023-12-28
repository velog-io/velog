import Jazzbar from '@/components/Jazzbar'
import React, { createContext, useState } from 'react'

interface JazzbarContextValue {
  value: number
  set(value: number): void
}

const JazzbarContext = createContext<JazzbarContextValue>({
  value: 0,
  set: () => {},
})

type Props = {
  children: React.ReactNode
}

export const JazzbarProvide = ({ children }: Props) => {
  const [value, setValue] = useState(0)
  return (
    <JazzbarContext.Provider
      value={{
        value,
        set: setValue,
      }}
    >
      <Jazzbar />
      {children}
    </JazzbarContext.Provider>
  )
}

export default JazzbarContext
