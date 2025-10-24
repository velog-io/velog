import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import getTag from '@/prefetch/getTag'
import getTagPosts from '@/prefetch/getTagPosts'
import TagPosts from '@/features/tag/components/TagPosts/TagPosts'
import HomeLayout from '@/components/Layouts/HomeLayout'

type Props = {
  params: Promise<{
    tagName: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagName } = await params
  const decodedTagName = decodeURIComponent(tagName)
  const tag = await getTag(decodedTagName)

  if (!tag) {
    return {
      title: '태그를 찾을 수 없습니다 - velog',
    }
  }

  return {
    title: `${tag.name} - velog`,
    description: tag.description || `${tag.name} 태그가 달린 포스트 ${tag.posts_count}개`,
  }
}

export const revalidate = 60

export default async function TagPage({ params }: Props) {
  const { tagName } = await params
  const decodedTagName = decodeURIComponent(tagName)

  const [tag, posts] = await Promise.all([getTag(decodedTagName), getTagPosts(decodedTagName)])

  if (!tag) {
    notFound()
  }

  return (
    <HomeLayout hideTab>
      <TagPosts tag={tag.name} initialData={posts} postsCount={tag.posts_count} />
    </HomeLayout>
  )
}
