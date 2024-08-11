import { axios } from '@packages/commonjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  sendSlackMessage(message: string, customChannel?: string): void
}

@injectable()
@singleton()
export class SlackService implements Service {
  sendSlackMessage(message: string, customChannel?: string) {
    const slackUrl = `https://hooks.slack.com/services/${customChannel ?? process.env.SLACK_TOKEN}`
    return axios.post(slackUrl, {
      text: message,
    })
  }
}
