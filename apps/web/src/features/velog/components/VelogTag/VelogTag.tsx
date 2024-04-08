import { UserTags } from '@/graphql/server/generated/server'
import VelogTagVerticalList from '../VelogTagVerticalList'
import VelogTagHorizontalList from '../VelogTagHorizontalList'

type Props = {
  tag?: string
  username: string
  userTags: UserTags
}

function VelogTag({ tag, username, userTags }: Props) {
  const { tags, posts_count: postsCount } = userTags
  return (
    <>
      <VelogTagVerticalList active={tag} tags={tags} postsCount={postsCount} username={username} />
      <VelogTagHorizontalList
        active={tag}
        tags={tags}
        postsCount={postsCount}
        username={username}
      />
    </>
  )
}

export default VelogTag
