import HomeLayout from '@/components/Layouts/HomeLayout'
import { Viewport } from 'next'

type Props = {
  children: React.ReactNode
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' },
  ],
}

export default function Layout({ children }: Props) {
  return <HomeLayout>{children}</HomeLayout>
}
