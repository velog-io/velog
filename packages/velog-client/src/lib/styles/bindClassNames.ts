import styleUtils from './utils.module.css'
import styleButtons from './buttons.module.css'
import styleKeyframes from './keyframes.module.css'

type Styles = { [key: string]: string }

export type StyleButtonKey = keyof typeof styleButtons

export function bindClassNames<T extends Styles>(styles: T) {
  type BooleanMap = Partial<{ [key in keyof T]: boolean }>
  const stylesWithUtils = {
    ...styles,
    ...styleUtils,
    ...styleButtons,
    ...styleKeyframes,
  }
  const fn = (
    ...classNames: (
      | keyof T
      | false
      | null
      | undefined
      | BooleanMap
      | (string & {})
    )[]
  ) => {
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
