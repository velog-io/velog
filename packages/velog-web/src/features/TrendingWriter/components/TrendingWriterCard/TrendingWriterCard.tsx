import { Post, TrendingWriterPosts, useGetUserFollowInfoQuery } from '@/graphql/generated'
import styles from './TrendingWriterCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useState } from 'react'
import TrendingWriterCardSkeleton from './TrendingWriterCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  writerId: string
  posts: TrendingWriterPosts[]
  thumbnail: string
  displayName: string
}

function TrendingWriterCard({ writerId, posts, thumbnail, displayName }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { id: writerId } })
  const [isFollowed, setIsFollowed] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowed(!!data?.user?.is_followed)
  }, [data])

  if (isLoading) return <TrendingWriterCardSkeleton />
  return <li className={cx('block')}>{displayName}</li>
}

export default TrendingWriterCard
