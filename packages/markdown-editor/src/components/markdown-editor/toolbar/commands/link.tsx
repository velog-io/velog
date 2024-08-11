import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'
import { EditorView, KeyBinding } from '@codemirror/view'

export const linkKeymap: KeyBinding = {
  linux: 'Shift-Ctrl-l',
  win: 'Shift-Ctrl-l',
  mac: 'Shift-Meta-l',
  run: (view) => {
    execute(view)
    return true
  },
  preventDefault: true,
}

const link: ToolbarCommand = {
  name: 'link',
  keyCommand: 'link',
  button: { 'aria-label': 'Add link' },
  icon: (
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  execute,
}

function execute(view: EditorView | null) {
  if (!view) return
  const { state, dispatch } = view
  const selection = state.selection
  const selectedText = state.doc.sliceString(selection.main.from, selection.main.to)

  let transaction: TransactionSpec
  if (selectedText.length === 0) {
    transaction = {
      changes: {
        from: selection.main.from,
        insert: '[설명]()',
      },
      selection: { anchor: selection.main.from + 5 },
    }
  } else {
    const urlPattern = /^(https?:\/\/[^\s]+)$/
    const isUrl = urlPattern.test(selectedText)
    const linkText = isUrl ? `[](${selectedText})` : `[${selectedText}]()`

    transaction = {
      changes: { from: selection.main.from, to: selection.main.to, insert: linkText },
      selection: {
        anchor: isUrl ? selection.main.from + 1 : selection.main.from + linkText.length - 1,
      },
    }
  }

  dispatch(state.update(transaction))
  view.focus()
}

export default link
