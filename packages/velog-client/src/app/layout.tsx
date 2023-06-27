import Head from 'next/head'
import '@/styles/reset.css'
import '@/styles/global.css'
import ConditionalBackgroundProvider from '@/providers/ConditionalBackgroundProvider'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import SangteContextProvider from '@/providers/SangteContextProvider'
import UserLoaderProvider from '@/providers/UserLoaderProvider'
import ThemeProvier from '@/providers/ThemeProvier'
import InteractiveViewProvider from '@/providers/InteractiveViewProvider'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'velog',
  description:
    '개발자들을 위한 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요.',
  other: {
    'fb:app_id': '203040656938507',
    'og:image': 'https://images.velog.io/velog.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = cookies().get('theme')
  return (
    <html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicons/favicon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicons/apple-icon-152x152.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#12B886" />
      </Head>
      <body className="body" data-theme={theme?.value ?? 'light'}>
        <ConditionalBackgroundProvider>
          <ReactQueryProvider>
            <SangteContextProvider>
              <UserLoaderProvider>
                <ThemeProvier>
                  <InteractiveViewProvider>{children}</InteractiveViewProvider>
                </ThemeProvier>
              </UserLoaderProvider>
            </SangteContextProvider>
          </ReactQueryProvider>
        </ConditionalBackgroundProvider>
      </body>
    </html>
  )
}
