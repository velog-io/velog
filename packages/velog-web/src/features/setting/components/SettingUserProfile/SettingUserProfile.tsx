'use client'

import useToggle from '@/hooks/useToggle'
import styles from './SettingUserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useInputs from '@/hooks/useInputs'
import Button from '@/components/Button'
import SettingInput from '../SettingInput'
import SettingEditButton from '../SettingEditButton'
import Thumbnail from '@/components/Thumbnail'
import useUpload from '@/hooks/useUpload'
import { useState } from 'react'
import { useCFUpload } from '@/hooks/useCFUpload'
import { useUpdateThumbnailMutation } from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = {
  thumbnail: string | null
  displayName: string
  shortBio: string
}

function SettingUserProfile({ thumbnail, displayName, shortBio }: Props) {
  const [upload] = useUpload()
  const { mutate: updateThumbnailMutation } = useUpdateThumbnailMutation()
  const { upload: cfUpload } = useCFUpload()
  const [edit, onToggleEdit] = useToggle(false)
  const [inputs, onChange] = useInputs({
    displayName,
    shortBio,
  })

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const uploadThumbnail = async () => {
    const file = await upload()
    if (!file) return
    setLoading(true)
    setImageBlobUrl(URL.createObjectURL(file))
    const image = await cfUpload(file, { type: 'profile' })
    setLoading(false)
    if (!image) return
    updateThumbnailMutation({
      input: {
        url: image,
      },
    })
  }

  const clearThumbnail = () => {
    updateThumbnailMutation({
      input: {
        url: null,
      },
    })
    setImageBlobUrl(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // await onUpdate(inputs)
    onToggleEdit()
  }

  return (
    <section className={cx('block')}>
      <div className={cx('thumbnailArea')}>
        <Thumbnail src={thumbnail} alt="profile" className={cx('thumbnail')} priority={true} />
        <Button onClick={() => {}} disabled={false}>
          {false ? '업로드중...' : '이미지 업로드'}
        </Button>
        <Button color="transparent" onClick={() => {}}>
          이미지 제거
        </Button>
      </div>
      <div className={cx('infoArea')}>
        {edit ? (
          <form className={cx('form')} onSubmit={onSubmit}>
            <SettingInput
              placeholder="이름"
              fullWidth
              className={cx('displayName')}
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
            <div className={cx('buttonWrapper')}>
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
