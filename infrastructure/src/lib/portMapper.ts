import { ENV } from '../../env'

export const portMapper = {
  web: ENV.webPort,
  server: ENV.serverPort,
  cron: ENV.cronPort,
}
