import { SerializedPost } from '@services/PostService'

export type IntegrationTokenData = {
  integrated_user_id: string
  type: 'integration'
  app_identifier: 'codenary'
}

export type NotifyParams =
  | {
      type: 'created' | 'updated'
      post: SerializedPost
    }
  | {
      type: 'deleted'
      post_id: string
    }
