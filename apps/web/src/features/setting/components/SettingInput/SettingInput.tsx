'use client'

import { HTMLProps } from 'react'
import styles from './SettingInput.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

export type SettingInputProps = {
  fullWidth?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Omit<HTMLProps<HTMLInputElement>, 'ref' | 'as' | 'onChange'>

function SettingInput({ fullWidth, ...props }: SettingInputProps) {
  return <input className={cx('input', { fullWidth })} {...props} />
}

export default SettingInput
