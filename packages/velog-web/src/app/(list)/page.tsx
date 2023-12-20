import getAds from '@/prefetch/getAds'
import getTrendingPosts from '@/prefetch/getTrendingPosts'
import { ENV } from '@/env'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function TrendingHome({ params }: Props) {
  const { timeframe = 'week' } = params
  const data = await getTrendingPosts({ timeframe, limit: ENV.defaultPostLimit })
  const ad = await getAds({ limit: 1, type: 'feed' })

  if (!data) {
    notFound()
  }

  const insertedData = [...data.slice(0, 3), ad[0], ...data.slice(3)].filter(Boolean)

  return <TrendingPosts data={insertedData} />
}
