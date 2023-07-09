import { EffectCallback, useEffect, useRef, useState } from 'react'

export default function useEffectOnce(effect: EffectCallback) {
  const effectFn = useRef<EffectCallback>(effect)
  const destroyFn = useRef<EffectCallback>()
  const effectCalled = useRef(false)
  const rendered = useRef(false)
  const [, refresh] = useState(0)

  if (effectCalled.current) {
    rendered.current = true
  }

  useEffect(() => {
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current
      effectCalled.current = true
    }

    refresh(1)

    return () => {
      if (rendered.current === false) return
      if (destroyFn.current) destroyFn.current
    }
  }, [])
}
