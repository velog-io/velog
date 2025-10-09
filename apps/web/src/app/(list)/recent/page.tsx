import getCachedPosts from '@/prefetch/getCachedPosts'
import CachedRecentPosts from '@/features/home/components/RecentPosts/CachedRecentPosts'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: '최신 포스트 - velog',
  description: '벨로그에서 다양한 개발자들이 작성한 따끈따끈한 최신 포스트들을 읽어보세요.',
}

export default async function RecentHome() {
  const data = await getCachedPosts({ limit: 50 })

  if (!data || data.posts.length === 0) {
    notFound()
  }

  return <CachedRecentPosts data={data} />
}
