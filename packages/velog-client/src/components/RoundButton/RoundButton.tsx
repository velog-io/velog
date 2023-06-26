import React from 'react'
import Link from 'next/link'
import styles from './RoundButton.module.css'
import { type StyleButtonKey, bindClassNames } from '@/lib/styles/bindClassNames'

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type ButtonSize = 'small' | 'default' | 'large'
type ButtonColor = 'teal' | 'gray' | 'darkGray' | 'lightGray'

interface Props extends ButtonProps {
  inline?: boolean
  to?: string
  size?: ButtonSize
  color: ButtonColor
  border?: boolean
}

const cx = bindClassNames(styles)

function RoundButton({
  ref,
  to,
  color = 'teal',
  size = 'default',
  border = false,
  ...rest
}: Props) {
  const colorClassNamePrefix = (str: string) => `btn-${str}` as Partial<StyleButtonKey>
  const ButtonComponent = (
    <button
      className={cx('block', `${colorClassNamePrefix(color)}`, `${size}`, {
        border: border,
      })}
      {...rest}
    />
  )

  const WrapperComponent = to ? Link : React.Fragment
  return React.createElement(WrapperComponent, to ? { href: to } : null, ButtonComponent)
}

export default RoundButton
