import { UndrawEmpty } from '@/assets/vectors/components'
import styles from './VelogAboutContent.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Button from '@/components/Button'

const cx = bindClassNames(styles)

type Props = {
  markdown: string
  isOwn: boolean
  onClickWrite: () => void
}

function VelogAboutContent({ markdown, isOwn, onClickWrite }: Props) {
  return (
    <div className={cx('block')}>
      {markdown ? (
        ''
      ) : (
        <div className={cx('empty')}>
          <UndrawEmpty />
          <div className={cx('message')}>소개가 작성되지 않았습니다.</div>
          {isOwn && (
            <Button size="large" onClick={onClickWrite}>
              소개글 작성하기
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default VelogAboutContent
