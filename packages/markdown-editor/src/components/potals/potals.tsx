import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ModalPotal } from './modal-potal'

export const Potals = () => {
  const [isSetup, setSetup] = useState<boolean>(false)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      setSetup(true)
    }, 200)

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  if (!isSetup) return null
  return (
    <>
      <ModalPotal />
    </>
  )
}
