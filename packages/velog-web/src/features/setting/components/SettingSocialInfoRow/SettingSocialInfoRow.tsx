'use client'

import { EmailIcon, FacebookSquareIcon, GithubIcon, TwitterIcon } from '@/assets/icons/components'
import styles from './SettingSocialInfoRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { MdHome } from 'react-icons/md'
import { FormEvent, useState, useEffect, createElement } from 'react'
import SettingInput from '../SettingInput'
import Button from '@/components/Button'
import SettingRow from '../SettingRow'
import SettingEditButton from '../SettingEditButton'
import useInputs from '@/hooks/useInputs'
import { useCurrentUserQuery, useUpdateSocialInfoMutation } from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = {
  email?: string
  github?: string
  twitter?: string
  facebook?: string
  url?: string
}

const iconArray = [EmailIcon, GithubIcon, TwitterIcon, FacebookSquareIcon, MdHome]

function SettingSocialInfoRow({
  email = '',
  github = '',
  twitter = '',
  facebook = '',
  url = '',
}: Props) {
  const [isEmpty, setIsEmpty] = useState([email, github, twitter, facebook, url].every((v) => !v))
  const [edit, setEdit] = useState(false)
  const { inputs, onChange, dispatch } = useInputs({ email, github, twitter, facebook, url })
  const [facebookInputFocus, setFacebookInputFocus] = useState(false)
  const { mutateAsync: updateSocialInfoMutateAsync } = useUpdateSocialInfoMutation()
  const { data, refetch: currentUserRefetch } = useCurrentUserQuery()

  useEffect(() => {
    if (!data?.currentUser) return
    const profile = data?.currentUser?.profile
    if (!profile) return
    const { profile_links } = profile
    Object.entries(profile_links).forEach(([name, value]) => {
      dispatch({
        name,
        value,
      })
    })
    setIsEmpty(Object.values(profile_links).every((links) => !links))
  }, [data, dispatch])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await updateSocialInfoMutateAsync({ input: { profile_links: inputs } })
    setEdit(false)
    currentUserRefetch()
  }

  const onClickEdit = () => setEdit(true)

  const infoInputsList = edit && (
    <form className={cx('form')} onSubmit={onSubmit}>
      <ul className={cx('infoList')}>
        <li>
          <EmailIcon />
          <SettingInput
            value={inputs.email}
            onChange={onChange}
            name="email"
            placeholder="이메일을 입력하세요."
            fullWidth={true}
          />
        </li>
        <li>
          <GithubIcon />
          <SettingInput
            value={inputs.github}
            onChange={onChange}
            name="github"
            placeholder="Github 계정을 입력하세요."
          />
        </li>
        <li>
          <TwitterIcon />
          <SettingInput
            value={inputs.twitter}
            onChange={onChange}
            name="twitter"
            placeholder="Twitter 계정을 입력하세요."
          />
        </li>
        <li>
          <FacebookSquareIcon />
          <div
            className={cx('facebookInputBox', { focus: facebookInputFocus })}
            tabIndex={0}
            onFocus={(e) => {
              const el = e.currentTarget.querySelector('input')
              if (!el) return
              el.focus()
            }}
          >
            <span>https://www.facebook.com/</span>
            <input
              size={0}
              value={inputs.facebook}
              name="facebook"
              onChange={onChange}
              onFocus={() => setFacebookInputFocus(true)}
              onBlur={() => setFacebookInputFocus(false)}
            />
          </div>
        </li>
        <li>
          <MdHome />
          <SettingInput
            value={inputs.url}
            onChange={onChange}
            name="url"
            placeholder="홈페이지 주소를 입력하세요."
            fullWidth={true}
          />
        </li>
      </ul>
      <div className={cx('buttonWrapper')}>
        <Button>저장</Button>
      </div>
    </form>
  )

  const infoValueList = !edit && (
    <ul className={cx('infoList')}>
      {Object.values(inputs).map((value, i) =>
        value !== '' ? (
          <li key={i}>
            {createElement(iconArray[i])}
            <span>{value}</span>
          </li>
        ) : null,
      )}
    </ul>
  )

  return (
    <div className={cx('block')}>
      <SettingRow
        title="소셜 정보"
        description="포스트 및 블로그에서 보여지는 프로필에 공개되는 소셜 정보입니다."
        editButton={!edit && !isEmpty}
        onClickEdit={onClickEdit}
      >
        {edit ? infoInputsList : infoValueList}
        {!edit && isEmpty && <SettingEditButton customText="정보 추가" onClick={onClickEdit} />}
      </SettingRow>
    </div>
  )
}

export default SettingSocialInfoRow
