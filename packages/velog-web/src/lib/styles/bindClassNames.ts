import styleUtils from './utils.module.css'
import styleKeyframes from './keyframes.module.css'

type Styles = { [key: string]: string }

export function bindClassNames<T extends Styles>(styles: T) {
  type BooleanMap = Partial<{ [key in keyof T]: boolean }>
  type ClassNames = keyof T | false | null | undefined | BooleanMap
  type ExtraClassName = ClassNames | Omit<string, keyof T>

  const stylesWithUtils = {
    ...styles,
    ...styleUtils,
    ...styleKeyframes,
  }
  const fn = (...classNames: ExtraClassName[]) => {
    return (classNames.filter((cn) => cn) as (keyof T)[])
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
