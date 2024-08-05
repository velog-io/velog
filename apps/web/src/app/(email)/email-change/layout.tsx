import CenterLayout from '@/components/Layouts/CenterLayout'

type Props = {
  children: React.ReactNode
}

export default function Page({ children }: Props) {
  return <CenterLayout>{children}</CenterLayout>
}
