import { sangte, useSangteActions, useSangteValue } from 'sangte'

export type Timeframe = 'day' | 'week' | 'month' | 'year'
type TimeframeState = {
  timeframe: Timeframe
  isLoading: boolean
}

const initialState: TimeframeState = {
  timeframe: 'week',
  isLoading: false,
}

const timeframeState = sangte(initialState, (prev) => ({
  choose(time: Timeframe) {
    prev.timeframe = time
  },
  setLoading(value: boolean) {
    prev.isLoading = value
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
