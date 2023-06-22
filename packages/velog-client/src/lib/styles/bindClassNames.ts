import styleUtils from './utils.module.css'

type Styles = { [key: string]: string }
type StyleUtilKey = keyof typeof styleUtils

export function bindClassNames<T extends Styles>(styles: T) {
  type BooleanMap = Partial<{ [key in keyof T | StyleUtilKey]: boolean }>
  const stylesWithUtils = { ...styles, ...styleUtils }
  const fn = (
    ...classNames: (
      | keyof T
      | StyleUtilKey
      | false
      | null
      | undefined
      | BooleanMap
    )[]
  ) => {
    return (classNames.filter((cn) => cn) as (keyof T | StyleUtilKey)[])
      .map((className) => {
        if (typeof className === 'object') {
          const keys = Object.keys(className) as (keyof T)[]
          return keys
            .filter((key) => className[key])
            .map((key) => stylesWithUtils[key])
            .join(' ')
        }
        return stylesWithUtils[className] ?? className
      })
      .join(' ')
  }
  return fn
}
