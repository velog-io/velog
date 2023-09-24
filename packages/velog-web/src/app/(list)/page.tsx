import getTrendingPosts from '@/actions/getTrendingPost'
import { ENV } from '@/env'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Home({ params }: Props) {
  const { timeframe = 'month' } = params
  const data = await getTrendingPosts({ timeframe, limit: ENV.defaultPostLimit })
  return <TrendingPosts data={data} />
}
