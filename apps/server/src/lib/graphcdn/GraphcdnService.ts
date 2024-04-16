import { injectable, singleton } from 'tsyringe'
import axios, { AxiosResponse } from 'axios'
import { ENV } from '@env'

interface Service {
  purgePost(id: string): Promise<AxiosResponse>
  purgeRecentPosts(): Promise<AxiosResponse>
  purgeUser(id: string): Promise<AxiosResponse>
}

@injectable()
@singleton()
export class GraphcdnService implements Service {
  private purge(query: string) {
    return axios.post(
      'https://admin.graphcdn.io/velog',
      {
        query,
      },
      {
        headers: {
          'graphcdn-token': ENV.graphcdnToken,
        },
      },
    )
  }
  public purgePost(id: string) {
    return this.purge(`
  mutation {
    purgePost(id: "${id}")
  }
    `)
  }
  public purgeRecentPosts() {
    return this.purge(`
    mutation {
      _purgeOperationName(names: ["RecentPosts"])
    }
    `)
  }
  public purgeUser(id: string) {
    return this.purge(`
    mutation {
      purgeUser(id: "${id}")
    }`)
  }
}
