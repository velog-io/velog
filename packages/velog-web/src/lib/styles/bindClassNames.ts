import utils from './utils.module.css'
import keyframes from './keyframes.module.css'
import responsive from './responsive.module.css'
import grid from './grid.module.css'

const getKeyLength = (obj: Record<string, any>): number => Object.keys(obj).length

type Styles = { [key: string]: string }
export function bindClassNames<T extends Styles>(styles: T) {
  type BooleanMap = Partial<Record<keyof T, boolean> & { [key: string]: boolean }>
  type ClassNames = keyof T | false | null | undefined | BooleanMap
  type ExtraClassName = ClassNames | Omit<string, keyof T>

  const commonStyleUtils = {
    ...utils,
    ...keyframes,
    ...responsive,
    ...grid,
  }

  const styleUtils = {
    ...commonStyleUtils,
    ...styles,
  }

  const originUtilsKeysLen = getKeyLength(commonStyleUtils) + getKeyLength(styles)
  const resultStylesKeyLen = getKeyLength(styleUtils)
  if (originUtilsKeysLen !== resultStylesKeyLen) {
    throw new Error(
      'Detected duplicate keys while merging styles.\
      Ensure unique class names across all style modules.',
    )
  }

  const fn = (...classNames: ExtraClassName[]) => {
    return (classNames.filter((cn) => cn) as (keyof T)[])
      .map((className) => {
        if (typeof className === 'object') {
          return Object.keys(className)
            .filter((key) => className[key])
            .map((key) => styleUtils[key] || key)
            .join(' ')
        }
        return styleUtils[className] ?? className
      })
      .join(' ')
  }
  return fn
}
