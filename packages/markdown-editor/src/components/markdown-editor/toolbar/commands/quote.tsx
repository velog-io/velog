import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'
import { EditorView, KeyBinding } from '@codemirror/view'

export const quoteKeymap: KeyBinding = {
  linux: 'Shift-Ctrl->',
  win: 'Shift-Ctrl->',
  mac: 'Shift-Meta->',
  run: (view) => {
    execute(view)
    return true
  },
  preventDefault: true,
}

const quote: ToolbarCommand = {
  name: 'quote',
  keyCommand: 'quote',
  button: { 'aria-label': 'Add quote text' },
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
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
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
        to: selection.main.to,
        insert: `> `,
      },
      selection: { anchor: selection.main.from, head: selection.main.from + 2 },
    }
  } else {
    const quotePattern = /^>\s(.*)$/
    let newText

    if (quotePattern.test(selectedText)) {
      newText = selectedText.replace(/^>\s?/g, '')
    } else {
      newText = `> ${selectedText}`
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
}

export default quote
