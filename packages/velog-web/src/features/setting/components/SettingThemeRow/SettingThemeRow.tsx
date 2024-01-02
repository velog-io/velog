'use client'

import { ThemeDark, ThemeLight } from '@/assets/icons/components'
import SettingRow from '../SettingRow'
import styles from './SettingThemeRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useClickTheme } from '../../hooks/useClickTheme'

const cx = bindClassNames(styles)

type Props = {}

function SettingThemeRow({}: Props) {
  const { click, theme, isSystemThemePrefer } = useClickTheme()
  return (
    <SettingRow title="테마" className={cx('block')}>
      <ul className={cx('selector')}>
        <li
          className={cx('light', 'list', { active: !isSystemThemePrefer && theme === 'light' })}
          onClick={() => click('light')}
        >
          <ThemeLight width={24} height={24} />
        </li>
        <li
          className={cx('dark', 'list', { active: !isSystemThemePrefer && theme === 'dark' })}
          onClick={() => click('dark')}
        >
          <ThemeDark width={24} height={24} />
        </li>
        <li
          className={cx('system', 'list', { active: isSystemThemePrefer })}
          onClick={() => click('system')}
        >
          <div className={cx('light', 'center')}>
            <ThemeLight width={24} height={24} />
          </div>
          <div className={cx('dark', 'center')}>
            <ThemeDark width={24} height={24} />
          </div>
        </li>
      </ul>
    </SettingRow>
  )
}

export default SettingThemeRow
