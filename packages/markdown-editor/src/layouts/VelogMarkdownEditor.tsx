import { ConfigProvider } from '@/contexts'
import { MarkdownEditorProvider } from '@/contexts/markdown-editor'
import { SidebarProvider } from '@/contexts/sidebar'
import type { NextraThemeLayoutProps } from '@/nextra/types'
import type { ReactElement } from 'react'
import { InnerLayout } from './InnerLayout'

type NextraDocLayoutProps = NextraThemeLayoutProps & {
  editorValue: string
}

export function VelogMarkdownEditor({
  children,
  editorValue,
  ...context
}: NextraDocLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <MarkdownEditorProvider value={{ editorValue }}>
        <SidebarProvider>
          <InnerLayout {...context.pageOpts}>{children}</InnerLayout>
        </SidebarProvider>
      </MarkdownEditorProvider>
    </ConfigProvider>
  )
}
