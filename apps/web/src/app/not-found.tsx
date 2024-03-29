import NotFoundError from '@/components/Error/NotFoundError'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - velog',
  robots: 'noindex',
}

export default function NotFound() {
  return <NotFoundError />
}
