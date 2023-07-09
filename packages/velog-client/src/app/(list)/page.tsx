import getTrendingPosts from '@/actions/getTrendingPost'
import TrendingPosts from '@/features/home/components/TrendingPosts/TrendingPosts'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Home({ children }: Props) {
  const data = await getTrendingPosts()
  return (
    <>
      {children}
      <TrendingPosts data={data} />
    </>
  )
}
