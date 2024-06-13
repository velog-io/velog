import cn from 'clsx'

export const classes = {
  link: cn(
    'nx-relative nx-flex nx-rounded nx-text-sm nx-transition-colors [word-break:break-word]',
    'nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border nx-pr-2',
  ),
  active: cn(
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  inactive: cn(
    'nx-text-gray-500',
    'dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
    'contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50',
  ),
  inactiveBgColor: cn(
    'hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
  ),
  list: cn('nx-flex nx-flex-col nx-gap-2 nx-list-none'),
  border: cn(
    'nx-relative before:nx-absolute before:nx-inset-y-1',
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    'ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0',
  ),
  ghost: cn('nx-opacity-80 nx-bg-primary-50 hover:nx-bg-transparent'),
  clone: cn(
    'nx-opacity-80',
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  separator: cn(
    'nx-mb-2 nx-mt-5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100',
  ),
  over: cn('nx-bg-red-100 dark:nx-bg-primary-100/5'),
}

export const indentStyle = (depth: number, indentationWidth: number): string =>
  `${depth * indentationWidth}px`
