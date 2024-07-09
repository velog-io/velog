import { EditorState, Extension } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { tags } from '@lezer/highlight'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { darkTheme, lightTheme } from './theme'
import { basicSetup, type BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup'
import { codeKeymap } from '../toolbar/commands/code'
import { boldKeymap } from '../toolbar/commands/bold'
import { italicKeymap } from '../toolbar/commands/italic'
import { linkKeymap } from '../toolbar/commands/link'
import { strikeKeymap } from '../toolbar/commands/strike'
import { quoteKeymap } from '../toolbar/commands/quote'
import { saveKeymap } from '../toolbar/commands/save'

export type ExtensionOptions = {
  indentWithTab?: boolean
  basicSetup?: boolean | BasicSetupOptions
  placeholder?: string | HTMLElement
  theme?: 'light' | 'dark' | 'none' | Extension
  readOnly?: boolean
  editable?: boolean
  defaultSyntax?: boolean
}

export const getDefaultExtensions = (options: ExtensionOptions) => {
  const {
    indentWithTab: defaultIndentWithTab = true,
    editable = true,
    readOnly = false,
    theme = 'light',
    placeholder: placeholderStr = '',
    basicSetup: defaultBasicSetup = true,
    defaultSyntax = true,
  } = options

  const getExtensions: Extension[] = []

  const keymaps = [
    boldKeymap,
    italicKeymap,
    strikeKeymap,
    quoteKeymap,
    linkKeymap,
    codeKeymap,
    saveKeymap,
  ]

  if (defaultIndentWithTab) {
    keymaps.unshift(indentWithTab)
  }

  getExtensions.unshift(keymap.of(keymaps))

  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === 'boolean') {
      getExtensions.unshift(basicSetup())
    } else {
      getExtensions.unshift(basicSetup(defaultBasicSetup))
    }
  }

  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr))
  }

  switch (theme) {
    case 'light':
      getExtensions.push(lightTheme.quietlight)
      break
    case 'dark':
      getExtensions.push(darkTheme.material)
      break
    case 'none':
      break
  }

  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false))
  }

  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true))
  }

  if (defaultSyntax) {
    const headHighlightStyle = HighlightStyle.define([
      { tag: tags.heading1, class: 'cm-heading1' },
      { tag: tags.heading2, class: 'cm-heading2' },
      { tag: tags.heading3, class: 'cm-heading3' },
      { tag: tags.heading4, class: 'cm-heading4' },
      { tag: tags.heading5, class: 'cm-heading5' },
    ])

    getExtensions.push(syntaxHighlighting(headHighlightStyle))
  }

  return [...getExtensions]
}
