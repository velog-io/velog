import getTrendingPosts from '@/actions/getTrendingPost'
import TrendingPosts from '@/features/home/components/TrendingPosts/TrendingPosts'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export const revalidate = 20

export default async function Home({ children }: Props) {
  const data = await getTrendingPosts()
  return (
    <>
      {children}
      <Suspense>
        <TrendingPosts data={data} />
      </Suspense>
    </>
  )
}
