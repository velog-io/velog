import getCuratedPostsPrefetch from '@/prefetch/getCuratedPosts'
import CuratedPosts from '@/features/home/components/CuratedPosts/CuratedPosts'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: '추천 포스트 - velog',
  description: '벨로그에서 엄선한 추천 포스트들을 읽어보세요.',
}

export default async function CuratedHome() {
  const data = await getCuratedPostsPrefetch({ limit: 50 })

  if (!data || data.posts.length === 0) {
    notFound()
  }

  return <CuratedPosts data={data} />
}