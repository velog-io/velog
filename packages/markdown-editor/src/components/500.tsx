import { useMounted } from '../nextra/hooks'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { getGitIssueUrl, renderComponent } from '../utils'
import { Anchor } from './anchor'

export function ServerSideErrorPage(): ReactElement | null {
  const config = useConfig()
  const mounted = useMounted()
  const { content, labels } = config.serverSideError
  if (!content) {
    return null
  }

  return (
    <p className="nx-text-center">
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Got server-side error in \`${mounted ? '' : ''}\` url. Please fix!`,
          labels,
        })}
        newWindow
        className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
      >
        {renderComponent(content)}
      </Anchor>
    </p>
  )
}
