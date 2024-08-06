import styles from './Skeleton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  width?: number | string
  height?: number | string
  flex?: number
  marginRight?: number | string
  noSpacing?: boolean
  circle?: boolean
  className?: string
  borderRadius?: string
}

function Skeleton({
  width,
  height,
  flex,
  marginRight,
  noSpacing,
  circle,
  className,
  borderRadius,
}: Props) {
  return (
    <div
      className={cx('block', 'shining', className, {
        noSpacing: noSpacing || !!marginRight,
        circle,
      })}
      style={{ width, height, flex, marginRight, borderRadius }}
    />
  )
}

export default Skeleton
