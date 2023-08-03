import { bindClassNames } from '@/lib/styles/bindClassNames'
import * as React from 'react'
import styles from './RoundButton.module.css'
import Link from 'next/link'

type ButtonSize = 'SMALL' | 'DEFAULT' | 'LARGE'

const cx = bindClassNames(styles)

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

interface RoundButtonProps extends ButtonProps {
  inline?: boolean
  to?: string
  size?: ButtonSize
  color?: 'teal' | 'gray' | 'darkGray' | 'lightGray'
  border?: boolean
}

const RoundButton: React.FC<RoundButtonProps> = ({
  ref,
  to,
  color = 'teal',
  size = 'DEFAULT',
  border = false,
  inline,
  ...rest
}) => {
  if (to) {
    return (
      <Link href={to} legacyBehavior>
        <button
          className={cx('block', color, size, border ? 'border' : 'notBorder', { inline })}
          {...rest}
        />
      </Link>
    )
  }
  return (
    <button
      className={cx('block', color, size, border ? 'border' : 'notBorder', { inline })}
      {...rest}
    />
  )
}

export default RoundButton
