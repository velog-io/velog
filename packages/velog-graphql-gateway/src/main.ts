import app from './app.js'
import { ENV } from './env.js'

function main() {
  app.listen({ port: ENV.port })
}

main()
