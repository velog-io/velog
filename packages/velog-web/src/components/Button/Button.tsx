import styles from './Button.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type ColorType = 'teal' | 'gray' | 'darkGray' | 'lightGray' | 'transparent' | 'red'
type ButtonSize = 'medium' | 'large'

interface Props extends Omit<React.HTMLProps<HTMLButtonElement>, 'inline' | 'size'> {
  color?: ColorType
  inline?: boolean
  size?: ButtonSize
  responsive?: boolean
}

function Button({
  children,
  color = 'teal',
  inline = false,
  size = 'medium',
  responsive = false,
  ...rest
}: Props) {
  const htmlProps = rest as any
  return (
    <div
      className={cx('block', size, color, inline ? 'inline' : '', responsive ? 'responsive' : '')}
      {...htmlProps}
      onClick={(e) => {
        if (htmlProps.onClick) {
          htmlProps.onClick(e)
        }
        const target = e.target as HTMLButtonElement
        target.blur()
      }}
    >
      {children}
    </div>
  )
}

export default Button
