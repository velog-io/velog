import PostViewer from '@/features/post/components/PostViewer'

interface Props {
  params: { urlSlug: string; username: string }
}

export default async function PostViewerPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  if (!params.username.includes(encodedSymbol)) return <></>
  return <PostViewer />
}
