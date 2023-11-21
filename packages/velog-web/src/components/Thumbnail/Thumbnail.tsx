import Image from 'next/image'
import styles from './Thumbnail.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  src: string | null
  alt?: string
  width?: number
  height?: number
  borderRadius?: number
  className?: string
}

function Thumbnail({
  src,
  alt = 'thumbnail',
  width = 100,
  height,
  className,
  borderRadius,
}: Props) {
  const styles = !borderRadius ? {} : { borderRadius: borderRadius || width / 2 }
  return (
    <div className={cx('block', className)} style={{ width, height }}>
      <Image src={src || '/images/user-thumbnail.png'} alt={alt} fill={true} style={styles} />
    </div>
  )
}

export default Thumbnail
