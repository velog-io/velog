import getAds from '@/actions/getAds'
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
  const { timeframe = 'week' } = params
  const data = await getTrendingPosts({ timeframe, limit: ENV.defaultPostLimit })
  const ad = await getAds({ limit: 1, type: 'feed' })

  console.log('ad', ad)
  const insertedData = [...data.slice(0, 3), ad[0], ...data.slice(3)].filter(Boolean)

  return <TrendingPosts data={insertedData} />
}
