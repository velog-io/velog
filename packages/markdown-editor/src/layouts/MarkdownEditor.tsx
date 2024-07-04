import { ConfigProvider } from '@/contexts'
import { MarkdownEditorProvider } from '@/contexts/markdown-editor'
import { SidebarProvider } from '@/contexts/sidebar'
import type { NextraThemeLayoutProps } from '@/nextra/types'
import type { ReactElement } from 'react'
import { InnerLayout } from './InnerLayout'
import { ModalProvider } from '@/contexts/modal'
import { Potals } from '@/components/potals'

type NextraDocLayoutProps = NextraThemeLayoutProps & {
  editorValue: string
}

export function MarkdownEditor({
  children,
  editorValue,
  ...context
}: NextraDocLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <MarkdownEditorProvider value={{ editorValue }}>
        <ModalProvider>
          <SidebarProvider>
            <Potals />
            <InnerLayout {...context.pageOpts}>{children}</InnerLayout>
          </SidebarProvider>
        </ModalProvider>
      </MarkdownEditorProvider>
    </ConfigProvider>
  )
}
