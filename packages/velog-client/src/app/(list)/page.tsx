import TrendingPosts from '@/features/home/components/TrendingPosts/TrendingPosts'

type Props = {
  children: React.ReactNode
}

export default function Home({ children }: Props) {
  return (
    <>
      {children}
      <TrendingPosts />
    </>
  )
}
