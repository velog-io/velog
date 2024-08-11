import { Series } from '@/graphql/server/generated/server'

export type UserSeriesList = Omit<Series, 'created_at' | 'fk_user_id' | 'user' | 'series_posts'>
