import { UploadImageArgs } from '@/api/routes/files'
import { EditorSelection } from '@codemirror/state'
import { EditorView } from 'codemirror'

export const handlePaste = (
  event: ClipboardEvent,
  view: EditorView,
  upload: (args: UploadImageArgs) => Promise<string>,
): void => {
  const clipboardData = event.clipboardData
  if (!clipboardData) return
  const text = clipboardData.getData('Text')

  if (text) return

  event.preventDefault()

  const itemArray = []
  for (let i = 0; i < clipboardData.files.length; i++) {
    itemArray.push(clipboardData.files[i])
  }

  const tempUrls: string[] = []
  const images = itemArray
    .filter((item) => item.type.includes('image'))
    .map((item) => {
      const tempUrl = URL.createObjectURL(item)
      const main = view.state.selection.main
      let insert = `![]()`

      if (tempUrl) {
        insert = `![업로드중...](${tempUrl})\n`
      }

      tempUrls.push(insert)
      view.dispatch({
        changes: {
          from: main.from,
          to: main.from,
          insert,
        },
      })
      return item
    })

  const promises = images.map((item) => upload({ file: item, info: { type: 'book', refId: '' } }))

  Promise.allSettled(promises).then((result) => {
    let lastCursorPosition = view.state.selection.main.from
    result.map((image, index) => {
      if (image.status !== 'fulfilled') return
      const tempUrl = tempUrls[index]
      const imageUrl = `![](${image.value})\n`

      // replace temp url to real url
      const currentContent = view.state.doc.toString()
      const tempUrlIndex = currentContent.indexOf('![업로드중...]', lastCursorPosition)

      if (tempUrlIndex !== -1) {
        view.dispatch({
          changes: {
            from: tempUrlIndex,
            to: tempUrlIndex + tempUrl.length,
            insert: imageUrl,
          },
          selection: EditorSelection.cursor(tempUrlIndex + imageUrl.length),
        })

        lastCursorPosition = tempUrlIndex + imageUrl.length
      }
    })

    // 모든 이미지 처리 후 커서를 마지막 이미지 다음으로 이동
    view.dispatch({
      selection: EditorSelection.cursor(lastCursorPosition),
    })
  })
}
