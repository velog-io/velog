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
import { useContext, useState } from 'react'
import { useCFUpload } from '@/hooks/useCFUpload'
import { useUpdateProfileMutation, useUpdateThumbnailMutation } from '@/graphql/helpers/generated'
import JazzbarContext from '@/providers/JazzbarProvider'

const cx = bindClassNames(styles)

type Props = {
  thumbnail: string | null
  displayName: string
  shortBio: string
}

function SettingUserProfile({ thumbnail, displayName, shortBio }: Props) {
  const [upload] = useUpload()
  const { mutateAsync: updateThumbnailMutate } = useUpdateThumbnailMutation()
  const { mutateAsync: updateProfileMutateAsync } = useUpdateProfileMutation()
  const { upload: cfUpload } = useCFUpload()
  const [edit, onToggleEdit] = useToggle(false)

  const [inputs, onChange] = useInputs({
    displayName,
    shortBio,
  })

  const { setValue } = useContext(JazzbarContext)

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const uploadThumbnail = async () => {
    const file = await upload()
    if (!file) return
    setValue(30)
    setImageBlobUrl(URL.createObjectURL(file))
    setIsLoading(true)
    let i = 1
    const intervalTime = setInterval(() => {
      const add = i * 2
      if (add + 30 > 100) return
      setValue(30 + add)
      i++
    }, 100)

    const image = await cfUpload({ file, info: { type: 'profile' } })
    setIsLoading(false)
    if (!image) return
    updateThumbnailMutate({
      input: {
        url: image,
      },
    })
    setValue(100)
    clearTimeout(intervalTime)
  }

  const clearThumbnail = () => {
    updateThumbnailMutate({
      input: {
        url: null,
      },
    })
    setImageBlobUrl(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfileMutateAsync({
      input: { display_name: inputs.displayName, short_bio: inputs.shortBio },
    })
    onToggleEdit()
  }

  return (
    <section className={cx('block')}>
      <div className={cx('thumbnailArea')}>
        <Thumbnail
          src={imageBlobUrl || thumbnail}
          alt="profile"
          className={cx('thumbnail')}
          priority={true}
        />
        <Button onClick={uploadThumbnail} disabled={isLoading}>
          {isLoading ? '업로드중...' : '이미지 업로드'}
        </Button>
        <Button color="transparent" onClick={clearThumbnail}>
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
