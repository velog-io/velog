import getPostByUrlSlug from '@/actions/getPostByUrlSlug'
import PostViewer from '@/features/post/components/PostViewer'
import { getUsernameFromParams } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface Props {
  params: { urlSlug: string; username: string }
}

export default async function PostViewerPage({ params }: Props) {
  const { username, urlSlug } = params

  const post = await getPostByUrlSlug({
    username: getUsernameFromParams({ username }),
    url_slug: decodeURI(urlSlug),
  })

  if (!post) {
    notFound()
  }

  // return <PostViewer post={post} />
  return <div>postView</div>
}
