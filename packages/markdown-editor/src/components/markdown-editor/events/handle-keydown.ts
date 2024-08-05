import { EditorView } from 'codemirror'

export const handleKeydown = (event: Event, view: EditorView): void => {
  // handle preview scroll
  const preview = document.getElementById('markdown-editor-preview')
  if (!preview) return

  const head = view.state.selection.main.head
  const cursorLine = view.state.doc.lineAt(head).number
  const lastLine = view.state.doc.lineAt(view.state.doc.length).number

  if (lastLine - cursorLine < 15) {
    const previewHeight = preview.scrollHeight ?? 0
    preview.scrollTop = previewHeight
  }
}
