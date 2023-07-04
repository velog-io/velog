import Image from 'next/image'
import styles from './RatioImage.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  widthRatio: number
  heightRatio: number
  src: string
  alt: string
  className?: string
}

function RatioImage({ widthRatio, heightRatio, src, alt, className }: Props) {
  const paddingTop = `${(heightRatio / widthRatio) * 100}%`
  return (
    <div className={cx('block')} style={{ paddingTop }}>
      <Image src={src} alt={alt} width={320} height={167} />
    </div>
  )
}

export default RatioImage
