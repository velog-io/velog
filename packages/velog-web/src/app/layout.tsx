import '@/styles/reset.module.css'
import '@/styles/global.module.css'
import styles from '@/styles/global.module.css'
import { cookies } from 'next/headers'
import CoreProvider from '@/providers/CoreProvider'
import { Metadata } from 'next'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

export const metadata: Metadata = {
  title: 'velog',
  description: '개발자들을 위한 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' },
  ],
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicons/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/favicons/favicon-96x96.png',
      },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        url: '/favicons/apple-icon-152x152.png',
      },
    ],
  },
  other: {
    'fb:app_id': '203040656938507',
    'og:image': 'https://images.velog.io/velog.png',
    'format-detection': 'telephone=no, date=no, email=no, address=no',
  },
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const theme = cookies().get('theme')
  return (
    <html lang="ko">
      <body className={cx('body')} data-theme={theme?.value ?? 'light'}>
        <CoreProvider>{children}</CoreProvider>
      </body>
    </html>
  )
}
