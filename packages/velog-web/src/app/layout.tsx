import '@/styles/global.css'
import '@/styles/reset.css'
import CoreProvider from '@/providers/CoreProvider'
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'velog',
  description: '개발자들을 위한 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요.',
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/favicon/favicon-96x96.png',
      },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        url: '/favicon/apple/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/favicon/apple/apple-icon-180.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '240x240',
        url: '/favicon/apple/apple-icon-240x240.png',
      },
    ],
  },
  other: {
    'fb:app_id': '203040656938507',
    'og:image': 'https://images.velog.io/velog.png',
    'format-detection': 'telephone=no, date=no, email=no, address=no',
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  return (
    <html id="html" lang="ko">
      <body className="body" suppressHydrationWarning={true}>
        <CoreProvider>{children}</CoreProvider>
      </body>
    </html>
  )
}
