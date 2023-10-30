import getTrendingPosts from '@/actions/getTrendingPosts'
import { ENV } from '@/env'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Home({ params }: Props) {
  const { timeframe = 'week' } = params
  const data = await getTrendingPosts({ timeframe, limit: ENV.defaultPostLimit })

  if (!data) {
    redirect('/')
  }

  return <TrendingPosts data={data} />
}
