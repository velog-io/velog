import * as Sentry from '@sentry/browser'

type Props = {}

function SentryProvider({}: Props) {
  Sentry.init({
    dsn: 'https://99d0ac3ca0f64b4d8709e385e7692893@sentry.io/1886813',
  })
  return <></>
}

export default SentryProvider
