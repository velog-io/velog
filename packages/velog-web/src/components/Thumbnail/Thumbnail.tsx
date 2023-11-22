import Image from 'next/image'
import styles from './Thumbnail.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  src: string | null
  alt?: string
  className?: string
}

function Thumbnail({ src, alt = 'thumbnail', className }: Props) {
  return (
    <div className={cx('block', className)}>
      <Image src={src || '/images/user-thumbnail.png'} alt={alt} fill={true} style={styles} />
    </div>
  )
}

export default Thumbnail
