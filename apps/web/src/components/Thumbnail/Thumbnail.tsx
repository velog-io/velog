import Image from 'next/image'
import styles from './Thumbnail.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  src?: string | null
  alt?: string
  className?: string
  priority?: boolean
}

function Thumbnail({ src, alt = 'thumbnail', className, priority = false }: Props) {
  return (
    <div className={cx('block', className)}>
      <Image
        src={src || '/images/user-thumbnail.png'}
        alt={alt}
        fill={true}
        style={styles}
        priority={priority}
      />
    </div>
  )
}

export default Thumbnail
