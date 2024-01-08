'use client'

import Jazzbar from '@/components/Jazzbar'
import React, { createContext, useState } from 'react'

interface JazzbarContextValue {
  value: number
  setValue: (value: number) => void
  progress(event: ProgressEvent): void
  fakeProgress(): void | NodeJS.Timer
}

type Props = {
  children: React.ReactNode
}

const JazzbarContext = createContext<JazzbarContextValue>({
  value: 0,
  setValue: () => {},
  progress: () => {},
  fakeProgress: () => {},
})

export const JazzbarProvider = ({ children }: Props) => {
  const [value, setValue] = useState(0)

  const progress = (event: ProgressEvent) => {
    if (!event.total) return
    const percentage = (event.loaded * 100) / event.total
    const value = Math.round(percentage)
    setValue(value)
  }

  const fakeProgress = () => {
    let i = 1
    const initValue = 20
    const intervalTime = setInterval(() => {
      const add = i * 2
      if (add + initValue > 90) {
        clearInterval(intervalTime)
      }
      setValue(initValue + add)
      i++
    }, 100)
    return intervalTime
  }

  return (
    <JazzbarContext.Provider
      value={{
        value,
        setValue,
        progress,
        fakeProgress,
      }}
    >
      <Jazzbar />
      {children}
    </JazzbarContext.Provider>
  )
}

export default JazzbarContext
