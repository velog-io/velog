import dynamic from 'next/dynamic'
import styles from './VelogAboutEdit.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), { ssr: false })

const cx = bindClassNames(styles)

type Props = {
  onChangeMarkdown: (markdown: string) => void
  initialMarkdown: string
}

function VelogAboutEdit({ onChangeMarkdown, initialMarkdown }: Props) {
  return (
    <div className={cx('block')}>
      <MarkdownEditor onChangeMarkdown={onChangeMarkdown} initialMarkdown={initialMarkdown} />
    </div>
  )
}

export default VelogAboutEdit
