import { EditorView } from 'codemirror'

export const handleScroll = (event: Event, view: EditorView): void => {
  if (!event.target) return
  const preview = document.getElementById('markdown-editor-preview')
  if (!preview) return
  // TODO: 비율에 따라서 스크롤 위치를 조정해야함

  if (view.scrollDOM.scrollTop > 100) {
    const previewHeight = preview.scrollHeight ?? 0
    preview.scrollTop = previewHeight
  }
}
