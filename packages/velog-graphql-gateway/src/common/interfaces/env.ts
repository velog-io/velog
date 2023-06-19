export type Envrionment = 'development' | 'production' | 'test'
export type EnvFiles = Record<Envrionment, string>
export type EnvVars = {
  appEnv: Envrionment
  port: number
  velogV2Api: string
  velogV3Api: string
}
