import TrendingWriterLayout from '@/components/Layouts/TrendingWriterLayout'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <TrendingWriterLayout>{children}</TrendingWriterLayout>
}
