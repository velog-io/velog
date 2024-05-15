import ReactQueryProvider from './ReactQueryProvider'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  )
}

export default CoreProvider
