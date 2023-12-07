import getTrendingPosts from '@/prefetch/getTrendingPosts'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function TrendingHome({ params }: Props) {
  const { timeframe = 'week' } = params
  const data = await getTrendingPosts({ timeframe, limit: 5 })

  if (!data) {
    redirect('/')
  }

  return <TrendingPosts data={data} />
}
