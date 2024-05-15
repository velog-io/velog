import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

type Props = {
  children: React.ReactNode
}

function ReactQueryProvider({ children }: Props) {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default ReactQueryProvider
