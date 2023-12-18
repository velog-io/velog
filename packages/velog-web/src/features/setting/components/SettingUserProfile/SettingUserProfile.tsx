'use client'

import useToggle from '@/hooks/useToggle'
import styles from './SettingUserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useInputs from '@/hooks/useInputs'
import Button from '@/components/Button'
import SettingInput from '../SettingInput'
import SettingEditButton from '../SettingEditButton'
import Thumbnail from '@/components/Thumbnail'

const cx = bindClassNames(styles)

type Props = {
  onUpload: () => void
  onClearThumbnail: () => void
  onUpdate: (params: { shortBio: string; displayName: string }) => Promise<any>
  thumbnail: string | null
  displayName: string
  shortBio: string
  loading: boolean
}

function SettingUserProfile({
  onUpdate,
  onUpload,
  onClearThumbnail,
  thumbnail,
  displayName,
  shortBio,
  loading,
}: Props) {
  const [edit, onToggleEdit] = useToggle(false)
  const [inputs, onChange] = useInputs({
    displayName,
    shortBio,
  })
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(inputs)
    onToggleEdit()
  }

  return (
    <section className={cx('block')}>
      <div className="thumbnail-area">
        <Thumbnail src={thumbnail} alt="profile" />
        <Button onClick={onUpload} disabled={loading}>
          {loading ? '업로드중...' : '이미지 업로드'}
        </Button>
        <Button color="transparent" onClick={onClearThumbnail}>
          이미지 제거
        </Button>
      </div>
      <div className="info-area">
        {edit ? (
          <form className={cx('form')} onSubmit={onSubmit}>
            <SettingInput
              placeholder="이름"
              fullWidth
              className="display-name"
              name="displayName"
              value={inputs.displayName}
              onChange={onChange}
            />
            <SettingInput
              placeholder="한 줄 소개"
              fullWidth
              name="shortBio"
              value={inputs.shortBio}
              onChange={onChange}
              autoFocus
            />
            <div className="button-wrapper">
              <Button>저장</Button>
            </div>
          </form>
        ) : (
          <>
            <h2>{displayName}</h2>
            <p>{shortBio}</p>
            <SettingEditButton onClick={onToggleEdit} />
          </>
        )}
      </div>
    </section>
  )
}

export default SettingUserProfile