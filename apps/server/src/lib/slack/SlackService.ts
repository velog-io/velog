import Axios from 'axios'
import { injectable, singleton } from 'tsyringe'

interface Service {
  sendSlackMessage(message: string, customChannel?: string): void
}

@injectable()
@singleton()
export class SlackService implements Service {
  sendSlackMessage(message: string, customChannel?: string) {
    const slackUrl = `https://hooks.slack.com/services/${customChannel ?? process.env.SLACK_TOKEN}`
    return Axios.post(slackUrl, {
      text: message,
    })
  }
}
