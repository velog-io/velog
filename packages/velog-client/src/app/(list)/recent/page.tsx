import RecentPosts from '@/features/home/components/RecentPosts'

type Props = {
  children: React.ReactNode
}

export default function Recent({ children }: Props) {
  return (
    <>
      {children}
      <RecentPosts />
    </>
  )
}
