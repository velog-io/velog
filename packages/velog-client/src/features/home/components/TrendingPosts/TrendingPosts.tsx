import { Metadata } from 'next'
import styles from './TrendingPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import getTrendingPosts from '@/actions/getTrendingPost'
import { useTimeframe } from '@/features/home/state/timeframe'
import PostCardGrid from '@/features/post/components/PostCardGrid/PostCardGrid'

const cx = bindClassNames(styles)

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

async function TrendingPosts() {
  const data = await getTrendingPosts({
    limit: 1,
    offset: 0,
    timeframe: 'week',
  })

  return (
    <>
      <PostCardGrid
        posts={data || []}
        forHome={true}
        forPost={false}
        loading={!data}
      />
    </>
  )
}

export default TrendingPosts
