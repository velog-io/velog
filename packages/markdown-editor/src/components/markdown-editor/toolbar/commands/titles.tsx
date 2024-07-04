import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'

const icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="m17 12 3-2v8" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
    <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17 10v4h4" />
    <path d="M21 10v8" />
  </svg>,
]

function generateTitleCommand(level: number): ToolbarCommand {
  return {
    name: `title-${level}`,
    button: { 'aria-label': `Add title ${level}` },
    icon: icons[level - 1],
    execute(view) {
      if (!view) return
      const { state, dispatch } = view
      const selection = state.selection
      const selectedText = state.doc.sliceString(selection.main.from, selection.main.to)
      // const lineInfo = view.state.doc.lineAt(view.state.selection.main.from)

      let transaction: TransactionSpec
      const mark = '#'.repeat(level)
      if (selectedText.length === 0) {
        const insert = `${mark} 제목`
        transaction = {
          changes: { from: selection.main.from, insert: `${mark} 제목` },
          selection: { anchor: selection.main.from, head: selection.main.from + insert.length },
        }
      } else {
        const isTitlePattern = new RegExp('^#+')
        const sameTitlePattern = selectedText.split(' ')[0] === mark
        let newText
        if (isTitlePattern.test(selectedText) && sameTitlePattern) {
          newText = selectedText.replace(/#/g, '').trim()
        } else if (!sameTitlePattern && isTitlePattern.test(selectedText)) {
          newText = `${mark} ${selectedText.replace(/#/g, '').trim()}`
        } else {
          newText = `${mark} ${selectedText}`
        }

        transaction = {
          changes: { from: selection.main.from, to: selection.main.to, insert: newText },
          selection: {
            anchor: selection.main.from,
            head: selection.main.from + newText.length,
          },
        }
      }

      dispatch(state.update(transaction))
      view.focus()
    },
  }
}

const titles = Array(4)
  .fill(1)
  .map((_, i) => generateTitleCommand(i + 1))

export default titles
