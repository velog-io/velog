import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export function Steps({ children, className, ...props }: ComponentProps<'div'>): ReactElement {
  return (
    <div
      className={cn(
        'nextra-steps nx-mb-12 nx-ml-4 nx-border-l nx-border-gray-200 nx-pl-6',
        '[counter-reset:step] dark:nx-border-neutral-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
