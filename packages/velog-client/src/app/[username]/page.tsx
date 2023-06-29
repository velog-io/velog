import BasicLayout from '@/components/Layouts/BasicLayout'
import { usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
  params: { username: string }
}

export default function Velog({ children, params }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
