import getTrendingPosts from '@/actions/getTrendingPost'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  searchParams: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Home({ children, searchParams }: Props) {
  const { timeframe = 'week' } = searchParams
  const data = await getTrendingPosts({ timeframe })

  return (
    <>
      {children}
      <TrendingPosts data={data} />
    </>
  )
}
