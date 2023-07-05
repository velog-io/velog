'use client'

import { PartialPost } from '@/types/post'
import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useState } from 'react'
import useAdblockDetect from '@/hooks/useAdblockDetect'
import PostCard from '@/features/post/components/PostCard/PostCard'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {
  posts: (PartialPost | undefined)[]
  loading?: boolean
  forHome: boolean
  forPost: boolean
}

function PostCardGrid({
  posts,
  loading,
  forHome = false,
  forPost = false,
}: Props) {
  const [adBlocked, setAdBlocked] = useState(false)

  // useAdblockDetect().then((detected) => {
  //   if (!detected) return
  //   setAdBlocked(true)
  // })

  return (
    <div className={cx('block')}>
      {posts.map((post, i) => {
        if (!post) return null
        return (
          <PostCard
            key={post.id}
            post={post}
            forHome={forHome}
            forPost={forPost}
          />
        )
      })}
    </div>
  )
}

export default PostCardGrid
