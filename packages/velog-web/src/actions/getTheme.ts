import { cookies } from 'next/headers'

export default function getTheme(): string {
  const theme = cookies().get('theme')?.value

  return theme || 'light'
}
