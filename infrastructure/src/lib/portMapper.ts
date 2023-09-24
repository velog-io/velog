import { ENV } from '../env'

export const portMapper = {
  web: ENV.webV3Port,
  server: ENV.serverPort,
  cron: ENV.cronPort,
}
