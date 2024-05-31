import { Axios } from 'axios'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export const axios: Axios = require('axios')
