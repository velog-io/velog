import { bindClassNames } from '@/lib/styles/bindClassNames'
import * as React from 'react'
import styles from './LabelInput.module.css'
import { MdLockOutline } from 'react-icons/md'

const cx = bindClassNames(styles)

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export interface LabelInputProps extends InputProps {
  label: string
  placeholder?: string
  name?: string
  value?: string
  onChange?: React.ChangeEventHandler
}

const { useState, useCallback } = React
const LabelInput: React.FC<LabelInputProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  disabled,
  ...rest
}) => {
  const [focus, setFocus] = useState(false)

  const onFocus = useCallback(() => {
    setFocus(true)
  }, [])
  const onBlur = useCallback(() => {
    setFocus(false)
  }, [])

  return (
    <div className={cx('block')}>
      <label className={cx({ focus: focus })}>{label}</label>
      <div className={cx('group')}>
        <div className={cx('input-wrapper', { focus: focus })}>
          <input
            className={cx({ focus: focus })}
            name={name}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            {...rest}
          />
          {disabled && <MdLockOutline />}
        </div>

        <div className={cx('width-maker')}>{value || `${placeholder}`}</div>
      </div>
    </div>
  )
}

export default LabelInput
