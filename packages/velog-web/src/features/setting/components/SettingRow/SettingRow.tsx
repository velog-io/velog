'use client'

import SettingEditButton from '../SettingEditButton'
import styles from './SettingRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  title: string
  children: React.ReactNode
  onClickEdit?: () => void
  editButton?: boolean
  description?: string
  showEditButton?: boolean
  editButtonText?: string
}

function SettingRow({
  title,
  children,
  editButton,
  description,
  showEditButton = true,
  onClickEdit,
  editButtonText,
}: Props) {
  return (
    <div className={cx('block')}>
      <div className="wrapper">
        <div className="title-wrapper">
          <h3>{title}</h3>
        </div>
        <div className="block-for-mobile">
          <div className="contents">{children}</div>
          {editButton && showEditButton && (
            <div className="edit-wrapper">
              <SettingEditButton onClick={onClickEdit} customText={editButtonText} />
            </div>
          )}
        </div>
      </div>
      {description && <div className="description">{description}</div>}
    </div>
  )
}

export default SettingRow
