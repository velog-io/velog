import Home from '@/app/(list)/page'
import { Metadata } from 'next'

type Props = {
  params: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Trending({ params }: Props) {
  return <Home params={params} />
}
