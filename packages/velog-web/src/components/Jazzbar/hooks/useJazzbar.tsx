import JazzbarContext from '@/providers/JazzbarProvider'
import { useContext } from 'react'

const useJazzbar = () => {
  const jazzbar = useContext(JazzbarContext)
  const { set, value } = jazzbar
  return [set, value] as [typeof set, typeof value]
}

export default useJazzbar
