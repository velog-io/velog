import { useEffect, useRef } from 'react'
import { useSidebar } from '@/contexts/sidebar'
import { CollapseAllIcon as Icon } from '@/nextra/icons/collapse-all'
import { useRouter } from 'next/router'
import { useUrlSlug } from '@/hooks/use-url-slug'

type Props = {
  className: string
}

const CollapseAllIcon = ({ className }: Props) => {
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
    setIsFolding(true)
    router.push(bookUrlSlug)
  }

  return (
    <span className={className} onClick={onClick}>
      <Icon />
    </span>
  )
}

export default CollapseAllIcon
