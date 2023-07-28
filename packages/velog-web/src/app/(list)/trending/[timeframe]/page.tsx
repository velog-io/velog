import Home from '@/app/(list)/page'

type Props = {
  params: { timeframe: string }
}

export default async function Timeframe({ params }: Props) {
  return <Home params={params} />
}
