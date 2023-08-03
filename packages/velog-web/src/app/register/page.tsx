import * as React from 'react'
import { Metadata } from 'next'
import RegisterTemplate from '@/features/register/components/RegisterTemplate'
import RegisterFormContainer from '@/features/register/components/RegisterFormContainer'

export const metadata: Metadata = {
  title: '회원가입 - velog',
  // description: '벨로그에서 다양한 개발자들이 작성한 따끈따끈한 최신 포스트들을 읽어보세요.',
}

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  return (
    <RegisterTemplate>
      <RegisterFormContainer />
    </RegisterTemplate>
  )
}

export default RegisterPage
