import getPostByUrlSlug from '@/actions/getPostByUrlSlug'
import PostViewer from '@/features/post/components/PostViewer'

interface Props {
  params: { urlSlug: string; username: string }
}

export default async function PostViewerPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  if (!params.username.includes(encodedSymbol)) return <></>
  const { username, urlSlug } = params
  const post = await getPostByUrlSlug({
    username: username.replace(encodedSymbol, ''),
    url_slug: decodeURI(urlSlug),
  })

  return <PostViewer post={post} />
}
