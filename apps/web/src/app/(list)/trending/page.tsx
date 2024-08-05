import TrendingHome from '@/app/(list)/page'
import { Metadata } from 'next'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default function Trending({ params }: Props) {
  return <TrendingHome params={params} />
}
