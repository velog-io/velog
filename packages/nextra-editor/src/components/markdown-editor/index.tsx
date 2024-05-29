import cn from 'clsx'
import { useMarkdownEditor } from '../../contexts/markdown-editor'

const MarkdownEditor = () => {
  const { value, setValue } = useMarkdownEditor()

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return (
    <textarea
      className={cn(
        'nextra-scrollbar nx-overflow-y-auto nx-outline-none',
        'nx-w-full nx-pl-6 nx-pr-6 nx-outline-none',
      )}
      style={{ height: 'calc(100vh - 64px)' }}
      value={value}
      onChange={onChangeInput}
    />
  )
}

export default MarkdownEditor
