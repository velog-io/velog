'use client'

import { useEffect, useState } from 'react'

export default function useAdblockDetect(): boolean {
  const [adBlockDetected, setAdBlockDetected] = useState(false)

  useEffect(() => {
    const url = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    // 'https://www3.doubleclick.net'
    // "https://static.ads-twitter.com/uwt.js"
    fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    }).catch(() => {
      setAdBlockDetected(true)
    })
  }, [])

  return adBlockDetected
}
