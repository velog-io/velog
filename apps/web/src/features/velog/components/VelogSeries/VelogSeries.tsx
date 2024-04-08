'use client'

import { useGetUserSeriesListQuery } from '@/graphql/server/generated/server'
import SeriesListSkeleton from '../SeriesList/SeriesListSkeleton'
import SeriesList from '../SeriesList'

type Props = {
  username: string
}

function VelogSeries({ username }: Props) {
  const { data, isLoading, isError } = useGetUserSeriesListQuery({
    input: { username },
  })

  if (isError) {
    throw new Error('Get user series list error')
  }

  if (isLoading || !data || !data.user || !data.user.series_list) {
    return <SeriesListSkeleton />
  }

  return <SeriesList list={data.user.series_list} username={username} />
}

export default VelogSeries
