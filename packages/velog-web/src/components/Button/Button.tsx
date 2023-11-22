import styles from './Button.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type ButtonColor = 'teal' | 'gray' | 'darkGray' | 'lightGray' | 'transparent' | 'red'
type ButtonSize = 'medium' | 'large'

interface Props extends ButtonProps {
  color?: ButtonColor
  inline?: boolean
  size?: ButtonSize
  responsive?: boolean
  className?: string
}

function Button({
  children,
  color = 'teal',
  inline = false,
  size = 'medium',
  responsive = false,
  className,
  ...rest
}: Props) {
  return (
    <button
      className={cx(
        'block',
        size,
        color,
        inline ? 'inline' : '',
        responsive ? 'responsive' : '',
        className,
      )}
      {...rest}
      onClick={(e) => {
        if (rest.onClick) {
          rest.onClick(e)
        }
        const target = e.target as HTMLButtonElement
        target.blur()
      }}
    >
      {children}
    </button>
  )
}

export default Button
