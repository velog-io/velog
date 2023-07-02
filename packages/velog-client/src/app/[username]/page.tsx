import BasicLayout from '@/components/Layouts/BasicLayout'
import { usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
  params: { username: string }
}

export default function Velog({ children, params }: Props) {
  const username = decodeURIComponent(params.username).replace('@', '')
  console.log(username)
  return <BasicLayout>{children}</BasicLayout>
}
