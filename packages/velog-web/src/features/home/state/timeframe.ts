import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type Timeframe = 'day' | 'week' | 'month' | 'year'
type TimeframeState = {
  timeframe: Timeframe
  isFetching: boolean
}

const initialState: TimeframeState = {
  timeframe: 'week',
  isFetching: false,
}

const timeframeState = sangte(initialState, (prev) => ({
  choose(time: Timeframe) {
    prev.timeframe = time
  },
  setIsFetching(value: boolean) {
    prev.isFetching = value
  },
}))

export function useTimeframeValue() {
  return useSangteValue(timeframeState)
}

export function useTimeframe() {
  const value = useSangteValue(timeframeState)
  const actions = useSangteActions(timeframeState)
  return { value, actions }
}
