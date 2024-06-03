import cn from 'clsx'
import { isValidElement, RefObject } from 'react'
import { titles, bold, italic, strike, quote, link, image, code } from './commands'
import { ToolbarCommand } from './commands/type'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import ToolbarSeparator from './toolbar-separator'

type Props = {
  state: EditorState | null
  view: EditorView | null
  container: RefObject<HTMLElement>
}

const seperator = {
  name: 'seperator',
}

const Toolbar = ({ state, view }: Props) => {
  const commands: Partial<ToolbarCommand>[] = [
    ...titles,
    seperator,
    bold,
    italic,
    strike,
    seperator,
    quote,
    link,
    image,
    code,
  ]

  const onClick = (excute: ToolbarCommand['execute']) => {
    excute({ state, view })
  }

  return (
    <div className={cn('nx-flex nx-flex-row nx-items-center')}>
      {commands.map((command, index) => {
        const key = `${command.name}-${index}`
        if (!isValidElement(command.icon)) {
          return <ToolbarSeparator key={key} />
        }
        return (
          <div key={key}>
            <button
              onClick={() => onClick(command.execute!)}
              className={cn(
                'nx-h-12 nx-w-12 nx-cursor-pointer',
                'nx-flex nx-items-center nx-justify-center',
                classes.button,
              )}
            >
              {command.icon}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toolbar

const classes = {
  button: cn(
    'nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-neutral-500 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
  ),
}
