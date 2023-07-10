import BasicLayout from '@/components/Layouts/BasicLayout'

type Props = {
  children: React.ReactNode
}

export default function SearchPage({ children }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
