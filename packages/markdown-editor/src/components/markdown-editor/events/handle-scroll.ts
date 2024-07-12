import { EditorView } from 'codemirror'
import { throttle } from 'throttle-debounce'

export const handleScroll = throttle(
  150,
  (event: Event, view: EditorView, isEditorActive): void => {
    if (!isEditorActive) return
    if (!event.target) return
    const preview = document.getElementById('markdown-editor-preview')
    if (!preview) return

    if (view.scrollDOM.scrollTop < 200) {
      preview.scrollTop = 0
      return
    }

    // const head = view.state.selection.main.head
    // const cursorLine = view.state.doc.lineAt(head).number
    // const lastLine = view.state.doc.lineAt(view.state.doc.length).number

    // if (lastLine - cursorLine < 5) return

    const previewScrollHeight = preview.scrollHeight - preview.clientHeight
    const editorScrollHeight = view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight

    // editor 영역에서 스크롤 비율 구하기
    const percent = view.scrollDOM.scrollTop / editorScrollHeight

    // preview 영역에 스크롤 위치 설정
    preview.scrollTop = percent * previewScrollHeight
  },
)
