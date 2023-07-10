'use client'

import ConditionalBackground from '@/components/ConditionalBackground'

type Props = {
  children: React.ReactNode
}

function ConditionalBackgroundProvider({ children }: Props) {
  return <ConditionalBackground>{children}</ConditionalBackground>
}

export default ConditionalBackgroundProvider
