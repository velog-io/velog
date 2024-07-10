import cn from 'clsx'
import { CustomEventDetail, nextraCustomEventName } from '..'
import { useEffect, useState } from 'react'

function DeployButton({}) {
  const [isDeploying, setIsDeploying] = useState<Boolean>(false)

  useEffect(() => {
    const deployEndEvent = (e: CustomEventInit<CustomEventDetail['deployEndEvent']>) => {
      if (!e?.detail) return
      console.log('deployEndEvent', e.detail.publishedUrl)
      setIsDeploying(false)
    }
    window.addEventListener(nextraCustomEventName.deployEndEvent, deployEndEvent)
    return () => {
      window.removeEventListener(nextraCustomEventName.deployEndEvent, deployEndEvent)
    }
  }, [])

  const onClick = () => {
    if (isDeploying) return
    setIsDeploying(true)
    const event = new CustomEvent<CustomEventDetail['deployStartEvent']>(
      nextraCustomEventName.deployStartEvent,
      {},
    )
    window.dispatchEvent(event)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'nx-z-20 nx-flex nx-select-none nx-items-center nx-transition-opacity',
        'nx-rounded nx-bg-white nx-px-2 nx-py-1.5 nx-font-mono nx-text-[16px] nx-font-medium nx-text-gray-500',
        'nx-border dark:nx-border-gray-100 dark:nx-bg-dark/50 dark:nx-text-gray-100',
        'contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current',
        'hover:nx-shadow-md:hover nx-shadow-gray-100 hover:nx-border-gray-300 hover:nx-bg-slate-50 hover:nx-shadow-gray-100',
        'dark:hover:nx-border-gray-50 dark:hover:nx-bg-neutral-900 dark:hover:nx-shadow-none',
        isDeploying
          ? 'nx-translate-y-[0px] nx-cursor-not-allowed nx-bg-gray-400/20 nx-opacity-50 dark:nx-bg-neutral-800'
          : 'nx-cursor-pointer active:nx-translate-y-[1px] active:nx-bg-gray-400/20 dark:active:nx-bg-neutral-800',
      )}
    >
      {isDeploying ? '출판 중...' : '출판하기'}
    </button>
  )
}

export default DeployButton
