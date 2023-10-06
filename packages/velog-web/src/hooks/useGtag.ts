'use client'

export default function useGtag() {
  function gtag(action: EventAction, eventOptions: EventOptions) {
    if (!window.gtag) return
    window.gtag('event', action, eventOptions)
  }
  return { gtag }
}

type EventAction = 'recommend_click' | 'recommend_guest_click' | 'ads_click' | Gtag.EventNames

type EventOptions =
  | {
      userId?: string
    }
  | Gtag.ControlParams
  | Gtag.EventParams
  | Gtag.CustomParams
