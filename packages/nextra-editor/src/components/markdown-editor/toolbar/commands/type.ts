import { EditorView, KeyBinding } from '@codemirror/view'
import React, { ReactElement } from 'react'

export type ToolbarCommand = {
  name: string
  icon: ReactElement | React.RefAttributes<SVGSVGElement>
  keyCommand?: string
  button?: React.ButtonHTMLAttributes<HTMLButtonElement>
  execute(view: EditorView | null): void
  keymap?: KeyBinding
}
