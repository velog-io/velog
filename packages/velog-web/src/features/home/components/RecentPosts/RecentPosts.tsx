import getRecentPost from '@/actions/getRecentPost'
import PostCardGrid from '@/features/post/components/PostCardGrid/PostCardGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '최신 포스트 - velog',
  description:
    '벨로그에서 다양한 개발자들이 작성한 따끈따끈한 최신 포스트들을 읽어보세요.',
}

async function RecentPosts() {
  const data = await getRecentPost({
    limit: 24,
  })

  return (
    <PostCardGrid data={data} forHome={true} forPost={false} loading={!data} />
  )
}

export default RecentPosts
