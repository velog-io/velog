// import NextraLayout from '@/layouts/NextraLayout/index.jsx'
import { NextraLayout } from '@packages/nextra'

type Props = {
  children: React.ReactNode
}

const BookEditPage = ({ children }: Props) => {
  return <NextraLayout>{children}</NextraLayout>
}

export default BookEditPage
