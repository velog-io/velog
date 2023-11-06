import { Series } from '@/graphql/generated'

export type UserSeriesList = Omit<Series, 'created_at' | 'fk_user_id' | 'user' | 'series_posts'>
