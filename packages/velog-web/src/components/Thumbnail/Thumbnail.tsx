import Image from 'next/image'
import styles from './Thumbnail.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  thumbnail: string | null
  alt?: string
  width: number
  height: number
  borderRadius?: number
  className?: string
}

function Thumbnail({
  thumbnail,
  alt = 'thumbnail',
  width,
  height,
  className,
  borderRadius,
}: Props) {
  return (
    <div className={cx('block', className)} style={{ width, height }}>
      <Image
        src={thumbnail || '/images/user-thumbnail.png'}
        alt={alt}
        fill={true}
        style={{ borderRadius: borderRadius || width / 2 }}
      />
    </div>
  )
}

export default Thumbnail
