interface Props {
  params: { username: string }
}

export default async function VelogPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')
  console.log('username', username)
  return <>velog-page</>
}
