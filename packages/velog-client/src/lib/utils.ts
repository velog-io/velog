import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'
import koLocale from 'date-fns/locale/ko'
import { zonedTimeToUtc } from 'date-fns-tz'

const formate = (data: Date) => format(data, 'yyyy-MM-dd HH:MM:SS')

export const formatDate = (date: string): string => {
  const d = new Date(date)
  const now = zonedTimeToUtc(new Date(), 'Asia/Seoul')
  const diff = now.getTime() - d.getTime()

  // less than 5 minutes
  if (diff < 1000 * 60 * 5) {
    return '방금 전'
  }
  if (diff < 1000 * 60 * 60 * 24) {
    return distanceInWordsToNow(d, { addSuffix: true, locale: koLocale })
  }
  if (diff < 1000 * 60 * 60 * 36) {
    return '어제'
  }
  if (diff < 1000 * 60 * 60 * 24 * 7) {
    return distanceInWordsToNow(d, { addSuffix: true, locale: koLocale })
  }
  return format(d, 'yyyy년 M월 d일')
}
