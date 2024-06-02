import { Axios } from 'axios'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const axios: Axios = require('axios')

export default axios
