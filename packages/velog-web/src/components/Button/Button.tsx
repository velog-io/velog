import React from 'react'
import styles from './Button.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'

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
  className?: string
}

const cx = bindClassNames(styles)

function Button({
  to,
  color = 'teal',
  size = 'default',
  border = false,
  className,
  ...rest
}: Props) {
  const ButtonComponent = (
    <button
      className={cx(
        'block',
        size,
        border ? 'border' : 'notBorder',
        color,
        className
      )}
      {...rest}
    />
  )

  const WrapperComponent = to ? VLink : React.Fragment
  return React.createElement(
    WrapperComponent,
    to ? { href: to } : null,
    ButtonComponent
  )
}

export default Button
