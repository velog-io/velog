'use client'

import Jazzbar from '@/components/Jazzbar'
import { AxiosProgressEvent } from 'axios'
import React, { createContext, useState } from 'react'

interface JazzbarContextValue {
  value: number
  setValue: (value: number) => void
  progress(event: AxiosProgressEvent): void
}

const JazzbarContext = createContext<JazzbarContextValue>({
  value: 0,
  setValue: () => {},
  progress: () => {},
})

type Props = {
  children: React.ReactNode
}

export const JazzbarProvide = ({ children }: Props) => {
  const [value, setValue] = useState(0)

  const onProgress = (event: AxiosProgressEvent) => {
    if (!event.total) return
    const percentage = (event.loaded * 100) / event.total
    const value = Math.round(percentage) // alwayls 100%
    setValue(value)
  }

  return (
    <JazzbarContext.Provider
      value={{
        value,
        setValue,
        progress: onProgress,
      }}
    >
      <Jazzbar />
      {children}
    </JazzbarContext.Provider>
  )
}

export default JazzbarContext
