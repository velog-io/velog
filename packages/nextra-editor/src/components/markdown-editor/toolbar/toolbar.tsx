import cn from 'clsx'
import { isValidElement, RefObject, useEffect, useState } from 'react'
import { titles, bold, italic, strike, quote, link, image, code, save } from './commands'
import { ToolbarCommand } from './commands/type'
import { EditorSelection, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import ToolbarSeparator from './toolbar-separator'
import useClickImage from '@/hooks/use-click-img'
import { useUpload } from '@/hooks/use-upload'

type Props = {
  state: EditorState | null
  view: EditorView | null
  container: RefObject<HTMLElement>
}

const seperator = {
  name: 'seperator',
}

const Toolbar = ({ state, view }: Props) => {
  const { onClick: onClickInput, file, setFile } = useClickImage()
  const { upload, image: imagePath, loading: uploading, setImage } = useUpload()
  const [selection, setSelection] = useState({ from: 0, to: 0 })

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
    seperator,
    save,
  ]

  const init = () => {
    setFile(null)
    setImage(null)
  }

  const onClick = (excute: ToolbarCommand['execute']) => {
    excute(view)
  }

  const onClickImageButton = async () => {
    if (!view || !state) return
    if (uploading) return
    const file = await onClickInput()
    if (!file) return
    const tempUrl = URL.createObjectURL(file)
    const main = view.state.selection.main
    let insert = `![]()`

    if (tempUrl) {
      insert = `![업로드중...](${tempUrl})\n`
    }

    const selectionFrom = main.from
    const selectionTo = main.from + insert.length
    setSelection({ from: selectionFrom, to: selectionTo })
    view.dispatch({
      changes: {
        from: main.from,
        to: main.from,
        insert,
      },
      selection: EditorSelection.range(selectionFrom, selectionTo),
    })

    // TODO: uplaod image with book_id
    upload({ file, info: { type: 'book', refId: '' } })
  }

  const onCickSaveButton = () => {
    console.log('save')
  }

  useEffect(() => {
    // Handle Uploaded Image
    if (uploading) return
    if (!imagePath) return
    if (!file) return
    if (!view || !state) return
    const { from, to } = selection
    const insert = `![](${imagePath})\n`
    view.dispatch({
      changes: {
        from: from,
        to: to,
        insert,
      },
    })

    if (file && imagePath) {
      init()
    }
  }, [imagePath, view, state, file, selection])

  const commandMapper = (command: Partial<ToolbarCommand>) => {
    switch (command.name) {
      case 'image':
        onClickImageButton()
        return
      case 'save':
        onCickSaveButton()
        return
      default:
        onClick(command.execute!)
    }
  }

  return (
    <div className={cn('nx-flex nx-flex-row nx-items-center')}>
      {commands.map((command, index) => {
        const key = `${command.name}-${index}`
        if (!isValidElement(command.icon)) {
          return <ToolbarSeparator key={key} />
        }
        return (
          <button
            key={key}
            onClick={() => commandMapper(command)}
            className={cn(
              'nx-h-12 nx-w-12 nx-cursor-pointer',
              'nx-flex nx-items-center nx-justify-center',
              classes.button,
            )}
          >
            {command.icon}
          </button>
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
