import Home from '@/app/(list)/page'
import { Metadata } from 'next'

type Props = {
  searchParams: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Trending({ searchParams }: Props) {
  return <Home searchParams={searchParams} />
}
