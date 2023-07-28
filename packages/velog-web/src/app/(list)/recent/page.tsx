import getRecentPost from '@/actions/getRecentPost'
import { ENV } from '@/env'
import RecentPosts from '@/features/home/components/RecentPosts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '최신 포스트 - velog',
  description: '벨로그에서 다양한 개발자들이 작성한 따끈따끈한 최신 포스트들을 읽어보세요.',
}

export const revalidate = 60

export default async function Recent() {
  const data = await getRecentPost({ limit: ENV.defaultPostLimit })
  return <RecentPosts data={data} />
}
