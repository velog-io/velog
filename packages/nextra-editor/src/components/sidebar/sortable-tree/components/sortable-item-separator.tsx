import cn from 'clsx'
import { forwardRef, useEffect } from 'react'
import { useDndTree } from '..'
import { classes, indentStyle } from '../../style'
import { SortableTreeComponentProps } from '../types'

export const SortableItemSeparator = forwardRef<HTMLDivElement, SortableTreeComponentProps>(
  (props, ref) => {
    const { setDragItem } = useDndTree()

    const { wrapperRef, handleProps, isGhost, isOver, depth, indentationWidth, style, item } = props

    useEffect(() => {
      if (!isGhost) return
      setDragItem(item)
    }, [isGhost])

    return (
      <li
        ref={wrapperRef}
        className={cn(
          'nx-relative',
          '[word-break:break-word]',
          'nx-mb-2 nx-mt-5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100',
          isOver && classes.over,
          isGhost && classes.ghost,
        )}
        style={{ ...style, ...indentStyle(depth, indentationWidth) }}
      >
        <div ref={ref} {...handleProps} className={cn('cursor-default', 'nx-px-2 nx-py-1.5')}>
          {item.title}
        </div>
      </li>
    )
  },
)
