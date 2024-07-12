import { ConfigProvider } from '@/contexts'
import { MarkdownEditorProvider } from '@/contexts/markdown-editor'
import { SidebarProvider } from '@/contexts/sidebar'
import type { NextraThemeLayoutProps } from '@/nextra/types'
import type { ReactElement } from 'react'
import { Main } from './main'
import { ModalProvider } from '@/contexts/modal'
import { Potals } from '@/components/potals'
import { Toaster } from 'react-hot-toast'

type NextraDocLayoutProps = NextraThemeLayoutProps & {
  editorValue: string
}

export function Layout({ children, editorValue, ...context }: NextraDocLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <Toaster />
      <ModalProvider>
        <SidebarProvider>
          <MarkdownEditorProvider value={{ editorValue }}>
            <Potals />
            <Main {...context.pageOpts}>{children}</Main>
          </MarkdownEditorProvider>
        </SidebarProvider>
      </ModalProvider>
    </ConfigProvider>
  )
}
