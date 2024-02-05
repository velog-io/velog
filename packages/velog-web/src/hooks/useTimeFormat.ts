'use client'

import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'
import koLocale from 'date-fns/locale/ko'
import { utcToZonedTime } from 'date-fns-tz'
import { useEffect, useState } from 'react'

export function useTimeFormat(date: string) {
  const [isLoading, setLoading] = useState(true)
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    setLoading(true)

    const targetDate = utcToZonedTime(new Date(date), 'Asia/Seoul')
    const now = utcToZonedTime(new Date(), 'Asia/Seoul')
    const diff = now.getTime() - targetDate.getTime()

    const getTimeDescription = () => {
      // less than 5 minutes
      if (diff < 1000 * 60 * 5) {
        return '방금 전'
      }
      if (diff < 1000 * 60 * 60 * 24) {
        return formatDistanceToNow(targetDate, { addSuffix: true, locale: koLocale })
      }
      if (diff < 1000 * 60 * 60 * 36) {
        return '어제'
      }
      if (diff < 1000 * 60 * 60 * 24 * 7) {
        return formatDistanceToNow(targetDate, { addSuffix: true, locale: koLocale })
      }
      return format(targetDate, 'yyyy년 M월 d일')
    }

    setTime(getTimeDescription())
    setLoading(false)
  }, [date])

  return { isLoading, time }
}
