import VelogPage from '../../page'

interface Props {
  params: { username: string }
}

export default async function VelogPosts({ params }: Props) {
  return (
    <>
      <div>velogPosts</div>
      <VelogPage params={params} />
    </>
  )
}
