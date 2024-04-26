import NextraLayout from '@/layouts/NextraLayout/NextraLayout'

type Props = {
  children: React.ReactNode
}

const BookEditPage = ({ children }: Props) => {
  return <NextraLayout>{children}</NextraLayout>
}

export default BookEditPage
