import useApplyVelogConfig from '@/hooks/useApplyVelogConfig'

interface Props {
  params: { username: string }
}

export default async function VelogPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')

  return <>velog-page</>
}
