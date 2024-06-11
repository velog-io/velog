import { forwardRef, useEffect } from 'react'
import cn from 'clsx'
import { useSidebar } from '@/contexts/sidebar'
import { useRouter } from 'next/router'
import { useFSRoute } from '@/nextra/hooks'
import { ArrowRightIcon } from '@/nextra/icons'
import { useDndTree } from '..'
import { classes, indentStyle } from '../../style'
import type { SortableTreeComponentProps } from '../types'

export const SortableItemFolder = forwardRef<HTMLDivElement, SortableTreeComponentProps>(
  (props, ref) => {
    const { setDragItem } = useDndTree()
    const { setFocusedItem } = useSidebar()
    const router = useRouter()
    const routeOriginal = useFSRoute()
    const [route] = routeOriginal.split('#')

    const {
      wrapperRef,
      handleProps,
      isGhost,
      isOver,
      depth,
      style,
      indentationWidth,
      item,
      onCollapse,
    } = props

    const active = !isGhost && [route, route + '/'].includes(item.route + '/')
    const open = isGhost ? false : item.collapsed

    useEffect(() => {
      if (!isGhost) return
      setDragItem(item)
    }, [isGhost])

    const isLink = 'withIndexPage' in item && item.withIndexPage
    return (
      <li
        ref={wrapperRef}
        className={cn(
          { active, open },
          classes.link,
          active ? classes.active : classes.inactive,
          isOver && classes.over,
          isGhost && classes.drag,
        )}
        style={{ ...style, ...indentStyle(depth, indentationWidth) }}
        onClick={() => onCollapse(item.id)}
      >
        <div
          ref={ref}
          {...handleProps}
          className={cn(
            'nx-flex nx-w-full nx-items-center nx-justify-between nx-gap-2',
            !isLink && 'nx-w-full nx-text-left',
          )}
          onClick={(e) => {
            e.preventDefault()
            if (isGhost) return
            router.push(item.route, item.route, { shallow: true })
            setFocusedItem(item)
          }}
        >
          <div className={cn('nx-w-full nx-px-2 nx-py-1.5 [word-break:break-word]')}>
            {item.title}
          </div>
          <ArrowRightIcon
            onClick={() => onCollapse(item.id)}
            className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
            pathClassName={cn(
              'nx-origin-center nx-transition-transform rtl:-nx-rotate-180',
              open && 'ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]',
            )}
          />
        </div>
        {/* <Collapse
        className={cn('ltr:nx-pr-0 rtl:nx-pl-0')}
        isOpen={isCollapseOpen}
        isGhost={isGhost}
      ></Collapse> */}
      </li>
    )
  },
)
