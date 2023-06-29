import BasicLayout from '@/components/Layouts/BasicLayout'

type Props = {
  children: React.ReactNode
}

export default function Write({ children }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
