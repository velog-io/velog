import getRecentPost from '@/actions/getRecentPost'
import RecentPosts from '@/features/home/components/RecentPosts'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: '최신 포스트 - velog',
  description:
    '벨로그에서 다양한 개발자들이 작성한 따끈따끈한 최신 포스트들을 읽어보세요.',
}

export default async function Recent({ children }: Props) {
  const data = await getRecentPost()
  return (
    <>
      {children}
      <RecentPosts data={data} />
    </>
  )
}
