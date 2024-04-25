'use client'

import NextraLayout from '@/layouts/NextraLayout'

type Props = {
  childrens: React.ReactNode
}

function layout({ childrens }: Props) {
  return <NextraLayout>{childrens}</NextraLayout>
}

export default layout
