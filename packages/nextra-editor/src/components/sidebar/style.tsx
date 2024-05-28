import cn from 'clsx'

export const classes = {
  link: cn(
    'nx-flex nx-rounded nx-text-sm nx-transition-colors [word-break:break-word]',
    'nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border nx-pr-2',
  ),
  inactive: cn(
    'nx-text-gray-500 hover:nx-text-gray-900',
    'dark:nx-text-neutral-400 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
    'contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50',
  ),
  active: cn(
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  list: cn('nx-flex nx-flex-col nx-gap-1'),
  // drag: cn(
  //   'nx-transform-gpu nx-w-full nx-max-h-px nx-overflow-hidden nx-bg-transparent nx-text-transparent nx-opcity-80',
  // ),
  over: cn('nx-bg-red-100 dark:nx-bg-neutral-800'),
  drag: cn('nx-opacity-50'),
}
