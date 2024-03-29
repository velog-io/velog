'use client'

import BasicLayout from '../BasicLayout'
import { type CustomLogoHeaderProps, type DefaultHeaderProps } from '../BasicLayout/BasicLayout'
import styles from './SmallLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = DefaultHeaderProps | CustomLogoHeaderProps

function isDefaultHeaderProps(props: Props): props is DefaultHeaderProps {
  return !props.isCustomHeader
}

function SmallLayout(props: Props) {
  const layout = isDefaultHeaderProps(props) ? (
    <BasicLayout isCustomHeader={false}>
      <div className={cx('block')}>{props.children}</div>
    </BasicLayout>
  ) : (
    <BasicLayout isCustomHeader={true} username={props.username} userLogo={props.userLogo}>
      <div className={cx('block')}>{props.children}</div>
    </BasicLayout>
  )
  return layout
}

export default SmallLayout
