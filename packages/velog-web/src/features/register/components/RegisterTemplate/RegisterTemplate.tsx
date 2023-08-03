import * as React from 'react'
import styles from './RegisterTemplate.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

export interface RegisterTemplateProps {
  children: React.ReactNode
}

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({ children }) => {
  return (
    <div className={cx('block')}>
      <h1>환영합니다!</h1>
      <div className={cx('description')}>기본 회원 정보를 등록해주세요.</div>
      <div className={cx('contents')}>{children}</div>
    </div>
  )
}

export default RegisterTemplate
