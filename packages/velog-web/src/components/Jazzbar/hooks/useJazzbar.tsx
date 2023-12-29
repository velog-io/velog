import JazzbarContext from '@/providers/JazzbarProvider'
import { useContext } from 'react'

const useJazzbar = () => {
  const jazzbar = useContext(JazzbarContext)
  return jazzbar
}

export default useJazzbar
