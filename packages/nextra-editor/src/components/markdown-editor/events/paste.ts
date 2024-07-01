import { EditorView } from 'codemirror'

export const handlePaste = (event: ClipboardEvent, view: EditorView) => {
  console.log('paste event')
  const clipboardData = event.clipboardData
  if (!clipboardData) return
  console.log('clipboardData', clipboardData)
}
