import ReactQueryProvider from './ReactQueryProvider'
import UrqlProvider from './UrqlProvider'

type Props = {
  children: React.ReactNode
}

function CoreProvider({ children }: Props) {
  return (
    <>
      <ReactQueryProvider>
        <UrqlProvider>{children}</UrqlProvider>
      </ReactQueryProvider>
    </>
  )
}

export default CoreProvider
