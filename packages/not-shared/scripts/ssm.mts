import { SSMScript } from '@packages/scripts'

const flag = process.argv.slice(2, 10).join(',')

if (!flag.includes('development')) {
  console.log('Environment variable not found, skipping the operation.')
} else {
  const ssmScript = new SSMScript({ packageName: 'not-shared' })
  ssmScript.execute()
}
