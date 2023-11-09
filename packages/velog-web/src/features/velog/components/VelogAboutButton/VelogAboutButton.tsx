import Button from '@/components/Button'
import styles from './VelogAboutButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  isEdit: boolean
  onClick: () => void
}

function VelogAboutButton({ isEdit, onClick }: Props) {
  return (
    <div className={cx('block')}>
      <Button size="large" onClick={onClick}>
        {isEdit ? '저장하기' : '수정하기'}
      </Button>
    </div>
  )
}

export default VelogAboutButton
