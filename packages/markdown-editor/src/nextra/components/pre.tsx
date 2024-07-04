import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import { WordWrapIcon } from '../icons'
import { Button } from './button'
import { CopyToClipboard } from './copy-to-clipboard'

export const Pre = ({
  children,
  className,
  hasCopyCode,
  filename,
  ...props
}: ComponentProps<'pre'> & {
  filename?: string
  hasCopyCode?: boolean
}): ReactElement => {
  const preRef = useRef<HTMLPreElement | null>(null)

  const toggleWordWrap = useCallback(() => {
    const htmlDataset = document.documentElement.dataset
    const hasWordWrap = 'nextraWordWrap' in htmlDataset
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap
    } else {
      htmlDataset.nextraWordWrap = ''
    }
  }, [])

  return (
    <div className="nextra-code-block nx-relative nx-mt-6 first:nx-mt-0">
      {filename && (
        <div className="nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-bg-primary-700/5 nx-px-4 nx-py-2 nx-text-xs nx-text-gray-700 dark:nx-bg-primary-300/10 dark:nx-text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={cn(
          'nx-mb-4 nx-overflow-x-auto nx-rounded-xl nx-bg-primary-700/5 nx-text-[.9em] nx-subpixel-antialiased dark:nx-bg-primary-300/10',
          'contrast-more:nx-border contrast-more:nx-border-primary-900/20 contrast-more:nx-contrast-150 contrast-more:dark:nx-border-primary-100/40',
          filename ? 'nx-pb-4 nx-pt-12' : 'nx-py-4',
          className,
        )}
        ref={preRef}
        {...props}
      >
        {children}
      </pre>
      <div
        className={cn(
          'nx-opacity-0 nx-transition focus-within:nx-opacity-100 [div:hover>&]:nx-opacity-100',
          'nx-absolute nx-right-0 nx-m-[11px] nx-flex nx-gap-1',
          filename ? 'nx-top-8' : 'nx-top-0',
        )}
      >
        <Button onClick={toggleWordWrap} className="md:nx-hidden" title="Toggle word wrap">
          <WordWrapIcon className="nx-pointer-events-none nx-h-4 nx-w-4" />
        </Button>
        {hasCopyCode && (
          <CopyToClipboard
            getValue={() => preRef.current?.querySelector('code')?.textContent || ''}
          />
        )}
      </div>
    </div>
  )
}
