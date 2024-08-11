export const indexJSXTemplate = (name: string) => {
  return `
  'use client'

  import { useRouter } from 'next/navigation'
  import { useEffect } from 'react'
  
  const Page = () => {
    const router = useRouter()
    useEffect(() => {
      router.push('${name}')
    }, [])
    return <></>
  }
  
  export default Page
  `
}
