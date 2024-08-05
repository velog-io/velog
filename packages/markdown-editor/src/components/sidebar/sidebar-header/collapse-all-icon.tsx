import { useEffect, useRef } from 'react'
import { useSidebar } from '@/contexts/sidebar'
import { CollapseAllIcon as Icon } from '@/nextra/icons/collapse-all'
import { useRouter } from 'next/router'
import { useUrlSlug } from '@/hooks'

type Props = {
  className: string
}

export const CollapseAllIcon = ({ className }: Props) => {
  const { setIsFolding } = useSidebar()
  const { bookUrlSlug } = useUrlSlug()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (!timeoutRef.current) return
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const onClick = () => {
    router.push(bookUrlSlug)
    setIsFolding(true)
  }

  return (
    <span className={className} onClick={onClick}>
      <Icon />
    </span>
  )
}
