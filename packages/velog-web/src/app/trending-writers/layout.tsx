import BasicLayout from '@/components/Layouts/BasicLayout'
import TrendingWriterLayout from '@/components/Layouts/TrendingWriterLayout'

type Props = {
  children: React.ReactNode
}

export default function SettingLayout({ children }: Props) {
  return (
    <BasicLayout>
      <TrendingWriterLayout>{children}</TrendingWriterLayout>
    </BasicLayout>
  )
}
