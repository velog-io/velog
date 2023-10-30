import VelogPage from '../../page'

interface Props {
  params: { username: string }
}

export default async function VelogAbout({ params }: Props) {
  return (
    <>
      <div>velog About</div>
      <VelogPage params={params} />
    </>
  )
}
