import { createRequire } from 'node:module'
import type { Axios } from 'axios'

const require = createRequire(import.meta.url)
const axios: Axios = require('axios')

export default axios
