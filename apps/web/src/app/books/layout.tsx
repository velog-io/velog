import BookEditLayout from '@/features/bookEdit/layout/BookEditLayout'

type Props = {
  children: React.ReactNode
}

function page({ children }: Props) {
  return <BookEditLayout>{children}</BookEditLayout>
}

export default page
